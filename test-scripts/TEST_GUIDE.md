# CTRL Language Extension - Test Guide

## Test Scenarios

### 1. Syntax Highlighting ✨

**Test File:** `test-basic.ctl`

Open the file and verify:
- [ ] Keywords highlighted (if, else, for, while, switch, case, etc.)
- [ ] String literals in quotes
- [ ] Comments in different style
- [ ] Numbers highlighted
- [ ] Function names highlighted
- [ ] Data types highlighted (int, string, bool, etc.)

### 2. Language Server Features 🚀

**Test File:** `test-basic.ctl`

#### IntelliSense (Auto-completion)
1. Type `dp` and press `Ctrl+Space`
   - [ ] Should show dpGet, dpSet, dpConnect, etc.
2. Type `Debug` and press `Ctrl+Space`
   - [ ] Should show DebugN, DebugTN, DebugFTN
3. Inside a function, type a variable name
   - [ ] Should show local variables

#### Hover Information
1. Hover over `dpGet`
   - [ ] Should show function signature and documentation
2. Hover over `DebugN`
   - [ ] Should show builtin function info
3. Hover over `getCurrentTime`
   - [ ] Should show time function documentation

### 3. Goto Definition (F12) 🎯

**Test File:** `test-uses.ctl`

1. In `main()`, click on `formatString` and press F12
   - [ ] Should jump to function definition below
2. Click on `square` and press F12
   - [ ] Should jump to square function
3. Click on `testStringUtils` and press F12
   - [ ] Should jump to function definition

### 4. #uses Resolution 📚

**Test File:** `test-uses.ctl`

1. Ctrl+Click on `"libs/utils/stringUtils.ctl"`
   - [ ] Should open stringUtils.ctl file
2. Ctrl+Click on `"libs/utils/mathUtils.ctl"`
   - [ ] Should open mathUtils.ctl file

### 5. Open Documentation Command 📖

**Test File:** `test-builtins.ctl`

1. Place cursor on `dpGet`
2. Press `Ctrl+Shift+P` → "Open Documentation for CTRL Function"
   - [ ] Should open WinCC OA online documentation in browser
3. Try with other functions like `dpSet`, `getCurrentTime`
   - [ ] Should open respective documentation

### 6. CTRL++ Support 🔧

**Test File:** `test-ctrlpp.ctlpp`

Open the file and verify:
- [ ] Class syntax highlighted
- [ ] `class`, `public`, `private` keywords
- [ ] Constructor/destructor syntax
- [ ] Method definitions
- [ ] Inheritance syntax (`: public`)

## How to Run Tests

### Start Extension Development Host

1. In VS Code (ctrlLang folder)
2. Press **F5**
3. New "Extension Development Host" window opens

### Open Test Files

In the Extension Development Host window:
```bash
File → Open Folder → packages/ctrlLang/test-scripts
```

### Run Individual Tests

1. Open each test file
2. Verify the features listed above
3. Check console for language server messages (F1 → "Developer: Show Logs")

## Expected Outputs

### Console Messages

Check **Output** panel → **WinCC OA Language Server**:
```
WinCC OA Language Server started! 🚀
```

### Problems Panel

Should show:
- Syntax errors in test files (if any)
- Undefined function warnings (for external libraries)

## Troubleshooting

### Language Server not starting
- Check Output → WinCC OA Language Server
- Rebuild: `npm run compile`
- Restart Extension Development Host

### No IntelliSense
- Wait 2-3 seconds after opening file
- Check if file extension is `.ctl` or `.ctrl`
- Verify language mode shows "ctrl" in status bar

### Goto Definition not working
- Ensure function is defined in same file or #uses
- Check language server is running
- Try "Go to Definition" from right-click menu

## Success Criteria

✅ All syntax highlighting works
✅ IntelliSense shows WinCC OA functions
✅ Hover shows documentation
✅ F12 navigates to definitions
✅ #uses files can be opened
✅ Documentation command opens browser
✅ No errors in console
