// Test script for CTRL syntax highlighting and language features
// This file tests various CTRL language constructs

#uses "myLibrary.ctl"
#uses "CtrlPv2Admin"

// Test global variables
global int g_counter = 0;
global string g_message;

// Test constants
const int MAX_ITEMS = 100;
const string APP_NAME = "TestApp";

// Test function with documentation comment
/**
 * Main entry point
 * @param param1 First parameter
 * @return Success status
 */
main()
{
  int result;
  string text = "Hello WinCC OA";
  dyn_string items;
  
  // Test builtin functions - hover should show documentation
  DebugN("Starting test script");
  
  // Test dpGet - should have IntelliSense
  dpGet("System1:ExampleDP_Arg1.", result);
  
  // Test control flow
  if (result > 0)
  {
    DebugN("Result is positive:", result);
  }
  else
  {
    DebugN("Result is zero or negative");
  }
  
  // Test loops
  for (int i = 0; i < MAX_ITEMS; i++)
  {
    dynAppend(items, "Item " + i);
  }
  
  // Test function call
  testFunction(text, result);
  
  // Test switch statement
  switch (result)
  {
    case 0:
      DebugN("Zero");
      break;
    case 1:
      DebugN("One");
      break;
    default:
      DebugN("Other");
      break;
  }
  
  // More WinCC OA specific functions to test
  dpConnect("callbackFunction", "System1:ExampleDP_Arg1.");
  dpSet("System1:ExampleDP_Arg1.", 42);
  
  // Test system functions
  time t = getCurrentTime();
  DebugN("Current time:", t);
  
  // Test delay
  delay(1);
}

/**
 * Test function for goto definition
 * Press F12 on this function name above to jump here
 */
void testFunction(string msg, int &refValue)
{
  DebugN("Test function called with:", msg);
  refValue = 123;
  
  // Test more builtins
  int len = strlen(msg);
  string upper = strtoupper(msg);
  
  DebugN("Length:", len, "Upper:", upper);
}

/**
 * Callback function for dpConnect
 */
void callbackFunction(string dp, int value)
{
  DebugN("Callback triggered:", dp, "=", value);
  g_counter++;
}

/**
 * Test error handling
 */
void testErrorHandling()
{
  errClass err;
  
  try
  {
    // Some operation that might fail
    dpGet("NonExistent:DP.", err);
  }
  catch
  {
    DebugN("Error occurred:", getLastError());
  }
}

/**
 * Test data types
 */
void testDataTypes()
{
  // Numeric types
  int myInt = 42;
  uint myUInt = 100;
  long myLong = 1000000;
  float myFloat = 3.14;
  double myDouble = 2.718281828;
  
  // String types
  string str = "test";
  
  // Boolean
  bool isTrue = TRUE;
  bool isFalse = FALSE;
  
  // Dynamic arrays
  dyn_int intArray;
  dyn_string strArray;
  dyn_float floatArray;
  
  // Time
  time t = getCurrentTime();
  
  // Mapping
  mapping m;
  m["key"] = "value";
  
  DebugN("Data types tested");
}
