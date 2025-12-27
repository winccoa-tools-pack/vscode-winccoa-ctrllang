/**
 * Test Fixture: Hover Information
 *
 * Testet:
 * - Type information on hover
 * - Function signatures
 * - Variable types
 * - Struct field types
 */

// Variables mit verschiedenen Typen
// TEST: Hover auf 'intVariable' -> sollte Typ 'int' anzeigen
int intVariable = 42;

// TEST: Hover auf 'floatVariable' -> sollte Typ 'float' anzeigen
float floatVariable = 3.14;

// TEST: Hover auf 'stringVariable' -> sollte Typ 'string' anzeigen
string stringVariable = "test";

// TEST: Hover auf 'boolVariable' -> sollte Typ 'bool' anzeigen
bool boolVariable = true;

// TEST: Hover auf 'timeVariable' -> sollte Typ 'time' anzeigen
time timeVariable;

// TEST: Hover auf 'dynIntVariable' -> sollte Typ 'dyn_int' anzeigen
dyn_int dynIntVariable;

// TEST: Hover auf 'dynStringVariable' -> sollte Typ 'dyn_string' anzeigen
dyn_string dynStringVariable;

// Struct für Type-Tests
struct TestStruct
{
  // TEST: Hover auf 'id' -> sollte Typ 'int' anzeigen
  int id;

  // TEST: Hover auf 'name' -> sollte Typ 'string' anzeigen
  string name;

  // TEST: Hover auf 'value' -> sollte Typ 'float' anzeigen
  float value;

  // TEST: Hover auf 'active' -> sollte Typ 'bool' anzeigen
  bool active;
};

// Function für Signature-Tests
int add(int a, int b)
{
  return a + b;
}

float multiply(float x, float y)
{
  return x * y;
}

string concatenate(string s1, string s2)
{
  return s1 + s2;
}

bool compare(int value, int threshold)
{
  return value > threshold;
}

// Class mit verschiedenen Member-Typen
class Calculator
{
  private int m_result;
  private string m_lastOperation;

  public Calculator()
  {
    m_result = 0;
    m_lastOperation = "";
  }

  public int getResult()
  {
    return m_result;
  }

  public void setResult(int value)
  {
    m_result = value;
  }
};

void main()
{
  // Hover über Variable sollte "int intVariable" zeigen
  int localInt = intVariable;

  // Hover über Struct-Instanz
  TestStruct myStruct;
  myStruct.id = 1; //TODO COPILOT: Ich kann nicht über id hovern sehe keinen typ
  // Hover über Function Call //
  int sum = add(5, 10);

  // Hover über Class-Instanz
  Calculator calc = new Calculator();
  int result = calc.getResult();
}