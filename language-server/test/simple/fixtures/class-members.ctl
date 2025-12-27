// Class with private/public sections
class TestClass
{

  private int m_privateValue;
  private string m_privateName;


  public int publicValue;

  public void setValue(int v)
  {
    m_privateValue = v;
  }

  public int getValue()
  {
    return m_privateValue;
  }
};
