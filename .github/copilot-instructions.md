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

## Version History (as of 2025-12-29)
- **CTL Language**: v0.5.2 - Enum/Mapping support with hover/goto
- **LogViewer**: v0.2.5 - Load History + Settings Persistence + 24h Time Picker
- **Script Actions**: v0.4.0 - Default commands with -n flag
- **Test Explorer**: v0.2.4 - Cancel/Stop support
- **Core Extension**: v0.2.3 - PMON start/stop sequence fix