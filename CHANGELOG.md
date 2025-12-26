# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

