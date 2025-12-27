// Scope resolution test - same variable names in different scopes

global string g_config;  // Global variable

class TestClass
{
  private int m_value;  // Class member

  public void testMethod()
  {
    int value;  // Local variable (different name, for shadowing test)
    value = 10;
    m_value = value;
  }
};

class MyClass
{
  int myValue;  // Line 18: Class member

  void test()
  {
    int myValue;  // Line 22: Local variable (shadows class member)
    myValue = 10;
  }
};

global int myValue;  // Line 27: Global variable

void globalFunc()
{
  myValue = 20;  // References global variable
}
