# README für GitHub Copilot: WinCC OA Extensions

## Allgemeine Projektstruktur und Regeln

Wir nutzen mehrere VS Code Extensions für WinCC OA, darunter CTL Language, Control, LogViewer, ScriptActions und den TestExplorer.

Alle Extensions nutzen eine gemeinsame NPM-Shared-Library als Core, die die Kommunikation mit WinCC OA bereitstellt.

Wir haben ein einheitliches Logging-Format, ein gemeinsames Makefile für Build-Befehle und ähnliche Projektstrukturen in allen Repos.

## Workflow mit GitHub Copilot

Wenn ein neues Feature gestartet wird, soll Copilot automatisch `git flow feature start <Name>` ausführen.

Bevor ein Feature gemergt wird, tragen wir die Änderungen in den Changelog ein und machen einen finalen Commit.

Commit-Messages beginnen immer mit einem Präfix wie `feat:`, `fix:`, `perf:`, usw. und sind so knapp wie möglich.

Erst wenn alles getestet ist und ich das "Go" gebe, soll Copilot committen und dann mit `git flow feature finish` mergen.

Es wird nach jeder Änderung kompiliert (`npm run compile`).

## 🤖 Autonomous Testing Workflow - Copilot Superpowers

### CTL Language Tools für selbstständige Entwicklung

Copilot hat jetzt volle **autonome Test- und Entwicklungsfähigkeiten** für CTL Code:

#### Verfügbare Tools
1. **ctl_syntax_check**: CTL-Dateien auf Syntaxfehler prüfen
2. **ctl_get_diagnostics**: Alle Diagnostics (Errors, Warnings, Info) mit Severity Levels
3. **ctl_get_symbol_info**: Hover-Information für Symbole an spezifischen Positionen
4. **ctl_find_references**: Alle Referenzen zu einem Symbol finden
5. **ctl_goto_definition**: Definition eines Symbols lokalisieren

#### Autonomous Development Cycle

**1. Feature Development:**
```workflow
User Request → Analyze Problem → Write .ctl Test Fixtures
                                        ↓
                              Validate with ctl_syntax_check
                                        ↓
                                  Write Tests (.test.ts)
                                        ↓
                              Implement Feature/Fix
                                        ↓
                                  Run npm test
                                        ↓
                            Verify with ctl_get_diagnostics
                                        ↓
                          Git Flow Feature (if approved)
```

**2. Self-Validation Workflow:**
- **BEFORE creating .ctl fixtures**: Use `ctl_syntax_check` to validate syntax
- **WHILE writing tests**: Use `ctl_goto_definition` and `ctl_find_references` to verify expected behavior
- **AFTER implementation**: Use `ctl_get_diagnostics` to ensure no regressions
- **Test execution**: Always run `npm test` before committing

**3. Test-Driven Development:**
```typescript
// Example: Testing Go-to-Definition for new feature
test('Feature X: Should resolve symbol Y', async () => {
    // 1. Create fixture (validate with ctl_syntax_check first!)
    const fixture = `...CTL code...`;
    
    // 2. Test expected behavior
    const location = await definitionService.handle(...);
    
    // 3. Verify result
    assert.strictEqual(location.range.start.line, expectedLine);
});
```

**4. Proactive Bug Prevention:**
- Write comprehensive test fixtures covering edge cases
- Test both flat structures AND subdirectories (learned from v2.0.1 fix!)
- Validate all .ctl files before adding to test-workspace
- Run integration tests for cross-file scenarios

#### Best Practices

✅ **DO:**
- Always validate .ctl syntax with `ctl_syntax_check` before creating test fixtures
- Write tests FIRST, then implement (TDD)
- Test edge cases (nested classes, subdirectories, member access chains, etc.)
- Run full test suite before feature finish
- Use tools to verify expected LSP behavior

❌ **DON'T:**
- Skip syntax validation of .ctl fixtures
- Commit without running tests
- Assume existing tests cover new features (add specific tests!)
- Forget to test subdirectory structures (libs/Utils/File.ctl vs libs/File.ctl)

#### Example: Complete Autonomous Fix Workflow

```bash
# 1. User reports bug: "Goto doesn't work for subdirectory libs"

# 2. Copilot investigates (autonomous):
ctl_syntax_check(libs/General/MemoryChecker.ctl)  # Validate fixture
ctl_goto_definition(position on updateDiskInfo)   # Reproduce bug
ctl_get_diagnostics()                             # Check for errors

# 3. Write test fixtures:
# - Create libs/Utils/StringHelper.ctl (with ctl_syntax_check validation)
# - Create TestSubdirectoryGoto.ctl (with ctl_syntax_check validation)

# 4. Write failing tests:
# - Test 1: toUpperCase() from Utils/StringHelper
# - Test 2: g_stringOpCount global variable
# - Test 3: startsWith() function

# 5. Implement fix in definitionService.ts

# 6. Verify:
npm test  # All tests pass (116/116)
ctl_get_diagnostics()  # No new errors

# 7. Git Flow (with approval):
git flow feature start fix-uses-goto
git commit -m "fix: goto for #uses libs in subdirs"
git flow feature finish fix-uses-goto
```

**Result**: Copilot kann jetzt **vollständig autonom** entwickeln, testen und validieren!

## Wichtige technische Details

### Script Actions Extension
- Command: `winccoa.executeScriptWithArgs` 
- **WICHTIG**: Arguments werden als PLAIN STRINGS übergeben - KEIN `-lflag`, KEINE `-` Präfixe, einfach nur die Argumente!
- Beispiel richtig: `testCaseId` → Command: `/opt/WinCC_OA/bin/WCCOActrl script.ctl -proj DevEnv testCaseId`
- Beispiel falsch: `-lflag testCaseId` oder `single start testCaseId`
- Die Extension hängt die Args direkt nach `-proj <projectName>` an

### Test Explorer Extension  
- Parst Test-Dateien nach `class X : OaTest` Pattern
- Einzelne Tests werden über `TestRunner.executeScriptWithArgs(fileUri, testCaseId)` ausgeführt
- **WICHTIG**: Nur die `testCaseId` als Argument übergeben, NICHT `single start testCaseId`
- File Watcher wurde optimiert: Nur geänderte Dateien werden neu geparst, nicht das ganze Projekt
- Bei File Create: Datei wird einzeln geparst und hinzugefügt
- Bei File Change: Nur diese Datei wird neu geparst und aktualisiert
- Bei File Delete: Nur diese Datei wird aus dem Test-Tree entfernt

### Performance-Optimierungen
- File Watcher nutzt `handleFileCreated()`, `handleFileChanged()`, `handleFileDeleted()` für inkrementelle Updates
- Kein vollständiges `discoverTests()` mehr bei Dateiänderungen
- `TestDiscovery.parseTestFile(uri)` für einzelne Dateien verwenden

## Aktuelle Probleme und To-Dos

Der LogViewer zeigt aktuell nicht immer die neueste Änderung an, es gibt ein Parsing-Problem.

~~Im TestExplorer sollen Tests auch einzeln erkennbar sein~~ ✅ ERLEDIGT (v0.2.1)

~~Der File-Watcher muss so angepasst werden, dass nur die geänderten Dateien neu geparst werden~~ ✅ ERLEDIGT (v0.2.2)

Für die CTL-Language-Extension soll das Go-to-Feature für Variablen integriert werden, bevor wir den Language-Server später refactoren.

Ein Bug im File-Watcher-Menü sorgt dafür, dass aktuell alle Einträge verschwinden, wenn man versucht, Dateien auszuwählen, die ignoriert werden sollen.

### Known Issues
**WinCC OA Limitation**: Beim Ausführen einzelner Testfälle generiert WinCC OA aktuell keinen vollständigen Test-Report. Die Infrastruktur in den Extensions ist vorbereitet, aber die volle Funktionalität hängt von zukünftigen WinCC OA Verbesserungen ab.

## Test-Workspace Management (CRITICAL)

### Directory Structure
- **test-workspace MUSS auf ROOT-Level liegen**: Nicht in language-server/, sondern parallel dazu
- **Grund**: Professionelle Projekt-Struktur, nicht verschachtelt
- **Pfade in Tests**: Von dist/language-server/test/ aus: `../../../test-workspace/`

### Git & VSIX
- **.gitignore für Runtime-Dateien**: `test-workspace/db/**` sollte NICHT committed werden (Runtime-Artefakte)
- **.vscodeignore**: `test-workspace/**` MUSS excluded sein, sonst Secrets im VSIX
- **Große Commits**: Wenn User mit "ne das passt schon" zustimmt, sind auch 1400+ Dateien OK

### Build & Test Paths
- **copy-fixtures**: `cp -r ../test-workspace/scripts/* ../dist/test-workspace/scripts/`
- **Unit Tests**: `path.join(__dirname, '../../../test-workspace/scripts/libs/')`
- **Integration Tests**: `path.join(__dirname, '../../../test-workspace/scripts/fixtures/')`

## Member Access Navigation (v0.3.0)

### Implementation Details
- **Go-to-Definition**: Works for `obj.method()` and `obj.field` patterns
- **Hover**: Shows full signatures on member access
- **Cross-File**: Uses #uses directive for dependency resolution
- **Symbol Finder**: Enhanced for member access detection in symbolFinder.ts

### Test Organization
- **Unit Tests**: language-server/test/simple/ with local fixtures/
- **Integration Tests**: language-server/test/integration/ (E2E, LSP, Hover)
- **Fixtures**: Self-contained CTL files in test-workspace/scripts/fixtures/
- **Libraries**: Cross-file dependencies in test-workspace/scripts/libs/

## Language Server Architecture (v0.5.0)

### Service-Based Architecture
The Language Server was refactored from a monolithic "God Object" (1160 LOC) to a service-based architecture (496 LOC = 57% reduction).

**See full documentation**: [language-server/docs/ARCHITECTURE.md](../language-server/docs/ARCHITECTURE.md)

### Key Components
```
language-server/src/
├── server.ts                 # LSP glue only (~500 LOC)
├── core/
│   └── symbolCache.ts        # Centralized caching with mtime invalidation
├── services/
│   ├── completionService.ts  # Completion logic
│   ├── hoverService.ts       # Hover logic (~220 LOC)
│   ├── definitionService.ts  # Go-to-Definition logic (~315 LOC)
│   └── configService.ts      # Project config (prepared)
```

### Design Principles
- **Dependency Injection**: Services receive SymbolCache via constructor
- **Single Responsibility**: Each service handles one LSP feature
- **Centralized Caching**: SymbolCache manages all symbol parsing with automatic invalidation
- **Callback Injection**: For async dependencies like `fetchProjectInfo()`

### Adding New Services
1. Create service class in `services/` with SymbolCache dependency
2. Export in `services/index.ts`
3. Instantiate in `server.ts` after dependencies are available
4. Delegate LSP handler to service method

## CTL Language Support - Status und Roadmap

### ✅ **Aktuell unterstützt (v0.5.2)**

#### Basis-Symbole
- ✅ **Classes**: Parsing, Members, Methods, Constructor, Access Modifiers
- ✅ **Structs**: Parsing, Fields (immer public)
- ✅ **Functions**: Global functions mit Parameters, Return Type, Local Variables
- ✅ **Variables**: Global, Local, Member (mit Scope-aware Resolution)
- ✅ **Enums**: Implicit/explicit values, :: operator, global enums
- ✅ **Mappings**: Variable parsing (basic)

#### Vererbung
- ✅ **Einfache Vererbung**: `class Dog : Animal` parsing
- ✅ **BaseClass Member**: `baseClass?: string` im ClassSymbol
- ⚠️ **Limitiert**: Nur 1 Ebene tief - keine rekursive Vererbungskette

#### Member Access
- ✅ **Einfach**: `obj.member` - 1 Ebene
- ✅ **Chain**: `obj.member.field` - beliebig viele Ebenen
- ✅ **Enum**: `Color::RED` - :: operator

#### Language Features
- ✅ **Hover**: Functions, Methods, Variables, Classes, Structs, Enums
- ✅ **Goto-Definition**: Alle Symbol-Typen, member access chains
- ✅ **#uses Resolution**: Cross-file dependencies
- ✅ **Completion**: Basic (CompletionService existiert)

### ❌ **Nicht unterstützt / Gaps**

#### 1. **Vererbungsketten-Resolution (CRITICAL)**
```ctl
class A { public int x; };
class B : A { public int y; };
class C : B { public int z; };

C obj;
obj.x;  // ❌ Findet x NICHT (ist 2 Ebenen entfernt in A)
```

**Problem**: `resolveMemberByType()` sucht nur in direkter BaseClass, nicht rekursiv

**Aktueller Code**:
```typescript
// In SymbolTable.resolveMemberByType():
if (classSymbol.baseClass) {
    const baseClass = symbols.classes.find(c => c.name === classSymbol.baseClass);
    if (baseClass) {
        // ❌ Stoppt hier - geht nicht weiter zu baseClass.baseClass
    }
}
```

#### 2. **Interfaces** (fehlt komplett)
```ctl
interface IDrawable {
    void draw();
};

class Shape : IDrawable {
    public void draw() { }
};
```

**Status**: 
- Keine Interface-Definition im SymbolTable
- Keine Interface-Implementierung in ClassSymbol
- CTL unterstützt Interfaces - wir nicht!

#### 3. **Multiple Inheritance / Interfaces**
```ctl
class Shape : IDrawable, ISerializable {
    // ...
};
```

**Status**: ClassSymbol hat nur `baseClass?: string`, kein `interfaces: string[]`

#### 4. **Method Overriding Detection**
```ctl
class Animal {
    public string makeSound() { return "..."; }
};

class Dog : Animal {
    public string makeSound() { return "Woof"; }  // Override
};
```

**Status**: 
- Keine `isOverride` flag
- Keine Warnung bei signature mismatch
- Goto auf überschriebene Methode springt nicht zur Base

#### 5. **Constructor Chaining**
```ctl
class Dog : Animal {
    public Dog(string name) : Animal(name) { }  // ✅ Parsing OK
    //                        ^^^^^^^^^^^^^ Aber kein Goto zur Animal constructor
};
```

**Status**: Base constructor call wird NICHT aufgelöst

#### 6. **Mapping-Features** (unvollständig)
```ctl
mapping m = [["key", 123], ["foo", 456]];
m["key"];  // ❌ Kein Hover, kein Goto
```

**Status**: 
- Nur Variable-Parsing
- Keine Key-Access Detection
- Keine Type Inference für Values

#### 7. **Static Members**
```ctl
class Utils {
    public static int counter = 0;
    public static void increment() { counter++; }
};

Utils::increment();  // ❌ :: wird als Enum interpretiert!
```

**Status**: Keine `isStatic` flag in MemberSymbol/MethodSymbol

#### 8. **Generics / Templates** (nicht in CTL?)
Vermutlich nicht in CTL - muss geprüft werden.

### 🐛 **Bekannte Bugs**

#### 1. "Falsche Zeilen beim Goto" (User-Report)
```
User: "Wir springen manchmal noch in falsche zeilen"
```

**Mögliche Ursachen**:
- Zeilen-Offset bei Kommentaren/Whitespace falsch
- bodyStartLine/bodyEndLine in lokalen Variablen falsch berechnet
- Member access chain springt zu falscher Member-Definition

**Tests fehlen**: Präzise Goto-Tests mit exakter Zeilennummer-Validierung

### 📊 **Rekursions-Strategie**

#### Vorschlag: **2-3 Files tief, 3-5 Vererbungsebenen**

| Feature | Tiefe | Begründung |
|---------|-------|-----------|
| **#uses Dependencies** | 2-3 Files | Aktuell: Unlimitiert (alle #uses werden geladen) |
| **Vererbungsketten** | 3-5 Ebenen | Real-World: Meist 2-3, Max 5 ist sicher |
| **Member Access Chains** | Unlimitiert | Aktuell bereits implementiert (rekursiv) |
| **Interface Implementierungen** | 3 Interfaces | Realistisch für CTL |

**Performance-Limit**: 
- Maximal 100 Files pro Workspace (aktuell keine Limits)
- Cache-TTL: 5 Minuten (mtime-basiert)

### 🎯 **Roadmap - Nächste Schritte**

#### **Phase 1: Bug Fixes & Tests (Prio 1)**
1. **Tests für Goto-Präzision schreiben**
   - Test: "Goto auf local variable in function body springt zu line X, col Y"
   - Test: "Goto auf member access a.b.c.d springt zu exakter Position"
   - Test: "Goto auf überschriebene Methode springt zur richtigen Definition"

2. **Bug Fixes basierend auf Test-Failures**
   - `bodyStartLine/bodyEndLine` Berechnung korrigieren
   - Location-Offset in definitionService.ts validieren

#### **Phase 2: Vererbung rekursiv (Prio 2)**
3. **Rekursive Vererbungsketten-Resolution**
   ```typescript
   // In SymbolTable.ts
   static resolveMemberByType(
       type: string, 
       memberName: string, 
       symbols: FileSymbols,
       maxDepth: number = 5  // ← NEW
   ): MemberSymbol | MethodSymbol | null {
       // Rekursiv baseClass.baseClass.baseClass durchgehen
   }
   ```

4. **Tests für Vererbung**
   - Test: "3-Level inheritance: C:B:A, obj.memberInA resolves"
   - Test: "Method override: Dog.makeSound() überschreibt Animal.makeSound()"
   - Test: "Goto auf überschriebene Methode zeigt beide (QuickPick?)"

#### **Phase 3: Interfaces (Prio 3)**
5. **Interface Parsing**
   ```typescript
   export interface InterfaceSymbol extends BaseSymbol {
       kind: SymbolKind.Interface;
       methods: MethodSymbol[];  // Nur Signaturen, keine Implementierung
   }
   
   export interface ClassSymbol {
       // ...
       implements?: string[];  // ← NEW
   }
   ```

6. **Interface-Resolution in Hover/Goto**
   - Hover auf Interface zeigt alle Methoden
   - Goto auf implementierte Methode → QuickPick (Interface oder Implementierung?)

#### **Phase 4: Advanced Features (Prio 4)**
7. **Static Members**
   - `isStatic` flag in MemberSymbol/MethodSymbol
   - `Class::staticMethod()` detection (unterscheiden von Enums!)

8. **Constructor Chaining**
   - Base constructor call parsing: `: BaseClass(args)`
   - Goto auf base constructor

9. **Mapping-Features**
   - Key-Access detection: `m["key"]`
   - Type inference für mapping values

### 🧪 **Test-Strategie**

#### **Fehlende Tests (Critical)**
1. **Goto-Precision Tests**
   ```typescript
   test('Goto: Local variable in line 45 jumps to line 42, col 8', () => {
       // Exakte Position validieren
       assert.strictEqual(location.range.start.line, 42);
       assert.strictEqual(location.range.start.character, 8);
   });
   ```

2. **Inheritance Tests**
   ```typescript
   test('Hover: Dog.makeSound() shows override + base signature', () => {
       // Beide Signaturen anzeigen
   });
   
   test('Goto: Member in 3-level inheritance resolves', () => {
       // C:B:A, obj.memberInA
   });
   ```

3. **Edge Cases**
   ```typescript
   test('Member access on null object returns null gracefully');
   test('Circular inheritance detection');
   test('Invalid base class name shows error');
   ```

**Zusammenfassung**:
- ✅ **Basis solide**: Classes, Functions, Enums, Member Access funktionieren
- ⚠️ **Vererbung limitiert**: Nur 1 Ebene, keine Interfaces
- ❌ **Goto-Bugs**: User-Report - Tests fehlen
- 🎯 **Next Steps**: Tests schreiben → Bugs fixen → Vererbung rekursiv → Interfaces

## Makefile Automation

### Version Badge Auto-Update (v1.0.0+)
Alle Extensions haben automatische Version Badge Updates im `make package` Target:

```makefile
# Package extension
package: build
	@echo "Packaging production release..."
	@-$(MKDIR) $(BIN_DIR) 2>nul || echo "" >nul
	@echo "Updating version badge in README.md..."
	@node -e "const fs=require('fs'); let c=fs.readFileSync('README.md','utf8'); c=c.replace(/!\\[Version\\]\\(https:\\/\\/img\\.shields\\.io\\/badge\\/version-[^)]*\\)/,'![Version](https://img.shields.io/badge/version-$(VERSION)-blue.svg)'); fs.writeFileSync('README.md',c);"
	@$(VSCE) package -o $(BIN_DIR)/$(EXTENSION_NAME)-$(VERSION).vsix
	@echo "Extension packaged to $(BIN_DIR)/$(EXTENSION_NAME)-$(VERSION).vsix"
```

**Funktionsweise:**
- **Cross-Platform**: Node.js-basierter Regex-Replace funktioniert auf Windows und Linux
- **Automatic**: Version wird aus package.json gelesen via `$(VERSION)`
- **No Backups**: Direkte Replacement, kein .bak-File nötig
- **Error-Tolerant**: `-$(MKDIR)` ignoriert Fehler wenn Directory existiert

**WICHTIG**: Version Badge wird automatisch bei `make package` aktualisiert - NICHT manuell in README.md ändern!

## Marketplace Discovery

### Keywords für bessere Auffindbarkeit
Alle Extensions haben `keywords` in package.json für bessere Marketplace Discovery:

```json
"keywords": [
  "WinCC OA",
  "CTRL",
  "CTRL++",
  "ctl",
  "ctlpp",
  "SCADA",
  "Siemens",
  "language support",
  "syntax highlighting",
  "intellisense"
]
```

**Effekt:**
- VS Code schlägt Extension automatisch vor bei `.ctl`/`.ctlpp` Dateien
- Bessere Suchergebnisse im Marketplace
- Höhere Discovery Rate

## LSP DocumentSymbol Range Validation (CRITICAL!)

### Problem: "selectionRange must be contained in fullRange"

**Kontext:**
DocumentSymbol hat zwei Ranges:
- **`range`** (fullRange): Gesamter Symbol-Bereich (z.B. ganze Funktion von Start bis Ende)
- **`selectionRange`**: Bereich des Symbol-Namens (für Click-to-Jump und Highlighting)

**LSP Requirement (CRITICAL):**
`selectionRange` MUSS **vollständig innerhalb** `range` liegen! VS Code validiert das streng.

**Häufiger Fehler:**
```typescript
// ❌ FALSCH - Hardcoded column 1000
const range = Range.create(
    Position.create(startLine, 0),
    Position.create(endLine, 1000)  // ← Kann über echte Zeilenlänge hinaus sein!
);

const selectionRange = Range.create(
    Position.create(line, column),
    Position.create(line, column + nameLength)  // ← Kann außerhalb range sein!
);
```

**Richtige Lösung:**
```typescript
// ✅ KORREKT - Nutze echte Dokumentzeilen-Längen
private createRangeForLine(document: TextDocument, startLine: number, endLine: number): Range {
    const lineCount = document.lineCount;
    const safeStartLine = Math.max(0, Math.min(startLine, lineCount - 1));
    const safeEndLine = Math.max(safeStartLine, Math.min(endLine, lineCount - 1));
    
    // Echte Zeilenlänge ermitteln!
    const endLineText = document.getText({
        start: { line: safeEndLine, character: 0 },
        end: { line: safeEndLine + 1, character: 0 }
    }).trimEnd();
    const endChar = endLineText.length;
    
    return Range.create(
        Position.create(safeStartLine, 0),
        Position.create(safeEndLine, endChar)
    );
}

// ✅ KORREKT - Garantiere Containment
private createSelectionRange(
    document: TextDocument,
    line: number,
    column: number,
    nameLength: number,
    fullRange: Range  // ← WICHTIG: fullRange als Constraint!
): Range {
    // 1. Line innerhalb fullRange clampen
    const safeLine = Math.max(fullRange.start.line, Math.min(line, fullRange.end.line));
    
    // 2. Echte Line-Länge holen
    const lineText = document.getText({
        start: { line: safeLine, character: 0 },
        end: { line: safeLine + 1, character: 0 }
    }).trimEnd();
    
    // 3. Columns innerhalb Line-Länge clampen
    const startCol = Math.max(0, Math.min(column, lineText.length));
    const endCol = Math.min(startCol + nameLength, lineText.length);
    
    // 4. KRITISCH: Innerhalb fullRange.start/end clampen
    let finalStartCol = startCol;
    let finalEndCol = endCol;
    
    if (safeLine === fullRange.start.line) {
        finalStartCol = Math.max(finalStartCol, fullRange.start.character);
        finalEndCol = Math.max(finalEndCol, fullRange.start.character);
    }
    
    if (safeLine === fullRange.end.line) {
        finalStartCol = Math.min(finalStartCol, fullRange.end.character);
        finalEndCol = Math.min(finalEndCol, fullRange.end.character);
    }
    
    return Range.create(
        Position.create(safeLine, finalStartCol),
        Position.create(safeLine, finalEndCol)
    );
}
```

**Nutzung:**
```typescript
const range = this.createRangeForLine(document, startLine, endLine);
const selectionRange = this.createSelectionRange(
    document,
    symbol.location.line,
    symbol.location.column,
    symbol.name.length,
    range  // ← Pass fullRange to ensure containment!
);

return DocumentSymbol.create(name, detail, kind, range, selectionRange);
```

**Warum das wichtig ist:**
- VS Code wirft Error: `"selectionRange must be contained in fullRange"`
- DocumentSymbol Provider funktioniert nicht → Outline View bleibt leer
- Breadcrumbs, Sticky Scroll, Quick Open (Ctrl+Shift+O) brechen
- Extension wird als broken markiert im Marketplace

**Testing:**
- Teste mit Dateien die unterschiedliche Zeilenlängen haben (kurz + lang)
- Teste mit Symbolen am Zeilenende
- Teste mit Symbolen in mehrzeiligen Ranges (Classes, Methods)
- Validiere dass Outline View ohne Errors funktioniert

## Version History (as of 2026-01-09)
- **CTL Language**: v1.4.0 - Outline View Support (DocumentSymbolProvider)
- **LogViewer**: v1.0.3 - Backend file watching + version badge automation
- **Script Actions**: v0.4.0 - Default commands with -n flag + version badge automation
- **Test Explorer**: v0.2.4 - Cancel/Stop support + version badge automation
- **Project Admin**: Latest - Version badge automation
- **Core Extension**: v0.2.3 - PMON start/stop sequence fix