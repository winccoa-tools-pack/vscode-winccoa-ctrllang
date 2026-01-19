// ============================================================================
// MathLibrary.ctl - Math utility functions for testing cross-file goto
// ============================================================================

// Add two integers
int add(int a, int b)
{
  return a + b;
}

// Subtract two integers
int subtract(int a, int b)
{
  return a - b;
}

// Multiply two integers
int multiply(int a, int b)
{
  return a * b;
}

// Calculate factorial recursively
int factorial(int n)
{
  if (n <= 1)
  {
    return 1;
  }

  return n * factorial(n - 1);
}

// Global counter for testing
global int g_mathCallCount;

// Initialize library
void initMathLibrary()
{
  g_mathCallCount = 0;
  DebugN("MathLibrary initialized");
}
