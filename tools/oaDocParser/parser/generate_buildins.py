import json
import re
import html
from pathlib import Path

SOURCE_PATH = Path("../../resources/winccoa-docs-crawled.json")
TARGET_PATH = Path("../../resources/winccoa-functions-cleaned.json")


def clean_text(text: str) -> str:
    """Normalisiert Whitespace und entfernt offensichtliche Artefakte."""
    if not text:
        return ""
    text = html.unescape(text)
    text = re.sub(r"[\r\n\t]+", " ", text)          # Newlines/Tabs -> Space
    text = re.sub(r"\s{2,}", " ", text)             # Mehrere Spaces -> einer
    text = re.sub(r"\s+([.,;:!?])", r"\1", text)    # Space vor Satzzeichen
    return text.strip()


def parse_signature(sig_block: str):
    """
    Nimmt einen kompletten Signatur-Block (evtl. mehrere Zeilen / mehrere Signaturen)
    und extrahiert die ERSTE Funktionssignatur der Form:

      'int addGroupPVSS(string osID, string groupName, langString fullName = "", langString comment="");'

    Gibt (return_type, name, [raw_param_strings]) zurück.
    """
    if not sig_block:
        return None, None, []

    sig_block = clean_text(sig_block)
    sig_block = re.sub(r"[;{]+\s*$", "", sig_block).strip()

    # Wir suchen das erste 'retType funcName(params)' Muster im gesamten Block.
    #  - retType: alles bis zum Funktionsnamen
    #  - funcName: Identifier
    #  - params: alles bis zur schließenden Klammer
    match = re.search(
        r"(?P<ret>[A-Za-z_][A-Za-z0-9_<>:\s\*]*?)\s+"
        r"(?P<name>[A-Za-z_][A-Za-z0-9_]*)\s*"
        r"\((?P<params>[^)]*)\)",
        sig_block,
    )

    if not match:
        print(f"[WARN] parse_signature: konnte keine Signatur finden in: '{sig_block}'")
        return None, None, []

    return_type = match.group("ret").strip()
    name = match.group("name").strip()
    params_str = (match.group("params") or "").strip()

    if not params_str or params_str.lower() == "void":
        return return_type, name, []

    # Parameter an Kommas trennen (Signaturen sind simpel genug)
    raw_params = [p.strip() for p in params_str.split(",") if p.strip()]
    return return_type, name, raw_params


def parse_param(raw: str):
    """
    Parsed einen einzelnen Parameter wie:
      'int manId'
      'anytype &value'
      '[int flags]'
      'langString fullName = ""'
      'int len[, bool bigEndian]'
    und liefert:
      { "name": str, "type": str, "optional": bool, "byRef": bool }
    """
    if not raw:
        return None

    text = clean_text(raw)
    optional = False
    by_ref = False

    # Optional: [ ... ] um den gesamten Param
    if text.startswith("[") and text.endswith("]"):
        optional = True
        text = text[1:-1].strip()

    # Optional-Syntax innerhalb (z.B. 'int len[, bool bigEndian]')
    # Hier behandeln wir nur den gesamten Parameter; feiner wird sonst schnell messy.
    if "[" in text and "]" in text and not optional:
        optional = True
        text = text.replace("[", "").replace("]", "").strip()

    # Default-Wert abschneiden: 'type name = irgendwas'
    if "=" in text:
        text = text.split("=", 1)[0].strip()

    # & normalisieren
    text = re.sub(r"\s*&\s*", " & ", text)
    text = re.sub(r"\s{2,}", " ", text)

    parts = text.split()
    if not parts:
        return None

    if "&" in parts:
        # z.B. 'blob & target'
        amp_index = parts.index("&")
        type_part = " ".join(parts[:amp_index]).strip()
        if amp_index + 1 >= len(parts):
            return None
        name_part = parts[amp_index + 1].strip()
        by_ref = True
    else:
        # letzter Token = Name, Rest = Typ
        if len(parts) == 1:
            return None
        type_part = " ".join(parts[:-1]).strip()
        name_part = parts[-1].strip()

        if name_part.startswith("&"):
            by_ref = True
            name_part = name_part.lstrip("&").strip()
        if type_part.endswith("&"):
            by_ref = True
            type_part = type_part.rstrip("&").strip()

    if not type_part or not name_part:
        return None

    param = {
        "name": name_part,
        "type": type_part,
        "optional": optional,
    }
    if by_ref:
        param["byRef"] = True

    return param


def build_builtins(source_path: Path, target_path: Path):
    if not source_path.exists():
        print(f"[ERROR] Source JSON '{source_path}' nicht gefunden.")
        return

    with source_path.open("r", encoding="utf-8") as f:
        functions = json.load(f)

    builtins = {"functions": []}

    for fn in functions:
        name = fn.get("name")
        if not name:
            continue

        signatures = fn.get("signatures") or []
        short_desc = clean_text(fn.get("shortDescription") or "")
        deprecated = bool(fn.get("deprecated"))
        doc_url = fn.get("sourceUrl") or ""  # 🆕 aus der Crawl-JSON übernehmen

        if not signatures:
            builtins["functions"].append({
                "name": name,
                "returnType": "void",
                "parameters": [],
                "description": short_desc,
                "deprecated": deprecated,
                "docUrl": doc_url,
            })
            continue

        # Mehrzeilige Signaturen zu einem Block joinen
        sig_block = " ".join(s for s in signatures if s and s.strip())
        sig_block = clean_text(sig_block)

        ret_type, sig_name, raw_params = parse_signature(sig_block)

        if not ret_type or not sig_name:
            builtins["functions"].append({
                "name": name,
                "returnType": "void",
                "parameters": [],
                "description": short_desc,
                "deprecated": deprecated,
                "docUrl": doc_url,
            })
            print(f"[WARN] Konnte Signatur nicht parsen für {name}: {sig_block}")
            continue

        fn_name = sig_name or name

        params = []
        for raw in raw_params:
            p = parse_param(raw)
            if p:
                params.append(p)
            else:
                print(f"[WARN] Konnte Parameter nicht parsen in {fn_name}: '{raw}'")

        builtins["functions"].append({
            "name": fn_name,
            "returnType": ret_type,
            "parameters": params,
            "description": short_desc,
            "deprecated": deprecated,
            "docUrl": doc_url,  # 🆕 hier angehängt
        })

    with target_path.open("w", encoding="utf-8") as f:
        json.dump(builtins, f, ensure_ascii=False, indent=2)

    print(f"[INFO] Builtins-JSON geschrieben nach '{target_path}'")
    print(f"[INFO] Enthaltene Funktionen: {len(builtins['functions'])}")


if __name__ == "__main__":
    build_builtins(SOURCE_PATH, TARGET_PATH)
