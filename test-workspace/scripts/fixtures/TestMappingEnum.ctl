// ============================================================================
// TEST FIXTURE: Mapping and Enum Support
// ============================================================================
// This file tests parsing and resolution of mapping and enum types in CTL
// ============================================================================

// ============================================================================
// SECTION 1: ENUM DEFINITIONS
// ============================================================================

// Simple enum
enum Color { RED, GREEN, BLUE };

// Enum with explicit values
enum Status { STOPPED = 0, RUNNING = 1, ERROR = 2 };

// Enum with mixed values
enum Priority { LOW, MEDIUM = 5, HIGH, CRITICAL = 10 };

// ============================================================================
// SECTION 2: ENUM USAGE
// ============================================================================

void testEnumUsage()
{
  // Enum variable declaration
  Color c = Color::RED;

  // Enum in switch
  switch (c)
  {
    case Color::RED:
      DebugN("Red");
      break;

    case Color::GREEN:
      DebugN("Green");
      break;

    case Color::BLUE:
      DebugN("Blue");
      break;
  }

  // Enum comparison
  if (c == Color::RED)
  {
    DebugN("It's red!");
  }

  // Enum as function parameter
  printColor(c);

  // Enum from function return
  Status s = getStatus();
}

void printColor(Color c)
{
  DebugN("Color value: " + c);
}

Status getStatus()
{
  return Status::RUNNING;
}

// ============================================================================
// SECTION 3: MAPPING DECLARATIONS
// ============================================================================

void testMappingDeclarations()
{
  // Simple mapping
  mapping m;

  // Mapping with initialization
  mapping config = makeMapping("key1", "value1", "key2", 42);

  // Dynamic mapping
  dyn_mapping dynMap;
}

// ============================================================================
// SECTION 4: MAPPING OPERATIONS
// ============================================================================

void testMappingOperations()
{
  mapping m;

  // String key access
  m["name"] = "Test";
  m["count"] = 42;
  m["active"] = true;

  // Reading values
  string name = m["name"];
  int count = m["count"];

  // Mapping functions
  dyn_string keys = mappingKeys(m);
  bool hasKey = mappingHasKey(m, "name");
  int len = mappingLen(m);

  // Remove key
  mappingRemove(m, "count");

  // Clear mapping
  mappingClear(m);
}

// ============================================================================
// SECTION 5: NESTED STRUCTURES
// ============================================================================

void testNestedStructures()
{
  // Mapping in mapping
  mapping outer;
  mapping inner;
  inner["value"] = 100;
  outer["nested"] = inner;

  // Access nested
  int val = outer["nested"]["value"];

  // Mapping with enum values
  mapping statusMap;
  statusMap["current"] = Status::RUNNING;
  statusMap["previous"] = Status::STOPPED;
}

// ============================================================================
// SECTION 6: GLOBAL ENUM AND MAPPING
// ============================================================================

global enum LogLevel { DEBUG, INFO, WARNING, ERROR_LEVEL, FATAL };

global mapping g_config;

void testGlobalEnumMapping()
{
  g_config["logLevel"] = LogLevel::INFO;

  LogLevel level = g_config["logLevel"];
}

// ============================================================================
// SECTION 7: ENUM BUILTIN FUNCTIONS
// ============================================================================

void testEnumBuiltins()
{
  // Get enum keys
  dyn_string colorKeys = enumKeys("Color");

  // Get enum values
  mapping colorValues = enumValues("Color");

  // Check enum type
  Color c = Color::RED;
  int typeId = getType(c);
}

// ============================================================================
// MAIN - Manual Test Examples
// ============================================================================
// Quick manual tests for key enum/mapping features.
// Place cursor on marked positions and test Hover/Go-to-Definition.
// ============================================================================

main()
{
  DebugN("=== Mapping and Enum Test ===");

  // --- MANUAL TEST: Enum Type Hover ---
  // ACTION: Hover over "Color"
  // EXPECT: "enum Color { RED, GREEN, BLUE }"
  Color myColor = Color::RED;
  //^^^^ HOVER HERE

  // --- MANUAL TEST: Enum Member Access ---
  // ACTION: Hover over "RED" in "Color::RED"
  // EXPECT: "Color::RED = 0"
  Status s = Status::RUNNING;
  //                 ^^^^^^^ HOVER HERE

  // --- MANUAL TEST: Enum Go-to-Definition ---
  // ACTION: Ctrl+Click on "Priority"
  // EXPECT: Jumps to line 18 (enum Priority definition)
  Priority p = Priority::HIGH;
  //^^^^^^^ CTRL+CLICK HERE

  // --- MANUAL TEST: Mapping Variable Hover ---
  // ACTION: Hover over "config"
  // EXPECT: "mapping config"
  mapping config;
  //      ^^^^^^ HOVER HERE
  config["server"] = "localhost";

  // --- MANUAL TEST: Global Enum ---
  // ACTION: Hover over "g_logLevel"
  // EXPECT: "global LogLevel g_logLevel"
  g_logLevel = LogLevel::WARNING;
  //^^^^^^^^^^ HOVER HERE

  // Run all test functions
  testEnumUsage();
  testMappingDeclarations();
  testMappingOperations();
  testNestedStructures();
  testGlobalEnumMapping();
  testEnumBuiltins();

  DebugN("All tests completed");
}
