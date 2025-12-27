// ============================================================================
// BaseClass.ctl - Base class for inheritance testing
// ============================================================================
//
// MANUAL TEST INSTRUCTIONS:
// 1. Open this file in VS Code
// 2. Test Go-to-Definition:
//    - Click on "BaseClass" in line 19 → should jump to line 17 (class definition)
//    - Click on "m_baseValue" in line 29 → should jump to line 19 (member declaration)
// 3. Test Find All References:
//    - Right-click on "BaseClass" → Find All References
//    - Should show: definition (line 17) + usage in DerivedClass.ctl
//    - Right-click on "getBaseValue" → Find All References
//    - Should show: definition (line 23) + all calls
// ============================================================================

class BaseClass
{
  private int m_baseValue;

  public BaseClass(int value)
  {
    m_baseValue = value;
  }

  public int getBaseValue()
  {
    return m_baseValue;
  }

  public void setBaseValue(int value)
  {
    m_baseValue = value;
  }

  public void printInfo()
  {
    DebugN("BaseClass - Value: " + m_baseValue);
  }
};
