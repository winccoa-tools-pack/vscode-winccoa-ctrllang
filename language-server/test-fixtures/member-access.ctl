// Member access test
class Calculator
{
  private int m_value;
  private int result;

  public void add(int value)
  {
    result = result + value;
  }

  public void setValue(int value)
  {
    m_value = value;
  }

  public int getValue()
  {
    return m_value;
  }

  public int getResult()
  {
    return result;
  }
};

void main()
{
  Calculator calc;
  calc.add(5);
  calc.add(10);
  calc.setValue(42);
  int total = calc.getResult();
  int val = calc.getValue();
  DebugN("Total: " + total); // Expected output: Total: 15
  DebugN("Value: " + val);   // Expected output: Value: 42
}