/**
 * Test Library
 *
 * Wird von TestCrossFile.ctl verwendet
 */

// Library Struct
struct LibraryStruct
{
  // TEST: Go-to-Def aus TestCrossFile.ctl auf 'data.value' sollte hier her springen
  // TEST: Hover sollte Typ 'int' anzeigen
  int value;

  // TEST: Go-to-Def aus TestCrossFile.ctl auf 'data.label' sollte hier her springen
  // TEST: Hover sollte Typ 'string' anzeigen
  string label;
};

// Library Function
int libraryFunction(int x, int y)
{
  int sum = x + y;
  return sum;
}

// Library Class
class LibraryHelper
{
  private string m_message;

  public LibraryHelper()
  {
    m_message = "Library initialized";
  }

  public string getMessage()
  {
    return m_message;
  }

  public void setMessage(string msg)
  {
    m_message = msg;
  }
};
