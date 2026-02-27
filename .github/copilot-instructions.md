# AI Coding Assistant Instructions

This file provides instructions for AI coding assistants (GitHub Copilot, Claude, Cursor, etc.) working on this repository.

## Project Overview

This is a VS Code extension providing **WinCC OA CTRL/CTRL++ Language Support** — syntax highlighting, go-to-definition, hover, completions, code formatting (Astyle), and native syntax checking.

All WinCC OA extensions share a common NPM shared library as core (`@winccoa-tools-pack/npm-winccoa-core`) that provides communication with WinCC OA. We use a unified logging format, a shared Makefile for build commands, and similar project structures across all repos.

## Key Technologies

- **TypeScript** - Primary language
- **VS Code Extension API** - Language features, commands, configuration
- **Language Server Protocol (LSP)** - Separate language-server package for hover, goto, completions, rename
- **@winccoa-tools-pack/npm-winccoa-core** - WinCC OA project discovery and CTRL execution
- **Webpack** - Bundling
- **Mocha** - Testing framework

## Repository Structure

```text
src/
├── extension.ts                    # Main entry point, command registrations
├── extensionOutput.ts              # Logging
├── services/
│   ├── astyleFormatterService.ts   # Astyle code formatting
│   ├── ctrlppCheckService.ts       # CTRL++ checking
│   ├── projectPathResolver.ts      # WinCC OA project path resolution
│   └── winccoaSyntaxCheckService.ts # Native syntax check
└── test/                           # Unit and integration tests

language-server/
├── src/
│   ├── server.ts                   # LSP glue (~500 LOC after refactor)
│   ├── symbolFinder.ts             # Symbol finding with member access
│   ├── symbolTable.ts              # Symbol table and resolution
│   ├── tokenizer.ts                # CTRL tokenizer
│   ├── types.ts                    # Type definitions
│   ├── usesResolver.ts             # #uses directive resolution
│   ├── builtins.ts                 # Built-in function definitions
│   ├── core/
│   │   └── symbolCache.ts          # Centralized caching with mtime invalidation
│   └── services/
│       ├── completionService.ts    # Completion logic
│       ├── configService.ts        # Project config
│       ├── definitionService.ts    # Go-to-Definition (~315 LOC)
│       ├── hoverService.ts         # Hover logic (~220 LOC)
│       ├── renameService.ts        # Symbol rename
│       └── index.ts                # Service exports
├── test/                           # Language server tests
└── docs/
    └── ARCHITECTURE.md             # Full architecture documentation

test-workspace/                     # Test workspace (MUST be at ROOT level)
```

## Autonomous Testing Workflow

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

## Workflow with GitHub Copilot

When a new feature is started, Copilot should automatically run `git flow feature start <Name>`.

Before a feature is merged, we enter the changes in the changelog and make a final commit.

Commit messages always start with a prefix like `feat:`, `fix:`, `perf:`, etc. and are as concise as possible.

Only when everything is tested and I give the "go", Copilot should commit and then merge with `git flow feature finish`.

Compile after every change (`npm run compile`).

## Contribution Guidelines

### 1. Feature Completion First

- **Complete one feature before starting another** - Do not leave partial implementations
- Verify the feature works end-to-end before moving on
- Mark todos as completed immediately after finishing each task

### 2. Documentation Requirements

- Document new features, APIs, and commands as you implement them
- Update `README.md` when adding commands or settings
- Propose creating screenshots for UX documentation when applicable

### 3. Code Quality Standards

Before committing any changes:

```bash
npm run format      # Format code with Prettier
npm run lint        # Run ESLint
npm run lint:md     # Lint Markdown files
npm run compile     # Build the extension
npm test            # Run all tests
```

### 4. Testing Requirements

**All new features must have automated tests:**

- **Unit tests** (`src/test/unit/`) - Focus on code coverage and isolated logic
- **Integration tests** (`src/test/integration/`) - Test functionality with WinCC OA and OS interactions

Run tests:

```bash
npm run test:unit          # Unit tests only
npm run test:integration   # Integration tests
npm run test:coverage      # With coverage report
```

### 5. GitFlow Branching

This project uses GitFlow. The branching model is fully automated via GitHub Actions.

**Branch from `develop` for new work:**

```bash
git checkout develop
git pull origin develop
git checkout -b feature/<issue-id>/<short-description>
```

**Branch naming convention:**

- `feature/<gh-issue-id>/<what-will-be-done>` - New features
- `bugfix/<gh-issue-id>/<short-description>` - Bug fixes

Examples:

- `feature/32/config-editor`
- `bugfix/45/fix-result-parsing`

### 6. Pull Request Format

Use the PR template at `.github/PULL_REQUEST_TEMPLATE/feature-bugfix.md`.

**Link issues using keywords:**

- `Fixes #123` - Closes the issue when merged
- `Closes #123` - Closes the issue when merged
- `Related to #123` - References without closing

**PR Description must include:**

- Description of changes
- Related issue links
- Testing checklist

## Important Technical Details

## Language Server Architecture (v0.5.0+)

The Language Server was refactored from a monolithic "God Object" (1160 LOC) to a service-based architecture (496 LOC = 57% reduction).

**See full documentation**: [language-server/docs/ARCHITECTURE.md](../language-server/docs/ARCHITECTURE.md)

### Design Principles

- **Dependency Injection**: Services receive SymbolCache via constructor
- **Single Responsibility**: Each service handles one LSP feature
- **Centralized Caching**: SymbolCache manages all symbol parsing with automatic mtime-based invalidation
- **Callback Injection**: For async dependencies like `fetchProjectInfo()`

### Adding New Services

1. Create service class in `language-server/src/services/` with SymbolCache dependency
2. Export in `services/index.ts`
3. Instantiate in `server.ts` after dependencies are available
4. Delegate LSP handler to service method

## Member Access Navigation (v0.3.0+)

- **Go-to-Definition**: Works for `obj.method()` and `obj.field` patterns
- **Hover**: Shows full signatures on member access
- **Cross-File**: Uses `#uses` directive for dependency resolution
- **Symbol Finder**: Enhanced for member access detection in symbolFinder.ts

## CTL Language Support — Status and Roadmap

### Currently Supported (v0.5.2+)

#### Basic Symbols

- Classes: Parsing, Members, Methods, Constructor, Access Modifiers
- Structs: Parsing, Fields (always public)
- Functions: Global functions with Parameters, Return Type, Local Variables
- Variables: Global, Local, Member (with Scope-aware Resolution)
- Enums: Implicit/explicit values, `::` operator, global enums
- Mappings: Variable parsing (basic)

#### Inheritance

- Simple inheritance: `class Dog : Animal` parsing
- BaseClass member: `baseClass?: string` in ClassSymbol
- **Limited**: Only 1 level deep — no recursive inheritance chain

#### Member Access

- Simple: `obj.member` — 1 level
- Chain: `obj.member.field` — arbitrary depth
- Enum: `Color::RED` — `::` operator

#### Language Features

- Hover: Functions, Methods, Variables, Classes, Structs, Enums
- Goto-Definition: All symbol types, member access chains
- `#uses` Resolution: Cross-file dependencies
- Completion: Basic (CompletionService exists)
- Rename: Scope-aware symbol rename

### Not Supported / Gaps

#### 1. Inheritance Chain Resolution (CRITICAL)

```ctl
class A { public int x; };
class B : A { public int y; };
class C : B { public int z; };

C obj;
obj.x;  // Does NOT find x (2 levels away in A)
```

**Problem**: `resolveMemberByType()` only searches the direct BaseClass, not recursively.

#### 2. Interfaces (completely missing)

```ctl
interface IDrawable {
    void draw();
};

class Shape : IDrawable {
    public void draw() { }
};
```

CTL supports Interfaces — we don't yet! No Interface definition in SymbolTable, no interface implementation in ClassSymbol.

#### 3. Multiple Inheritance / Interfaces

ClassSymbol currently has only `baseClass?: string`, no `implements: string[]`.

#### 4. Method Overriding Detection

- No `isOverride` flag
- No warning on signature mismatch
- Goto on overridden method doesn't jump to base

#### 5. Constructor Chaining

Base constructor call (`: Animal(name)`) is NOT resolved for goto.

#### 6. Mapping Features (incomplete)

Only variable parsing — no key-access detection (`m["key"]`), no type inference for values.

#### 7. Static Members

No `isStatic` flag in MemberSymbol/MethodSymbol. `Class::staticMethod()` is interpreted as Enum!

### Known Bugs

#### "Wrong Lines on Goto" (User Report)

Possible causes:

- Line offset wrong with comments/whitespace
- `bodyStartLine`/`bodyEndLine` incorrectly calculated for local variables
- Member access chain jumps to wrong member definition

**Missing Tests**: Precise goto tests with exact line number validation.

### Recursion Strategy

| Feature | Depth | Rationale |
|---------|-------|-----------|
| **#uses Dependencies** | 2-3 Files | Currently: Unlimited (all #uses are loaded) |
| **Inheritance Chains** | 3-5 Levels | Real-world: Usually 2-3, max 5 is safe |
| **Member Access Chains** | Unlimited | Already implemented (recursive) |
| **Interface Implementations** | 3 Interfaces | Realistic for CTL |

**Performance Limits**:

- Max 100 files per workspace (currently no limits)
- Cache TTL: 5 minutes (mtime-based)

### Roadmap — Next Steps

#### Phase 1: Bug Fixes & Tests (Priority 1)

1. Write tests for goto precision (exact line + column validation)
2. Bug fixes based on test failures (`bodyStartLine`/`bodyEndLine` computation, location offset in definitionService.ts)

#### Phase 2: Recursive Inheritance (Priority 2)

3. Recursive inheritance chain resolution in `SymbolTable.resolveMemberByType()` with `maxDepth = 5`
4. Tests for 3-level inheritance, method overrides

#### Phase 3: Interfaces (Priority 3)

5. Interface parsing (InterfaceSymbol, `implements?: string[]` in ClassSymbol)
6. Interface resolution in Hover/Goto

#### Phase 4: Advanced Features (Priority 4)

7. Static members (`isStatic` flag, distinguish `Class::method()` from enums)
8. Constructor chaining (base constructor goto)
9. Mapping features (key-access, type inference)

## Test-Workspace Management (CRITICAL)

### Directory Structure

- **test-workspace MUST be at ROOT level**: Not inside language-server/, but parallel to it
- **Reason**: Professional project structure, not nested
- **Paths in tests**: From dist/language-server/test/: `../../../test-workspace/`

### Git & VSIX

- **.gitignore for runtime files**: `test-workspace/db/**` should NOT be committed (runtime artifacts)
- **.vscodeignore**: `test-workspace/**` MUST be excluded, otherwise secrets end up in the VSIX
- **Large commits**: If user approves with "that's fine", even 1400+ files are OK

### Build & Test Paths

- **copy-fixtures**: `cp -r ../test-workspace/scripts/* ../dist/test-workspace/scripts/`
- **Unit Tests**: `path.join(__dirname, '../../../test-workspace/scripts/libs/')`
- **Integration Tests**: `path.join(__dirname, '../../../test-workspace/scripts/fixtures/')`

### Test Organization

- **Unit Tests**: `language-server/test/simple/` with local fixtures
- **Integration Tests**: `language-server/test/integration/` (E2E, LSP, Hover)
- **Fixtures**: Self-contained CTL files in `test-workspace/scripts/fixtures/`
- **Libraries**: Cross-file dependencies in `test-workspace/scripts/libs/`

## Important Files

| File | Purpose |
|------|---------|
| `src/extension.ts` | Main entry, commands, activation |
| `src/services/astyleFormatterService.ts` | Astyle code formatting |
| `src/services/winccoaSyntaxCheckService.ts` | Native WinCC OA syntax check |
| `src/services/projectPathResolver.ts` | WinCC OA project path resolution |
| `language-server/src/server.ts` | LSP server glue code |
| `language-server/src/symbolTable.ts` | Symbol table and resolution |
| `language-server/src/symbolFinder.ts` | Symbol finding / member access |
| `language-server/src/services/` | LSP feature services (hover, goto, completion, rename) |
| `language-server/docs/ARCHITECTURE.md` | Full architecture documentation |
| `package.json` | Commands, settings, activation events |

## Makefile Automation

### Version Badge Auto-Update

All extensions have automatic version badge updates in the `make package` target using a Node.js-based regex replace (cross-platform, Windows + Linux).

**IMPORTANT**: Version badge is automatically updated on `make package` — do NOT manually edit it in README.md!

## Marketplace Discovery

All extensions have `keywords` in package.json for better marketplace discovery. VS Code automatically suggests the extension for `.ctl`/`.ctlpp` files.

## Known WinCC OA Limitation

When executing individual test cases, WinCC OA currently does not generate a complete test report. The infrastructure in the extensions is prepared, but full functionality depends on future WinCC OA improvements.

## Do NOT

- Start new features before completing current ones
- Skip running tests before committing
- Commit without formatting (`npm run format`)
- Create PRs without linking issues
- Push directly to `main` or `develop` branches
- Manually edit the version badge in README.md

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
