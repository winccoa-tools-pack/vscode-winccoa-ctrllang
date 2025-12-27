// ============================================================================
// UtilityFunctions.ctl - Global utility functions
// ============================================================================
//
// MANUAL TEST INSTRUCTIONS:
// 1. Open this file in VS Code
// 2. Test Global Variable Go-to-Definition:
//    - Click on "g_logLevel" in line 23 → should jump to line 17 (declaration)
//    - Click on "g_config" in line 35 → should jump to line 18 (declaration)
// 3. Test Function Go-to-Definition:
//    - Click on "logMessage" in line 31 → should jump to line 21 (function definition)
//    - Click on "calculateSum" in line 54 → should jump to line 44 (function definition)
// 4. Test Find All References:
//    - Right-click on "g_logLevel" → Find All References
//    - Should show: declaration + all usages in this file + usages in main files
//    - Right-click on "calculateSum" → Find All References
//    - Should show: definition + all calls
// ============================================================================

global int g_logLevel;
global string g_config;

// Simple logging function
void logMessage(string message, int level)
{
  if (level >= g_logLevel)
  {
    DebugN("[" + level + "] " + message);
  }
}

// Initialize configuration
void initConfig()
{
  g_config = "default_config.ini";
  g_logLevel = 2;

  logMessage("Configuration initialized", 1);
  logMessage("Config file: " + g_config, 2);
}

// Calculate sum of array
int calculateSum(dyn_int values)
{
  int sum = 0;

  for (int i = 1; i <= dynlen(values); i++)
  {
    sum = sum + values[i];
  }

  return sum;
}

// Calculate average
float calculateAverage(dyn_int values)
{
  if (dynlen(values) == 0)
    return 0.0;

  int sum = calculateSum(values);
  return (float)sum / (float)dynlen(values);
}

// Format number with leading zeros
string formatNumber(int number, int digits)
{
  string result = (string)number;

  while (strlen(result) < digits)
  {
    result = "0" + result;
  }

  return result;
}
