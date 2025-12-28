class MyClass
{
  public int m_value;
  public string m_name;

  public void doSomething()
  {
    int x = 5;
  }

  public int getValue()
  {
    return m_value;
  }
};

void main()
{
  MyClass obj;

  // Method call - should be yellow/gold like functions
  obj.doSomething();
  obj.getValue();

  // Member access - should be blue/cyan like variables
  obj.m_value = 10;
  obj.m_name = "test";

  int result = obj.m_value;
}
