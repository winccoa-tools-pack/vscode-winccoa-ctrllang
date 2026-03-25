# Test Workspace - File Index

This directory contains all test fixtures and libraries for the
WinCC OA CTL Language Server.

## Quick Start: Manual Testing

**Open this file for step-by-step manual testing:**

```text
playground/ManualTestPlayground.ctl
```

---

## Directory Structure

```text
scripts/
├── playground/           # Manual testing (interactive)
│   └── ManualTestPlayground.ctl   # ALL features in one file
│
├── fixtures/             # Unit test fixtures (automated tests read these)
│   ├── TestGoToDefinition.ctl     # Go-to-definition test cases
│   ├── TestHover.ctl              # Hover test cases
│   ├── TestCrossFile.ctl          # Cross-file resolution tests
│   ├── TestClassInheritance.ctl   # Inheritance & polymorphism
│   ├── SyntaxTest.ctl             # Syntax edge cases
│   └── NewFile.ctl                # Empty/new file scenarios
│
├── libs/                 # Shared libraries (used by fixtures)
│   ├── DataStructures.ctl         # Point, Rectangle, Circle structs
│   ├── BaseClass.ctl              # Base class for inheritance tests
│   ├── DerivedClass.ctl           # Derived class (extends BaseClass)
│   ├── TestLibrary.ctl            # General test utilities
│   ├── UtilityFunctions.ctl       # Helper functions
│   └── testlib.ctl                # Additional test library
│
├── tests/                # WinCC OA OaTest files (for Test Explorer)
│   └── ...
│
└── gedi/                 # GEDI panel scripts
    └── ...
```

---

## Fixtures Reference

### fixtures/TestGoToDefinition.ctl

Tests for Go-to-Definition (Ctrl+Click):

- Local variables
- Function parameters  
- Global variables
- Class members
- Cross-file navigation via #uses

### fixtures/TestHover.ctl

Tests for Hover information:

- Builtin functions (dpGet, dpSet, etc.)
- User-defined functions
- Class and struct types
- Member variables and methods
- Nested member access (obj.member.field)

### fixtures/TestCrossFile.ctl

Tests for cross-file symbol resolution:

- #uses directive navigation
- Symbols from dependency files
- Type resolution across files

### fixtures/TestClassInheritance.ctl

Tests for OOP features:

- Class inheritance (extends)
- Base class member access
- Method overriding
- Constructor calls

---

## Libraries Reference

### libs/DataStructures.ctl

```ctl
struct Point { int x; int y; }
struct Rectangle { Point topLeft; Point bottomRight; }
struct Circle { Point center; int radius; }
```

### libs/BaseClass.ctl

```ctl
class BaseClass {
    // Base class with virtual methods
}
```

### libs/DerivedClass.ctl

```ctl
class DerivedClass : BaseClass {
    // Extends BaseClass
}
```

---

## Adding New Test Cases

### For Automated Tests (Unit Tests)

1. Add fixture file to `fixtures/`
2. Add test case in `language-server/test/`
3. Reference fixture via `../../../test-workspace/scripts/fixtures/`

### For Manual Testing

1. Add test section to `playground/ManualTestPlayground.ctl`
2. Use format:

```ctl
// --- TEST X.Y: Description ---
// ACTION: What to do
// EXPECT: What should happen
void testSomething()
{
    // code
    //^^^^ HOVER/CLICK HERE
}
```

---

## Version Info

- Last updated: 2025-12-29
- Extension version: v0.5.0
- Test count: 84 automated + manual playground
