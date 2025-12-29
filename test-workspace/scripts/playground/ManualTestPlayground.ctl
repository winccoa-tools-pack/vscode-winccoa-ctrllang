// ============================================================================
// MANUAL TEST PLAYGROUND - WinCC OA CTL Language Extension
// ============================================================================
//
// This file contains all manual test cases for the Language Server features.
// Go through each section step by step to verify functionality.
//
// HOW TO USE:
// 1. Open this file in VS Code with the extension active
// 2. For each TEST section, place cursor on the marked position
// 3. Execute the action (Hover, Ctrl+Click, etc.)
// 4. Verify the expected result
//
// ============================================================================

#uses "libs/DataStructures"    // Structs: Point, Rectangle, Circle
#uses "libs/BaseClass"         // Class: BaseClass
#uses "libs/DerivedClass"      // Class: DerivedClass extends BaseClass

// ============================================================================
// SECTION 1: HOVER TESTS
// ============================================================================

// --- TEST 1.1: Hover on Builtin Function ---
// ACTION: Hover over "dpGet"
// EXPECT: Signature "int dpGet(string dp, anytype &value1, ...)" with description
void testBuiltinHover()
{
  string value;
  dpGet("System1:Example.value", value);
  //^^^^^ HOVER HERE
}

// --- TEST 1.2: Hover on User Function ---
// ACTION: Hover over "calculateArea"
// EXPECT: Signature "float calculateArea(float width, float height)"
float calculateArea(float width, float height)
{
  return width * height;
}

void testUserFunctionHover()
{
  float area = calculateArea(10.0, 20.0);
  //           ^^^^^^^^^^^^^ HOVER HERE
}

// --- TEST 1.3: Hover on Class ---
// ACTION: Hover over "Calculator"
// EXPECT: "class Calculator" with members/methods info
class Calculator
{
private:
  int m_result;

public:
  void setResult(int value) { m_result = value; }
  int getResult() { return m_result; }
};

void testClassHover()
{
  Calculator calc;
  //^^^^^^^^^ HOVER HERE
}

// --- TEST 1.4: Hover on Struct ---
// ACTION: Hover over "TestPoint"
// EXPECT: "struct TestPoint" with fields
struct TestPoint
{
  int x;
  int y;
};

void testStructHover()
{
  TestPoint pt;
  //^^^^^^^^ HOVER HERE
}

// --- TEST 1.5: Hover on Member Access ---
// ACTION: Hover over "x" in "pt.x"
// EXPECT: "int x" (field type)
void testMemberAccessHover()
{
  TestPoint pt;
  int val = pt.x;
  //           ^ HOVER HERE
}

// --- TEST 1.6: Hover on Method Call ---
// ACTION: Hover over "getResult"
// EXPECT: Method signature "int getResult()"
void testMethodHover()
{
  Calculator calc;
  int r = calc.getResult();
  //           ^^^^^^^^^ HOVER HERE
}

// ============================================================================
// SECTION 2: GO-TO-DEFINITION TESTS
// ============================================================================

// --- TEST 2.1: Go-to-Definition on Local Variable ---
// ACTION: Ctrl+Click on "localVar" in the return statement
// EXPECT: Jump to line where localVar is declared
int testLocalVarDefinition()
{
  int localVar = 42;
  return localVar;
  //     ^^^^^^^^ CTRL+CLICK HERE
}

// --- TEST 2.2: Go-to-Definition on Function Parameter ---
// ACTION: Ctrl+Click on "param" in the function body
// EXPECT: Jump to parameter declaration in function signature
int testParameterDefinition(int param)
{
  return param * 2;
  //     ^^^^^ CTRL+CLICK HERE
}

// --- TEST 2.3: Go-to-Definition on Global Variable ---
// ACTION: Ctrl+Click on "g_counter" in the function
// EXPECT: Jump to global variable declaration
global int g_counter = 0;

void testGlobalVarDefinition()
{
  g_counter++;
  //^^^^^^^^ CTRL+CLICK HERE
}

// --- TEST 2.4: Go-to-Definition on Class Member ---
// ACTION: Ctrl+Click on "m_result" inside getResult()
// EXPECT: Jump to member declaration (line ~55)
// (Use Calculator class defined above)

// --- TEST 2.5: Go-to-Definition on #uses File ---
// ACTION: Ctrl+Click on "DataStructures" in the #uses directive at top
// EXPECT: Opens libs/DataStructures.ctl

// --- TEST 2.6: Go-to-Definition on Cross-File Symbol ---
// ACTION: Ctrl+Click on "Point" (from DataStructures.ctl)
// EXPECT: Jump to Point struct in libs/DataStructures.ctl
void testCrossFileDefinition()
{
  Point pt;
  //^^^ CTRL+CLICK HERE
}

// --- TEST 2.7: Go-to-Definition on Derived Class ---
// ACTION: Ctrl+Click on "DerivedClass"
// EXPECT: Jump to DerivedClass definition in libs/DerivedClass.ctl
void testDerivedClassDefinition()
{
  DerivedClass obj;
  //^^^^^^^^^^^ CTRL+CLICK HERE
}

// ============================================================================
// SECTION 3: MEMBER ACCESS CHAIN TESTS
// ============================================================================

// --- TEST 3.1: Simple Member Access ---
// ACTION: Hover over "center" in "circle.center"
// EXPECT: "Point center" (field type)
void testSimpleMemberAccess()
{
  Circle circle;
  Point p = circle.center;
  //               ^^^^^^ HOVER HERE
}

// --- TEST 3.2: Nested Member Access Chain ---
// ACTION: Hover over "x" in "circle.center.x"
// EXPECT: "int x" (resolves Point.x)
void testNestedMemberAccess()
{
  Circle circle;
  int xPos = circle.center.x;
  //                       ^ HOVER HERE
}

// --- TEST 3.3: Go-to-Definition on Nested Member ---
// ACTION: Ctrl+Click on "x" in "circle.center.x"
// EXPECT: Jump to x field in Point struct (DataStructures.ctl)
void testNestedMemberDefinition()
{
  Circle circle;
  int xPos = circle.center.x;
  //                       ^ CTRL+CLICK HERE
}

// ============================================================================
// SECTION 4: COMPLETION TESTS
// ============================================================================

// --- TEST 4.1: Builtin Function Completion ---
// ACTION: Type "dpG" and trigger completion (Ctrl+Space)
// EXPECT: List shows dpGet, dpGetAsynch, dpGetPeriod, etc.
void testBuiltinCompletion()
{
  // Type here: dpG
}

// --- TEST 4.2: Completion Detail ---
// ACTION: In completion list, check detail for dpSet
// EXPECT: Shows signature with parameters

// ============================================================================
// SECTION 5: EDGE CASES
// ============================================================================

// --- TEST 5.1: Variable Shadowing ---
// ACTION: Hover over "value" inside method - should show parameter, not member
class ShadowTest
{
private:
  int value;

public:
  void setValue(int value)
  {
    this.value = value;
    //           ^^^^^ HOVER HERE - should be "int value" (parameter)
  }
};

// --- TEST 5.2: Constructor Recognition ---
// ACTION: Hover over "Calculator" after "new"
// EXPECT: Constructor signature, not just "class Calculator"
void testConstructorHover()
{
  Calculator calc = new Calculator();
  //                    ^^^^^^^^^^ HOVER HERE
}

// --- TEST 5.3: Global vs Member Variable ---
// ACTION: Inside main(), g_testValue should resolve to global
// ACTION: Inside TestClass.doSomething(), m_value should resolve to member
global int g_testValue = 100;

class TestClass
{
private:
  int m_value;

public:
  void doSomething()
  {
    m_value = g_testValue;
    //^^^^^^ HOVER HERE - should be member
    //        ^^^^^^^^^^^ HOVER HERE - should be global
  }
};

// ============================================================================
// SECTION 6: CROSS-FILE RESOLUTION
// ============================================================================

// --- TEST 6.1: Class from Dependency ---
// ACTION: Hover over "BaseClass"
// EXPECT: Shows class info from libs/BaseClass.ctl
void testBaseClassFromLib()
{
  BaseClass base;
  //^^^^^^^^ HOVER HERE
}

// --- TEST 6.2: Inherited Method ---
// ACTION: Ctrl+Click on method from base class called on derived
// EXPECT: Navigates to correct file

// ============================================================================
// MAIN - Can be executed in WinCC OA for syntax validation
// ============================================================================
main()
{
  DebugN("=== Manual Test Playground ===");
  DebugN("Open this file and follow the test instructions above.");
  DebugN("Each TEST section has ACTION and EXPECT comments.");
}
