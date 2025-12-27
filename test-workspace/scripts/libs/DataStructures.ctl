// ============================================================================
// DataStructures.ctl - Struct definitions for testing
// ============================================================================
//
// MANUAL TEST INSTRUCTIONS:
// 1. Open this file in VS Code
// 2. Test Struct Go-to-Definition:
//    - Click on "Point" in line 17 → should jump to line 17 (struct definition)
//    - Click on "x" in line 19 → should jump to line 19 (field declaration)
//    - Click on "Rectangle" in line 24 → should jump to line 24 (struct definition)
// 3. Test Find All References:
//    - Right-click on "Point" → Find All References
//    - Should show: definition + usage in Rectangle struct + usage in main files
//    - Right-click on "width" → Find All References
//    - Should show: declaration + all usages
// ============================================================================

struct Point
{
  int x;
  int y;
};

struct Rectangle
{
  Point topLeft;
  Point bottomRight;
  int width;
  int height;
};

struct Circle
{
  Point center;
  int radius;
};

struct Color
{
  int red;
  int green;
  int blue;
  int alpha;
};
