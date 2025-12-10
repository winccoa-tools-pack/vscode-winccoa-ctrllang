# WinCC OA CTRL Language Support

<div align="center">

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)
![License](https://img.shields.io/badge/license-GPL--3.0-green.svg)
![VS Code](https://img.shields.io/badge/VS%20Code-^1.105.0-007ACC.svg)

**Comprehensive language support for WinCC OA CTRL and CTRL++ in Visual Studio Code**

⚠️ *Pre-Release Version - Not all features have been fully tested yet*

</div>

---

## ✨ Features

### 🎨 Syntax Highlighting
Full syntax highlighting for `.ctl` and `.ctlpp`, files with support for WinCC OA built-in functions.

### 🧠 IntelliSense
- **Auto-completion** for WinCC OA built-in functions
- **Function signatures** with parameter information
- **Hover documentation** with descriptions and links to official docs

### 🔍 Code Navigation
- **Goto Definition** (`F12` or `Ctrl+Click`) for functions and `#uses` imports
- **Find References** to see where functions are used
- Automatic detection of project structure from `config/config` file

### 📚 Documentation Access
Quick access to official WinCC OA documentation:
1. Place cursor on a function name
2. Press `Ctrl+Shift+P` → `WinCC OA: Open Documentation for CTRL Function`
3. Opens documentation in your browser

### 🔧 Code Formatting (Optional)
Astyle-based code formatting for `.ctl` and `.ctrlpp` files
- Enable in settings: `winccoa.astyleFormatter.enabled`
- Format on save: `winccoa.astyleFormatter.runOnSave`

### ✅ Syntax Checking (Optional)
Native WinCC OA syntax validation
- Enable in settings: `winccoa.syntaxCheck.enabled`
- Check on save: `winccoa.syntaxCheck.executeOnSave`

---

## 🚀 Getting Started

### Installation
1. Open VS Code
2. Go to Extensions (`Ctrl+Shift+X`)
3. Search for "WinCC OA CTRL Language Support"
4. Click Install

### Configuration

The extension auto-detects your WinCC OA project structure when you open a workspace containing a `config/config` file.

---

## ⚙️ Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `winccoa.ctrlLang.pathSource` | `workspace` | How to resolve project paths: `workspace` or `manual` |
| `winccoa.astyleFormatter.enabled` | `false` | Enable Astyle code formatting |
| `winccoa.astyleFormatter.runOnSave` | `false` | Automatically format on save |
| `winccoa.syntaxCheck.enabled` | `false` | Enable WinCC OA syntax checking |
| `winccoa.syntaxCheck.executeOnSave` | `false` | Run syntax check on save |

---

## 📋 Commands

| Command | Description |
|---------|-------------|
| `WinCC OA: Open Documentation for CTRL Function` | Opens official documentation for the function under cursor |
| `WinCC OA: Format Document with Astyle` | Formats the current document |
| `WinCC OA: Run WinCC OA Syntax Check` | Runs syntax validation on current file |

---

## 🛠️ Requirements

- Visual Studio Code 1.105.0 or higher
- For syntax checking: WinCC OA installation with `WCCOActrl` executable

---

## 📜 Disclaimer

WinCC OA and Siemens are trademarks of Siemens AG. This project is not affiliated with, endorsed by, or sponsored by Siemens AG. This is a community-driven open source project created to enhance the development experience for WinCC OA developers.

---

## 📄 License

This project is licensed under the **GNU General Public License v3.0**.

---

## 🙏 Third-Party Code

This project includes and is derived from files originating from:

**vscode-ctrlpptools**  
https://github.com/LukasSchopp/vscode-ctrlpptools  
License: GNU GPL v3.0

Included and modified files:
- `language-configuration.json`
- `syntaxes/ctrl.tmLanguage.json`
- `syntaxes/ctrlpp.tmLanguage.json`

---

## 🤝 Contributing

Contributions are welcome! Whether you want to:
- Report bugs or issues
- Suggest new features
- Improve documentation
- Submit code improvements

Please open an issue or submit a pull request on [GitHub](https://github.com/winccoa-tools-pack/vscode-winccoa-ctrllang).

---

## 🔗 Links

- [GitHub Repository](https://github.com/winccoa-tools-pack/vscode-winccoa-ctrllang)
- [Issue Tracker](https://github.com/winccoa-tools-pack/vscode-winccoa-ctrllang/issues)
- [WinCC OA Documentation](https://www.winccoa.com)

---

<div align="center">

Made with ❤️ for the WinCC OA community

</div>