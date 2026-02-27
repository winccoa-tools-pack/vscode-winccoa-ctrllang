// ============================================================================
// TestSubdirectoryGoto.ctl - Test cross-file goto with subdirectory structure
// ============================================================================
//
// This file tests Go-to-Definition for libraries in subdirectories:
// - Functions from libs/Utils/StringHelper.ctl
// - Global variables from subdirectory libraries
//
// CRITICAL: This tests the fix for the bug where only top-level /libs/*.ctl
// files were searched, but not /libs/Subdirectory/*.ctl files!
// ============================================================================

#uses "Utils/StringHelper"

main()
{
  string text = "Hello World";

  // Call functions from subdirectory library
  string upper = toUpperCase(text);
  string lower = toLowerCase(text);
  string trimmed = trim("  test  ");
  bool starts = startsWith(text, "Hello");

  // Access global from subdirectory library
  g_stringOpCount = g_stringOpCount + 1;

  DebugN("Upper: " + upper);
  DebugN("Lower: " + lower);
  DebugN("Trimmed: " + trimmed);
  DebugN("Starts with: " + starts);
  DebugN("Op count: " + g_stringOpCount);
}
