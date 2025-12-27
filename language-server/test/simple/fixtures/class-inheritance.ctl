// Class inheritance test
class BaseClass
{
  public int baseValue;

  public void setBase(int v)
  {
    baseValue = v;
  }
};

class DerivedClass : BaseClass
{
  private int derivedValue;

  public void setDerived(int v)
  {
    derivedValue = v;
  }

  int getTotal()
  {
    return baseValue + derivedValue;
  }
};
