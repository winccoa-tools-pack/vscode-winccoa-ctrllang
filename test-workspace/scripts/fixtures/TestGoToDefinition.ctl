/**
 * Test Fixture: Go-to-Definition Features
 *
 * Dieses File testet:
 * - Local Variables
 * - Function Parameters
 * - Global Functions
 * - Class Members
 * - Method Local Variables
 * - Struct Fields
 * - Cross-File Resolution via #uses
 */

// ====================================================================================
// DEPENDENCIES
// ====================================================================================
#uses "DerivedClass"
#uses "DataStructures"

// ====================================================================================
// GLOBAL VARIABLES
// ====================================================================================
global int g_counter = 0;
global string g_deviceName = "TestDevice";

// ====================================================================================
// STRUCTS
// ====================================================================================
struct DeviceConfig
{
  string name;
  int type;
  bool enabled;
};

struct Point
{
  float x;
  float y;
};

// ====================================================================================
// GLOBAL FUNCTIONS
// ====================================================================================

/**
 * Test: Function with parameters and local variables
 */
int calculateSum(int a, int b)
{
  // TEST: Go-to-Def auf 'a' -> sollte zum Parameter in Zeile 41 springen
  // TEST: Go-to-Def auf 'b' -> sollte zum Parameter in Zeile 41 springen
  int result = a + b;

  // TEST: Go-to-Def auf 'result' -> sollte zur Deklaration in Zeile 44 springen
  // TEST: Hover auf 'doubled' -> sollte Typ 'int' anzeigen
  int doubled = result * 2;

  // TEST: Go-to-Def auf 'doubled' -> sollte zur Deklaration in Zeile 47 springen
  return doubled;
}

/**
 * Test: Function with struct parameter
 */
bool checkDevice(DeviceConfig config)
{
  string deviceName = config.name;
  int deviceType = config.type;

  if (deviceName == "")
  {
    return false;
  }

  return config.enabled;
}

/**
 * Test: Function with multiple return points
 */
string formatValue(float value, int precision)
{
  string formatted;

  if (precision < 0)
  {
    precision = 0;
  }

  formatted = sprintf("%." + precision + "f", value);
  return formatted;
}

// ====================================================================================
// CLASSES
// ====================================================================================

class DeviceManager
{
  // Member Variables
  private string m_projectName;
  private int m_deviceCount;
  private DeviceConfig m_config;

  /**
   * Constructor
   */
  public DeviceManager(string projectName)
  {
    m_projectName = projectName;
    m_deviceCount = 0;

    // Test: Constructor local variables
    string initMessage = "Initializing " + projectName;
    DebugN(initMessage);
  }

  /**
   * Method with parameters and local variables
   */
  public int createDevice(string deviceName, int deviceType)
  {
    // Test: Method parameters accessible
    string fullName = m_projectName + "." + deviceName;

    // Test: Method local variables
    int newId = m_deviceCount + 1;
    bool success = false;

    // Test: Access to member variables
    m_deviceCount = newId;

    // Test: Call to global function
    int checksum = calculateSum(newId, deviceType);

    return newId;
  }

  /**
   * Method accessing struct fields
   */
  public bool validateConfig(DeviceConfig config)
  {
    // Test: Struct field access
    string name = config.name;
    int type = config.type;
    bool enabled = config.enabled;

    // Test: Local variable in method
    bool isValid = (name != "" && type > 0);

    return isValid && enabled;
  }

  /**
   * Method with complex logic
   */
  private dyn_string getDeviceList()
  {
    dyn_string devices;

    // Test: Local array access
    for (int i = 0; i < m_deviceCount; i++)
    {
      string deviceId = sprintf("Device_%03d", i);
      dynAppend(devices, deviceId);
    }

    return devices;
  }
};

// ====================================================================================
// MAIN (for testing)
// ====================================================================================

main()
{
  // Test: Local variables in main
  int testValue = 42;
  string testName = "TestDevice";

  // Test: Global variable access
  g_counter = 10;

  // Test: Struct instantiation and field access
  DeviceConfig config;
  config.name = "MyDevice";
  config.type = 1;
  config.enabled = true;

  // Test: Function call with parameters
  int sum = calculateSum(5, 10);
  bool deviceOk = checkDevice(config);

  // Test: Class instantiation
  DeviceManager manager = new DeviceManager("TestProject");

  // Test: Method call
  int deviceId = manager.createDevice(testName, 1); //TODO COPILOT: Ich kann jetzt auf validateConfig klicken um auf die Definition der Methode zu springen ABER ich sehe nicht die methoden signatur beim hover
  bool configValid = manager.validateConfig(config); //TODO COPILOT: Ich kann jetzt auf validateConfig klicken um auf die Definition der Methode zu springen ABER ich sehe nicht die methoden signatur beim hover

  // Test: Point struct
  Point p;
  p.x = 10.5;
  p.y = 20.3;

  float distance = sqrt(p.x * p.x + p.y * p.y);

  // Test: Cross-file resolution - DerivedClass from DerivedClass.ctl
  DerivedClass derived = new DerivedClass(100, 200, "External");

  // Test: Cross-file resolution - Rectangle from DataStructures.ctl
  Rectangle rect;
  rect.topLeft.x = 0;
  rect.topLeft.y = 0;
  rect.bottomRight.x = 100;
  rect.bottomRight.y = 50;

  // Test: Cross-file resolution - Circle from DataStructures.ctl
  Circle circle;
  circle.center.x = 50;
  circle.center.y = 50;
  circle.radius = 25;
  DebugN(circle);
}