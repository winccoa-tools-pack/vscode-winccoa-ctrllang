// ============================================================================
// DerivedClass.ctl - Derived class for inheritance testing
// ============================================================================
//
// MANUAL TEST INSTRUCTIONS:
// 1. Open this file in VS Code
// 2. Test #uses Go-to-Definition:
//    - Click on "BaseClass" in line 16 (#uses) → should open BaseClass.ctl
// 3. Test Class Inheritance Go-to-Definition:
//    - Click on "BaseClass" in line 18 (: public BaseClass) → should jump to BaseClass.ctl
//    - Click on "DerivedClass" in line 18 → should jump to line 18 (class definition)
// 4. Test Member Access:
//    - Click on "m_derivedValue" in line 35 → should jump to line 20 (member declaration)
//    - Click on "getBaseValue" in line 38 → should jump to BaseClass.ctl (inherited method)
// 5. Test Find All References:
//    - Right-click on "m_derivedValue" → Find All References
//    - Should show: declaration + all usages in this file
// ============================================================================

#uses "BaseClass"

class DerivedClass : public BaseClass
{
  private int m_derivedValue;
  private string m_name;

  public DerivedClass(int baseValue, int derivedValue, string name)
  {
    // Call base constructor
    this.setBaseValue(baseValue);
    m_derivedValue = derivedValue;
    m_name = name;
  }

  public int getDerivedValue()
  {
    return m_derivedValue;
  }

  public int getTotalValue()
  {
    // Access inherited method
    int baseVal = this.getBaseValue();
    return baseVal + m_derivedValue;
  }

  public void printInfo()
  {
    DebugN("DerivedClass - Name: " + m_name);
    DebugN("  Base Value: " + this.getBaseValue());
    DebugN("  Derived Value: " + m_derivedValue);
    DebugN("  Total: " + this.getTotalValue());
  }
};
