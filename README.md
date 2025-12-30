# WinCC OA CTRL Language Support

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.1-blue.svg)
![License](https://img.shields.io/badge/license-GPL--3.0-green.svg)
![VS Code](https://img.shields.io/badge/VS%20Code-^1.105.0-007ACC.svg)

**Language support for WinCC OA CTRL and CTRL++ in Visual Studio Code**

[Features](#-features) • [Installation](#-installation) • [Known Issues](#-known-issues)

</div>

---

> **Disclaimer:**
> This is the first stable release (v1.0.1) of the WinCC OA CTRL Language extension. Not all features are fully implemented and some functions may not work perfectly yet. Please report any issues you encounter.

---

## ✨ Features

### 🎨 Syntax Highlighting
- Full support for `.ctl` and `.ctlpp` files
- WinCC OA built-in functions highlighted
- Classes, structs, enums, and mappings

### 🧠 IntelliSense & Code Intelligence
- **Hover Information**: See function signatures, variable types, and documentation
- **Auto-Completion**: WinCC OA built-in functions with parameter hints
- **Go-to-Definition** (`F12` or `Ctrl+Click`):
  - Functions and methods
  - Classes and structs
  - Variables (global, local, member)
  - Enums and enum members (`Color::RED`)
  - `#uses` imports (cross-file navigation)
- **Member Access Navigation**: Chain navigation `obj.member.field`

### 🔍 Advanced Language Features
- **Enum Support**: Hover and navigation for `enum Color { RED, GREEN }`
- **Class Inheritance**: Navigate to base classes (single-level)
- **Scope-Aware Resolution**: Distinguishes local vs. member variables
- **Cross-File Dependencies**: Automatic `#uses` resolution

### 📚 Documentation Access
- Quick access to official WinCC OA documentation
- `Ctrl+Shift+P` → `WinCC OA: Open Documentation for CTRL Function`

### 🔧 Code Formatting (Optional)
- Astyle-based formatting for `.ctl` and `.ctlpp` files
- Format on save support

### ✅ Syntax Checking (Optional)
- Native WinCC OA syntax validation via `WCCOActrl`
- Inline error highlighting

---

## 🚀 Installation

1. **Install from VSIX** (Recommended):
   ```bash
   code --install-extension winccoa-ctrllang-1.0.1.vsix
   ```

2. **Or via VS Code Extensions**:
   - Open Extensions (`Ctrl+Shift+X`)
   - Search for "WinCC OA CTRL Language Support"
   - Click Install

3. **Open your WinCC OA project**:
   - The extension auto-detects projects with a `config/config` file
   - Start coding with full IntelliSense support!

---

## ⚙️ Configuration

### Essential Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `winccoa.ctrlLang.pathSource` | `workspace` | Project path detection: `workspace` (auto-detect) or `manual` |
| `winccoa.syntaxCheck.enabled` | `false` | Enable WinCC OA syntax validation |
| `winccoa.syntaxCheck.executeOnSave` | `false` | Run syntax check automatically on save |
| `winccoa.astyleFormatter.enabled` | `false` | Enable Astyle code formatting |
| `winccoa.astyleFormatter.runOnSave` | `false` | Format code on save |

### Logging (for debugging)

| Setting | Default | Description |
|---------|---------|-------------|
| `winccoa.ctrlLang.logLevel` | `INFO` | Log verbosity: `ERROR`, `WARN`, `INFO`, `DEBUG`, `TRACE` |

💡 **Tip**: Set log level to `DEBUG` when reporting bugs for detailed diagnostics.

---

## 🐛 Known Issues

### Current Limitations

1. **Inheritance Chains**:
   - Only 1 level of inheritance supported
   - `class C : B : A` → `obj.memberInA` not resolved

2. **Interfaces**:
   - Interface parsing not yet implemented
   - `interface IDrawable` syntax not recognized

3. **Static Members**:
   - `class Utils { public static int counter; }`
   - Static member detection not yet supported
   - `Utils::method()` may be confused with enums

4. **Goto-Definition Precision**:
   - Occasional jumps to wrong line numbers
   - Especially in complex member access chains

### Reporting Bugs

Found an issue? Please report it with:
- WinCC OA version
- Extension version (`1.0.1`)
- Code example that reproduces the issue
- Enable `DEBUG` logging and attach log output

[Report Issue on GitHub](https://github.com/winccoa-tools-pack/vscode-winccoa-ctrllang/issues)

---

##  Commands

Access via `Ctrl+Shift+P`:

| Command | Description |
|---------|-------------|
| `WinCC OA: Open Documentation for CTRL Function` | Opens official docs for function under cursor |
| `WinCC OA: Format Document with Astyle` | Formats current document |
| `WinCC OA: Run WinCC OA Syntax Check` | Validates syntax with WCCOActrl |

---

## 🛠️ Requirements

- **VS Code:** 1.105.0 or higher
- **WinCC OA:** 3.19+ (optional, required for syntax checking via `WCCOActrl`)
- **WinCC OA Core Extension:** (optional, recommended) Enables automatic project detection and management. With the Core extension installed, you can select your active project from a list—the Language extension will automatically detect all local projects with a `config/config` file.
- **Project Structure:** Your workspace must contain a `config/config` file (standard WinCC OA project layout) for auto-detection to work.

**Automatic Mode:**
If the WinCC OA Core Extension is installed, project detection is fully automatic. The Core extension scans your workspace for `config/config` files and lets you select the active project. The Language extension then provides IntelliSense and features based on your active project.

---

## 📄 License

This project is licensed under the **GNU General Public License v3.0**.

---

## 🙏 Third-Party Code

This extension includes code from:

**vscode-ctrlpptools** by [LukasSchopp](https://github.com/LukasSchopp/vscode-ctrlpptools)  
License: GNU GPL v3.0

Modified files:
- `language-configuration.json`
- `syntaxes/ctrl.tmLanguage.json`
- `syntaxes/ctrlpp.tmLanguage.json`

---

## 📜 Disclaimer

WinCC OA and Siemens are trademarks of Siemens AG. This project is not affiliated with, endorsed by, or sponsored by Siemens AG. This is a community-driven open source project.

---

<div align="center">

Made with ❤️ for the WinCC OA community

[GitHub](https://github.com/winccoa-tools-pack/vscode-winccoa-ctrllang) • [Issues](https://github.com/winccoa-tools-pack/vscode-winccoa-ctrllang/issues) • [WinCC OA Docs](https://www.winccoa.com)

</div>
