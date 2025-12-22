# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

