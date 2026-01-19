// ============================================================================
// TestCrossFileGoto.ctl - Test file for cross-file Go-to-Definition
// ============================================================================
//
// This file tests:
// 1. Go-to-Definition on function from #uses library
// 2. Go-to-Definition on global variable from #uses library
// 3. Multiple function calls from same library
//
// MANUAL TEST:
// - Click on "add" in line 19 → should jump to MathLibrary.ctl line 6
// - Click on "multiply" in line 20 → should jump to MathLibrary.ctl line 18
// - Click on "g_mathCallCount" in line 23 → should jump to MathLibrary.ctl line 31
// ============================================================================

#uses "MathLibrary"

main()
{
  int sum = add(5, 10);
  int product = multiply(3, 7);

  // Access global from library
  g_mathCallCount = g_mathCallCount + 1;

  DebugN("Sum: " + sum);
  DebugN("Product: " + product);
  DebugN("Call count: " + g_mathCallCount);
}
