# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.3] - 2025-12-30

### Fixed
- **Code References**: Updated extension ID references from `winccoa-tools-pack.winccoa-core` to `RichardJanisch.winccoa-control` in TypeScript code

## [1.0.2] - 2025-12-30

### Fixed
- **Extension Dependency**: Updated from `RichardJanisch.winccoa-core` to `RichardJanisch.winccoa-control` (package name changed in Control extension v1.0.1)

## [1.0.1] - 2025-12-30

### Fixed
- **Extension Dependency**: Corrected publisher name from `winccoa-tools-pack.winccoa-core` to `RichardJanisch.winccoa-core` in extensionDependencies

## [1.0.0] - 2025-12-30

### 🎉 First Stable Release

This is the first stable release of WinCC OA CTRL Language Support, providing comprehensive IntelliSense and code navigation for WinCC OA CTRL/CTRL++ development.

### ✨ Features Included

#### Language Server
- **Syntax Highlighting**: Full support for `.ctl` and `.ctrlpp` files
- **IntelliSense**: Auto-completion for 983 WinCC OA built-in functions
- **Hover Information**: Function signatures, variable types, enum values
- **Go-to-Definition**: Functions, classes, structs, variables, enums, `#uses` imports
- **Member Access Navigation**: Chain navigation `obj.member.field`
- **Enum Support**: Full parsing, hover, and navigation for `enum Color { RED, GREEN }`
- **Class Inheritance**: Single-level inheritance support
- **Cross-File Dependencies**: Automatic `#uses` resolution
- **108 Unit Tests**: Comprehensive test coverage

#### Code Quality Tools
- **Syntax Checking**: Native WinCC OA validation via `WCCOActrl`
- **Code Formatting**: Astyle-based formatting with customizable configs
- **Documentation Access**: Quick links to official WinCC OA docs

### 📦 Build
- Production build in `bin/winccoa-ctrllang-1.0.0.vsix`
- Ready for distribution and installation

### ⚠️ Known Limitations
- Inheritance limited to 1 level
- No interface support yet
- Static members not yet detected
- Goto-definition precision improvements needed

---

## [0.5.2] - 2025-12-29

### Added
- **Enum and Mapping Support**: Complete parsing and language features for WinCC OA enums
  - Enum parsing with implicit and explicit values (including negative values)
  - Hover support for enum types showing all members
  - Hover support for enum members with `::` operator (e.g., `Color::RED = 0`)
  - Go-to-definition for enum types and members
  - Symbol finder enhanced to detect `::` operator for enum member access
  - Support for global enums
  - Mapping variable parsing and hover support
  - 14 new TDD tests (108 total tests passing)
  - Integration tests for enum hover and goto-definition features

### Changed
- `symbolTable.ts`: Added `findEnumDefinitions()` and `findMappingVariables()` methods
- `symbolFinder.ts`: Enhanced with enum member access detection (`::` operator)
- `hoverService.ts`: Added enum-specific hover formatting
- `definitionService.ts`: Added enum member resolution
- FileSymbols interface extended with `enums` and `mappingVariables` arrays

## [0.5.0] - 2025-12-29

### Added
- **Architecture Refactoring**: Language Server restructured for better maintainability
  - New `core/symbolCache.ts`: Centralized symbol caching with mtime-based invalidation
  - New `services/completionService.ts`: Completion logic extracted
  - New `services/hoverService.ts`: Hover logic extracted (220 lines)
  - New `services/definitionService.ts`: Go-to-definition logic extracted (315 lines)
  - New `services/configService.ts`: Project configuration handling

### Changed
- **server.ts reduced from 1160 to 496 lines** (57% reduction)
- All handlers now use centralized services with dependency injection
- Symbol caching with mtime-based invalidation for better performance
- Project info synchronization between server and symbol cache

## [0.4.3] - 2025-12-28

### Added
- **Custom Astyle Paths**: New settings to specify custom astyle binary and config file paths
  - `winccoa.astyleFormatter.binaryPath`: Custom path to astyle binary
  - `winccoa.astyleFormatter.configPath`: Custom path to astyle config file
  - Falls back to WinCC OA installation paths if custom paths are not set
  - Allows users to use their own astyle installation

## [0.4.2] - 2025-12-28

### Fixed
- **Core Extension Startup Messages**: Suppressed warning messages during initial startup to reduce noise:
  - "Core extension is not active yet" now logs as debug on first call
  - "No WinCC OA project selected" popup only shows after first startup attempt
  - Subsequent calls still show warnings if issues persist

## [0.4.1] - 2025-12-28

### Fixed
- **Method Syntax Highlighting**: Class methods and method calls now use `support.function.ctrl` scope (like built-in functions) for distinct colorization from member variables. Adapted from C++ syntax patterns.
  - Method declarations: `public int testMethod()` now properly highlighted
  - Method calls: `obj.method()` and `this.method()` now properly highlighted
  - Member variables retain `variable.other.ctrl` scope for differentiation

## [0.4.0] - 2025-12-28

### Added
- **Template Insertion Commands**: New commands `winccoa.insertTestTemplate` and `winccoa.insertScriptTemplate` for inserting pre-formatted templates into .ctl files
  - Test Template: OaTest class structure with setUp/tearDown methods and example test case
  - Script Template: Basic script structure with main() function and placeholder comments
  - Auto-replacement of placeholders: `{{className}}` (from filename), `{{fileName}}`, `{{date}}`
  - Templates inserted at the beginning of the file (non-destructive)

## [0.3.2] - 2025-12-28

### Fixed
- **Member Variable Resolution in Return Statements**: Fixed `findLocalVariables()` incorrectly parsing `return m_result` as variable declaration by whitelisting valid type keywords (excluded control flow keywords like `return`, `if`, `for`, etc.)
- **Parameter Shadowing in Method Signatures**: Parameters now correctly resolved when cursor is on parameter declaration (signature line) instead of jumping to shadowed member variables
- **Global vs Member Variable Shadowing**: Fixed class members being resolved outside of class scope - members now only accessible within their containing class, globals have priority in global scope
- **LSP Position Handling**: Fixed 1-based vs 0-based line number mismatch in `findContainingMethod()`, `findContainingFunction()`, and `findContainingClass()` - all now correctly handle 0-based LSP positions
- **Class Boundary Detection**: Replaced heuristic "+100 lines" approach with precise `startLine`/`endLine` tracking for classes

### Changed
- `findLocalVariables()`: Added whitelist of valid type keywords (int, float, string, bool, time, dyn_*, mapping, etc.)
- `findContainingMethod()`: Now includes method signature line in containment check (previously only checked body)
- `extractClassBody()`: Now returns `endLine` in addition to `startLine` and `content`
- `ClassSymbol`: Added `startLine` and `endLine` fields for precise class boundary tracking

### Added
- **Member Access Resolution**: New `resolveMemberAccess()` method for resolving member access patterns (`obj.method()`, `obj.member`)
- **Struct Field Resolution**: Extended `resolveMemberAccess()` to support struct fields in addition to class members/methods
- **Nested Member Access Support**: New `resolveMemberByType()` method for resolving nested member access (`circle.center.x`) by type name
- **Cross-File Member Access**: Extended hover and go-to-definition to resolve member access across #uses dependencies (e.g., `circle.center` where `Circle` is defined in DataStructures.ctl)
- **Member Access Chain Parser**: Enhanced `getSymbolAtPosition()` to detect full member access chains (e.g., `circle.center.x` → `["circle", "center", "x"]`) for multi-level struct/class member resolution
- Integration test: member-variable-resolution.test.ts (5 tests for member vs parameter shadowing, return statement resolution)
- Integration test: global-vs-member-shadowing.test.ts (2 tests for global/member variable scope resolution)
- Integration test: method-hover-signature.test.ts (1 test for member access method resolution)
- Integration test: nested-member-access.test.ts (2 tests for struct field access and nested resolution)
- Debug test: debug-locals.test.ts (validates local variable parsing doesn't incorrectly parse return statements)

## [0.3.1] - 2025-12-28

### Fixed
- **Implicit Global Variables**: Global variables declared without `global` keyword (e.g., `int intVariable = 42;` at file level) are now correctly recognized by hover and go-to-definition
- **Go-to-Definition Line Offset**: Fixed off-by-one error where go-to-definition jumped one line below the actual definition (SymbolTable 1-based vs LSP 0-based line numbers)
- **Parameter Hover Priority**: Function/method parameters now have priority over local variables in symbol resolution, fixing cases where shadowed variables showed wrong types (e.g., `value` parameter showing `float` from struct field instead of `int` from parameter)

### Changed
- `findGlobalVariables()` now detects two patterns:
  - Pattern 1: `global type identifier` (explicit globals)
  - Pattern 2: `type identifier` at file level (implicit globals, braceDepth === 0)
- `resolveSymbol()` checks function parameters before local variables for correct type resolution
- All Location.create() calls in server.ts adjusted with -1 line offset for LSP compatibility

### Added
- Integration tests for global variable usage hover and go-to-definition
- Debug test for main() function parsing and symbol resolution
- Build configuration for language server tests (tsconfig.build.json)

## [0.3.0] - 2025-12-27

### Added
- **Member Access Navigation**: Go-to-Definition and Hover now work on member access patterns (e.g., `manager.createDevice()`, `myStruct.id`)
- Member access detection in `symbolFinder.ts` - detects `object.member` patterns and returns object context
- Struct field hover support via member access (e.g., `myStruct.id` shows `int id`)
- Class method hover support via member access with full signatures (e.g., `manager.createDevice` shows `int createDevice(string deviceName, int deviceType)`)
- Class member variable hover support via member access
- E2E tests for Go-to-Definition with member access (2 tests)
- Comprehensive hover tests (9 tests covering all hover scenarios)
- **LSP Integration Tests**: New test suite (`lsp-hover.test.ts`) testing complete request/response flow (5 tests)
- **Cross-File Resolution Tests**: Integration tests for #uses directive with dependency resolution (6 tests)
- Method and function signatures in hover now show full parameter lists
- Test workspace with CTL fixtures and library files for integration testing

### Changed
- Hover handler refactored to handle member access patterns for classes and structs
- Go-to-Definition handler extended with member access resolution logic
- Symbol resolution now checks object type and resolves members through type system
- **Test Structure Reorganization**: Moved all tests from `src/` to dedicated `test/` directory
  - `test/simple/` for unit tests with local fixtures
  - `test/integration/` for E2E and LSP integration tests
- Test fixtures now in repository: `test-workspace/scripts/{fixtures,libs}` (self-contained)
- Build process now copies test fixtures to `dist/` for test execution

### Fixed
- Hover on struct fields via member access now works correctly
- Hover on class methods via member access now shows full signatures
- Test fixtures are excluded from published VSIX package (via `.vscodeignore`)
- Cross-file resolution now correctly resolves libs from parent directory's `libs/` folder
- Parameter parsing for functions, methods, and constructors now returns actual parameters instead of empty arrays

### Technical Details
- `getSymbolAtPosition()` enhanced to return `memberAccess?: { objectName }` when detecting `obj.member` pattern
- Hover handler checks `symbolInfo.memberAccess` and resolves through object type → class/struct → member/method/field
- Go-to-Definition handler uses same member access resolution strategy
- Test coverage: 61 passing tests (was 52)
- Added LSP integration tests that simulate complete hover request/response cycle

## [0.2.3] - 2025-12-26

### Added
- Local variable parsing and resolution within function scope
- Function parameter resolution (parameters treated as local variables)
- Struct field resolution in hover and go-to-definition
- Hover provider now shows type information for variables (like Python IDEs)
- Go-to-Definition support for local variables and function parameters
- Local variables have higher priority than global variables in scope resolution

### Changed
- Hover display simplified: removed kind labels (e.g., "local variable", "member variable")
- Hover now shows clean format: `type name` for all variables

### Fixed
- Line number indexing consistency (0-based) for LSP compatibility in local variable resolution
- Struct fields now properly resolved across all structs

### Technical Details
- Extended FunctionSymbol with localVariables array and body line ranges
- Function parameters parsed and included in local variable scope
- Symbol resolution now checks local variables (including parameters) before globals
- Struct fields checked in resolveSymbol for proper type resolution

## [0.2.2] - 2025-12-26

### Fixed
- Legacy function finder now also skips nested scopes (brace depth tracking)
- Constructor calls after `new` keyword now correctly resolve to class definition
- Method calls on objects now resolve to method definition in dependency classes (naive implementation - searches all classes)

### Added
- Method search in cross-file dependency resolution
- Integration test for constructor calls after `new` keyword
- E2E test structure (placeholder for future refactoring)

### Technical Debt
- Legacy symbolFinder.ts still in use alongside Symbol Table (dual code paths)
- Method resolution is naive - no type inference, searches all classes in dependencies
- E2E tests require server handler extraction for proper testability

## [0.2.1] - 2025-12-26

### Fixed
- Method parsing now correctly skips nested method bodies, preventing constructor calls inside methods from being parsed as method definitions
- Cross-file Go-to-Definition now works correctly for class names in variable declarations
- Added integration tests to verify full code path from LSP request to dependency resolution

### Added
- Integration test suite for Language Server cross-file resolution
- Debug logging for Symbol Table dependency parsing

## [0.2.0] - TBD

### Added
- Automatic project detection mode via WinCC OA Core extension integration
- Extension dependency on `winccoa-tools-pack.winccoa-core` (optional)
- Automatic project path and installation path resolution from selected project
- Fallback to workspace/manual configuration when Core extension is not available
- Real-time project change detection with automatic path updates

### Changed
- `pathSource` setting now supports `automatic` mode in addition to `workspace` and `manual`
- Project paths automatically retrieved from Core extension when in automatic mode
- Improved error handling when automatic mode is selected but Core extension is not installed

## [0.1.1] - 2025-12-14

### Added
- Comprehensive logging system with configurable log levels (ERROR, WARN, INFO, DEBUG, TRACE)
- New setting: `winccoa.ctrlLang.logLevel` for controlling logging verbosity
- Structured logging with source/module context in all log messages
- ISO 8601 timestamps with milliseconds in all log entries
- Automatic stack traces for ERROR-level logs
- Runtime log level updates without VS Code reload
- Detailed logging documentation in `docs/LOGGING.md`

### Changed
- All log messages now include source context (e.g., `[Extension]`, `[PathResolver]`)
- Log output format improved with icons, aligned columns, and timestamps
- Enhanced path resolution logging with detailed trace information
- Service initialization logs now more informative with DEBUG/TRACE levels

### Fixed
- Log level filtering now works correctly (messages below configured level are suppressed)

## [0.1.0] - 2024-12-12

### Added
- Full syntax highlighting for `.ctl` and `.ctrlpp` files
- IntelliSense with auto-completion for 983 WinCC OA built-in functions
- Function signatures and parameter information on hover
- Hover documentation with links to official WinCC OA docs
- Goto Definition (F12) for functions and `#uses` imports
- Find References for function usage across project
- Multi-folder workspace support
- Automatic project detection via `config/config` file
- Command: "Open Documentation for CTRL Function"
- Language Server Protocol integration
- Astyle-based code formatting (optional, disabled by default)
- WinCC OA native syntax checking (optional, disabled by default)
- Format on save support
- Syntax check on save support
- Project path resolution modes: workspace auto-detect or manual configuration
- Support for subprojects and multiple script paths
- Configuration setting: `winccoa.ctrlLang.pathSource` (workspace/manual)
- Configuration setting: `winccoa.astyleFormatter.enabled`
- Configuration setting: `winccoa.astyleFormatter.runOnSave`
- Configuration setting: `winccoa.syntaxCheck.enabled`
- Configuration setting: `winccoa.syntaxCheck.executeOnSave`
- Documentation viewer for built-in functions

### Known Limitations
- CtrlppCheck feature not yet implemented (planned for future release)
- Formatter and syntax checker disabled by default (opt-in)
- Pre-release version - testing in progress

