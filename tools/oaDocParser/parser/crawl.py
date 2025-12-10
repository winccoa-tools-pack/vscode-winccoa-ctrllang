import re
import time
import json
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup

BASE = "https://www.winccoa.com/documentation/WinCCOA/latest/en_US/"
CONTROL_URL = urljoin(BASE, "Control_Grundlagen/CONTROL.html")
SESSION = requests.Session()
SESSION.headers["User-Agent"] = "WinCCOA-VSCode-Indexer/1.0"

def get_soup(url: str) -> BeautifulSoup:
    resp = SESSION.get(url)
    resp.raise_for_status()
    return BeautifulSoup(resp.text, "html.parser")

def get_function_index_pages():
    """
    Systematically tries all letters A-Z to find function index pages.
    Some letters (like J, K) are not linked on the main page but exist.
    """
    # URLs für bekannte Verzeichnisse
    base_urls = [
        urljoin(BASE, "ControlA_D/functions_{}.html"),
        urljoin(BASE, "ControlE_R/functions_{}.html"),
        urljoin(BASE, "ControlS_Z/functions_{}.html"),
    ]
    
    index_pages = []
    for letter in "abcdefghijklmnopqrstuvwxyz":
        found = False
        for base_template in base_urls:
            url = base_template.format(letter)
            try:
                resp = SESSION.head(url, timeout=5)
                if resp.status_code == 200:
                    index_pages.append(url)
                    found = True
                    break
            except:
                continue
        
        if not found:
            # Fallback: Bei Fehler trotzdem versuchen (manche Server blockieren HEAD)
            # Wir probieren nur ControlE_R (mittleres Alphabet) für J/K
            url = urljoin(BASE, f"ControlE_R/functions_{letter}.html")
            try:
                resp = SESSION.get(url, timeout=5)
                if resp.status_code == 200 and 'Functions {}'.format(letter.upper()) in resp.text:
                    index_pages.append(url)
            except:
                pass
    
    return sorted(set(index_pages))

def get_function_links(index_url: str):
    soup = get_soup(index_url)
    links = []
    # Tabelle: erste Spalte sind Funktionslinks
    for row in soup.select("table tr"):
        a = row.find("a")
        if not a:
            continue
        name = a.get_text(strip=True)
        href = a.get("href")
        if not href:
            continue
        url = urljoin(index_url, href)
        links.append((name, url))
    return links

def extract_section_text(start_tag):
    parts = []
    for sib in start_tag.next_siblings:
        if getattr(sib, "name", None) in ("h1", "h2", "h3"):
            break
        text = getattr(sib, "get_text", lambda **_: "")(strip=True)
        if text:
            parts.append(text)
    return "\n".join(parts).strip()

def parse_function_page(url: str, group_letter: str):
    print(f"[DEBUG]     Lade Funktionsseite: {url}")
    soup = get_soup(url)

    # 1. Richtiges <h1> finden (Funktionsüberschrift)
    h1_candidates = soup.find_all("h1")
    h1 = None

    for cand in h1_candidates:
        text = cand.get_text(strip=True)
        if "(" in text and ")" in text:
            h1 = cand
            break

    # Fallback: wenn nichts mit "()" gefunden -> letztes h1 nehmen
    if h1 is None and h1_candidates:
        h1 = h1_candidates[-1]

    if not h1:
        print("[ERROR]     Kein geeignetes <h1> gefunden.")
        return None

    label = h1.get_text(strip=True)
    name = re.sub(r"\(.*\)$", "", label).strip().strip('"')

    print(f"[DEBUG]     Erkannter Funktions-Header: {label}")

    # 2. Kurzbeschreibung finden
    short_description = None

    # a) Primär: innerhalb des umgebenden <article> ein <p> mit Klasse "shortdesc"
    article = h1.find_parent("article")
    if article:
        short_p = article.find(
            "p",
            class_=lambda c: c and "shortdesc" in c.split()
        )
        if short_p:
            short_description = short_p.get_text(" ", strip=True)

    # b) Fallback: erstes <p> nach h1 bis zum nächsten Heading
    if not short_description:
        for sib in h1.next_siblings:
            tag_name = getattr(sib, "name", None)
            if tag_name in ("h1", "h2", "h3"):
                break
            if tag_name == "p":
                text = sib.get_text(" ", strip=True)
                if text:
                    short_description = text
                    break

    if short_description:
        print(f"[DEBUG]     ShortDescription gefunden: {short_description}")
    else:
        print("[DEBUG]     Keine ShortDescription gefunden.")

    data = {
        "name": name,
        "label": label,
        "shortDescription": short_description,
        "signatures": [],
        "parameters": [],
        "returnValue": None,
        "errors": None,
        "description": None,
        "assignment": None,
        "availability": None,
        "related": [],
        "deprecated": False,
        "groupLetter": group_letter,
        "sourceUrl": url,
    }

    # 3. Deprecated-Erkennung
    if "deprecated" in label.lower() or "obsolete" in label.lower():
        data["deprecated"] = True

    # 4. Sections parsen (wie gehabt)
    for h2 in soup.find_all(["h2", "h3"]):
        title = h2.get_text(strip=True).lower()

        if "synopsis" in title:
            codes = [c.get_text(" ", strip=True) for c in h2.find_all_next("code")]
            sig_text = extract_section_text(h2)
            sigs = [s for s in sig_text.split("\n") if s.strip()]
            data["signatures"] = sigs or codes

        elif "parameter" in title:
            table = h2.find_next("table")
            params = []
            if table:
                for tr in table.find_all("tr"):
                    cols = [c.get_text(" ", strip=True) for c in tr.find_all(["td", "th"])]
                    if len(cols) >= 2 and cols[0].lower() != "parameter":
                        params.append({
                            "name": cols[0],
                            "description": " ".join(cols[1:]),
                        })
            else:
                text = extract_section_text(h2)
                for line in text.splitlines():
                    if not line.strip():
                        continue
                    m = re.match(r"^(\w+)\s+(.*)$", line.strip())
                    if m:
                        params.append({"name": m.group(1), "description": m.group(2)})
            data["parameters"] = params

        elif "return value" in title:
            data["returnValue"] = extract_section_text(h2)

        elif "errors" in title:
            data["errors"] = extract_section_text(h2)

        elif "description" in title:
            data["description"] = extract_section_text(h2)

        elif "assignment" in title:
            data["assignment"] = extract_section_text(h2)

        elif "availability" in title:
            txt = extract_section_text(h2)
            if txt:
                data["availability"] = [t.strip() for t in re.split(r"[,/]", txt) if t.strip()]

        elif "related information" in title:
            rel = []
            for sib in h2.next_siblings:
                if getattr(sib, "name", None) in ("h2", "h3"):
                    break
                for a in getattr(sib, "find_all", lambda *_, **__: [])("a"):
                    txt = a.get_text(strip=True)
                    href = a.get("href", "")
                    if "()" in txt and href:
                        rel.append(re.sub(r"\(.*\)$", "", txt).strip('"'))
            data["related"] = sorted(set(rel))

    return data

def build_index(output_path: str = "../../resources/winccoa-docs-crawled.json"):
    """
    Crawlt alle CONTROL Funktionsindexseiten (functions_a.html, functions_b.html, ...),
    sammelt alle Funktionslinks, fragt einmal zur Bestätigung
    und parst dann ALLE Funktionsseiten.

    Nach jedem erfolgreichen Parse wird der aktuelle Stand in eine JSON-Datei geschrieben.
    Ausführliches Logging, um den Ablauf transparent zu machen.
    """
    print("[INFO] Starte Crawl der CONTROL Funktionsindexseiten...\n")

    # 1. Alle Indexseiten abrufen
    index_pages = get_function_index_pages()
    if not index_pages:
        print("[ERROR] Keine Indexseiten gefunden.")
        return []

    print(f"[INFO] Gefundene Indexseiten: {len(index_pages)}")

    # 2. Für jede Indexseite alle Funktionslinks sammeln
    index_data = []  # Liste aus (group_letter, idx_url, func_links)
    total_functions = 0

    for idx_url in index_pages:
        m = re.search(r"functions_([a-z])", idx_url)
        group_letter = m.group(1).upper() if m else "?"

        func_links = get_function_links(idx_url)
        func_count = len(func_links)
        total_functions += func_count

        if func_count == 0:
            print(f"[WARN] Indexseite '{group_letter}' ({idx_url}) enthält keine Funktionen.")
        index_data.append((group_letter, idx_url, func_links))

    if total_functions == 0:
        print("[ERROR] Keine Funktionsseiten gefunden.")
        return []

    print(f"[INFO] In Summe werden {total_functions} Funktionsseiten geparst.")

    # 3. User-Confirmation
    choice = input("[INPUT] Crawl starten? [Y/n]: ").strip().lower()
    if choice not in ("", "y", "yes"):
        print("[INFO] Crawl vom Benutzer abgebrochen.")
        return []

    print("\n[INFO] Starte Parsing aller Funktionsseiten...\n")

    index = []

    # 4. Alle Funktionsseiten parsen
    for group_letter, idx_url, func_links in index_data:
        if not func_links:
            continue

        print(f"[INFO] -> Lese Indexseite '{group_letter}' ({idx_url})")
        print(f"[DEBUG]   Gefundene Funktionen ({len(func_links)}):")

        for name, url in func_links:
            print(f"[INFO]   -> Parsen der Funktion: {name}")
            print(f"[DEBUG]     URL: {url}")

            try:
                fn_data = parse_function_page(url, group_letter)
            except Exception as e:
                print(f"[ERROR] Exception beim Parsen von '{name}': {e}")
                print("")
                continue

            if fn_data:
                print(f"[SUCCESS] Parsed '{fn_data['name']}' erfolgreich!")
                index.append(fn_data)

                # Nach jedem erfolgreichen Parse JSON aktualisieren
                try:
                    with open(output_path, "w", encoding="utf-8") as f:
                        json.dump(index, f, ensure_ascii=False, indent=2)
                    print(f"[SAVED] Aktueller Stand in '{output_path}' geschrieben.\n")
                except Exception as e:
                    print(f"[ERROR] Konnte Datei '{output_path}' nicht schreiben: {e}\n")
            else:
                print(f"[ERROR] Konnte '{name}' nicht parsen!\n")

            time.sleep(0.2)  # bewusst langsam & höflich

    print("[INFO] Crawl beendet.")
    print(f"[INFO] Gesamt erfolgreich geparste Funktionen: {len(index)}")

    return index


if __name__ == "__main__":
    build_index()
