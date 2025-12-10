# WinCC OA CTRL Language Support

⚠️ **Pre-Release Version** - This is the very first pre-release version. Not all features have been fully tested yet.

VS Code extension providing comprehensive language support for WinCC OA CTRL and CTRL++ languages.

## Features

- **Syntax Highlighting** - Full syntax highlighting for `.ctl`, `.ctlpp` files
- **IntelliSense** - Code completion for WinCC OA built-in functions
- **Goto Definition** - Navigate to function definitions and `#uses` libraries
- **Hover Information** - Documentation for built-in functions
- **Open Documentation** - Quick access to online WinCC OA documentation

## Usage

### Syntax Highlighting
Just open any `.ctl` or `.ctrl` file - syntax highlighting works automatically.

### Open Documentation
1. Place cursor on a WinCC OA function name
2. Press `Ctrl+Shift+P` → `WinCC OA: Open Documentation for CTRL Function`
3. Or right-click → `Open Documentation`

### Goto Definition
- `F12` or `Ctrl+Click` on function names
- Works for local functions and `#uses` imports

## Disclaimer

WinCC OA and Siemens are trademarks of Siemens AG. This project is not affiliated with, endorsed by, or sponsored by Siemens AG. This is a community-driven open source project created to enhance the development experience for WinCC OA developers.

## License

This project is licensed under the GNU General Public License v3.0.

## Third-Party Code

This project includes and is derived from files originating from:

- vscode-ctrlpptools  
  https://github.com/LukasSchopp/vscode-ctrlpptools  
  License: GNU GPL v3.0

Included files:
- language-configuration.json
- syntaxes/ctrl.tmLanguage.json
- syntaxes/ctrlpp.tmLanguage.json

These files were modified.

## Contributing

Contributions are welcome. If you want to add more extensions to the pack or suggestions for documentation, open an issue or submit a pull request.