// Library file for math utilities
// Used by test-uses.ctl to test #uses resolution

/**
 * Get maximum of two numbers
 * @param a First number
 * @param b Second number
 * @return Maximum value
 */
int maxValue(int a, int b)
{
  return (a > b) ? a : b;
}

/**
 * Get minimum of two numbers
 * @param a First number
 * @param b Second number
 * @return Minimum value
 */
int minValue(int a, int b)
{
  return (a < b) ? a : b;
}

/**
 * Add two numbers
 * @param a First number
 * @param b Second number
 * @return Sum
 */
int addNumbers(int a, int b)
{
  return a + b;
}

/**
 * Calculate factorial
 * @param n Input number
 * @return Factorial of n
 */
int factorial(int n)
{
  if (n <= 1)
    return 1;
  return n * factorial(n - 1);
}

/**
 * Check if number is even
 * @param n Number to check
 * @return True if even
 */
bool isEven(int n)
{
  return (n % 2) == 0;
}

/**
 * Calculate power
 * @param base Base number
 * @param exponent Exponent
 * @return base^exponent
 */
float power(float base, int exponent)
{
  return pow(base, (float)exponent);
}
