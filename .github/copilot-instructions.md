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

## Version History (as of 2025-12-29)
- **CTL Language**: v0.5.0 - Service architecture refactoring (57% code reduction)
- **LogViewer**: v0.2.5 - Load History + Settings Persistence + 24h Time Picker
- **Script Actions**: v0.4.0 - Default commands with -n flag
- **Test Explorer**: v0.2.4 - Cancel/Stop support
- **Core Extension**: v0.2.3 - PMON start/stop sequence fix