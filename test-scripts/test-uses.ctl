// Test script for #uses resolution and goto definition
// This demonstrates library imports and navigation

#uses "libs/utils/stringUtils.ctl"
#uses "libs/utils/mathUtils.ctl"
#uses "CtrlPv2Admin"
#uses "std.ctl"

/**
 * Test #uses goto definition
 * Try:
 * 1. Ctrl+Click on "stringUtils.ctl" above -> should navigate to file
 * 2. Ctrl+Click on "CtrlPv2Admin" -> should navigate to builtin
 */

main()
{
  string result;
  int number = 42;
  
  // Test function calls - goto definition should work
  // Press F12 on these function names:
  result = formatString("Test: %d", number);
  int squared = square(number);
  
  DebugN("Result:", result);
  DebugN("Squared:", squared);
  
  // Test calling functions from imported libraries
  testStringUtils();
  testMathUtils();
}

/**
 * Local function - goto definition test
 * Press F12 on "formatString" in main() to jump here
 */
string formatString(string format, int value)
{
  return sprintf(format, value);
}

/**
 * Another local function
 * Press F12 on "square" in main() to jump here
 */
int square(int x)
{
  return x * x;
}

/**
 * Test string utility functions
 */
void testStringUtils()
{
  string text = "Hello World";
  
  // These should show IntelliSense from stringUtils.ctl
  string upper = toUpperCase(text);
  string lower = toLowerCase(text);
  bool isEmpty = isEmptyString("");
  
  DebugN("String utils:", upper, lower, isEmpty);
}

/**
 * Test math utility functions
 */
void testMathUtils()
{
  int a = 10;
  int b = 20;
  
  // These should show IntelliSense from mathUtils.ctl
  int max = maxValue(a, b);
  int min = minValue(a, b);
  int sum = addNumbers(a, b);
  
  DebugN("Math utils:", max, min, sum);
}
