// Test script for WinCC OA builtin functions
// Hover over function names to see documentation
// Use Ctrl+Space for IntelliSense

main()
{
  // Test datapoint functions
  // Hover over dpGet to see documentation
  int value;
  dpGet("System1:ExampleDP_Arg1.", value);
  dpSet("System1:ExampleDP_Arg1.", 42);
  
  // Test dpConnect - should show parameters
  dpConnect("myCallback", "System1:ExampleDP_Arg1.");
  dpDisconnect("myCallback", "System1:ExampleDP_Arg1.");
  
  // Test string functions
  string text = "WinCC OA";
  int len = strlen(text);                    // Hover for documentation
  string upper = strtoupper(text);           // IntelliSense should work
  string lower = strtolower(text);
  string sub = substr(text, 0, 5);
  
  // Test array functions
  dyn_int numbers;
  dynAppend(numbers, 1);                     // Hover for documentation
  dynAppend(numbers, 2);
  dynAppend(numbers, 3);
  int count = dynlen(numbers);               // Should show parameter info
  dynClear(numbers);
  
  // Test time functions
  time now = getCurrentTime();               // IntelliSense
  int year = year(now);
  int month = month(now);
  int day = day(now);
  
  // Test file functions
  bool exists = isfile("/tmp/test.txt");     // Hover for info
  int fileSize = getFileSize("/tmp/test.txt");
  
  // Test system functions
  string hostname = getHostname();           // Documentation on hover
  int pid = getpid();
  
  // Test debugging functions
  DebugN("Debug message");                   // Common function
  DebugTN("Debug with timestamp");
  DebugFTN("test.ctl", "Debug with file and timestamp");
  
  // Test mathematical functions
  float result = sqrt(16.0);                 // Should show math docs
  float power = pow(2.0, 8.0);
  float sine = sin(3.14159);
  
  // Test type conversion
  string numStr = "123";
  int num = (int)numStr;
  float fNum = (float)num;
  
  DebugN("All tests completed");
}

void myCallback(string dp, int newValue)
{
  DebugN("Callback:", dp, "=", newValue);
}
