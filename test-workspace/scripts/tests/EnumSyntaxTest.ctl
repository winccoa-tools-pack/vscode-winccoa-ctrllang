// ============================================================================
// ENUM SYNTAX VERIFICATION TEST
// ============================================================================
// Run this script in WinCC OA to verify correct enum syntax.
// Execute via: WCCOActrl EnumSyntaxTest.ctl -proj DevEnv
// ============================================================================

// Enum definitions - must be at file scope
enum Color
{
  RED,
  GREEN,
  BLUE
};

enum Priority
{
  //============================================================================
  // Negative value test
  //============================================================================
  UNDEFINED = -1,

  //============================================================================
  // Standard priorities
  //============================================================================

  /// Low priority tasks
  LOW = 1,

  /// Medium priority tasks
  MEDIUM = 5,

  //============================================================================
  // High priority range
  //============================================================================

  /// High priority
  HIGH = 10,

  /// Critical priority
  CRITICAL = 20,

  //============================================================================
  // Special cases
  //============================================================================

  /// Maximum priority value
  MAX = 99
};

enum LogLevel
{
  DEBUG,
  INFO,
  WARNING,
  FATAL
};

// Global enum variable
LogLevel g_logLevel = LogLevel::INFO; //TODO: Kein Hover über INFO möglich, kein hover über LogLevel, LogLevel goto klappt aber INFO nicht.

main()
{
  DebugN("=== ENUM SYNTAX TEST ===");
  DebugN("");

  // TEST 1: Simple enum definition
  DebugN("TEST 1: Simple enum definition");
  DebugN("  enum Color defined: OK");

  // TEST 2: Enum variable
  DebugN("TEST 2: Enum variable declaration");
  Color c = Color::RED;
  DebugN("  Color c = Color::RED:", c);

  // TEST 3: Enum comparison
  DebugN("TEST 3: Enum comparison");

  if (c == Color::RED)
  {
    DebugN("  c == Color::RED: TRUE");
  }

  // TEST 4: Enum with explicit values and comments
  DebugN("TEST 4: Enum with explicit values and comments");
  Priority prio = Priority::MEDIUM;
  DebugN("  Priority::MEDIUM value:", prio);

  // TEST 5: Enum with negative value
  DebugN("TEST 5: Enum with negative value");
  Priority undefined = Priority::UNDEFINED;
  DebugN("  Priority::UNDEFINED value:", undefined);

  // TEST 6: Enum in switch
  DebugN("TEST 6: Enum in switch statement");

  switch (c)
  {
    case Color::RED: //TODO: Kein Hover über RED möglich, kein hover über Color, Color goto klappt aber RED nicht.
      DebugN("  Switch matched RED");
      break;

    case Color::GREEN:
      DebugN("  Switch matched GREEN");
      break;

    case Color::BLUE:
      DebugN("  Switch matched BLUE");
      break;
  }

  // TEST 7: Casting enum to int
  DebugN("TEST 7: Enum to int cast");
  int colorValue = (int)c;
  DebugN("  (int)Color::RED =", colorValue);

  // TEST 8: Casting int to enum
  DebugN("TEST 8: Int to enum cast");
  Color c2 = (Color)1;
  DebugN("  (Color)1 =", c2);

  if (c2 == Color::GREEN)
  {
    DebugN("  (Color)1 == Color::GREEN: TRUE");
  }

  // TEST 9: Global enum variable
  DebugN("TEST 9: Global enum test");
  DebugN("  g_logLevel =", g_logLevel);

  // TEST 10: Enum with large explicit value
  DebugN("TEST 10: Enum with large explicit value");
  Priority maxPrio = Priority::MAX;
  DebugN("  Priority::MAX value:", maxPrio);

  DebugN("");
  DebugN("=== ALL TESTS COMPLETED ===");
}
