// Library file for string utilities
// Used by test-uses.ctl to test #uses resolution

/**
 * Convert string to uppercase
 * @param text Input string
 * @return Uppercase string
 */
string toUpperCase(string text)
{
  return strtoupper(text);
}

/**
 * Convert string to lowercase
 * @param text Input string
 * @return Lowercase string
 */
string toLowerCase(string text)
{
  return strtolower(text);
}

/**
 * Check if string is empty
 * @param text String to check
 * @return True if empty
 */
bool isEmptyString(string text)
{
  return strlen(text) == 0;
}

/**
 * Trim whitespace from string
 * @param text String to trim
 * @return Trimmed string
 */
string trim(string text)
{
  // Simple trim implementation
  string result = text;
  strrtrim(result);
  strltrim(result);
  return result;
}

/**
 * Split string by delimiter
 * @param text String to split
 * @param delimiter Delimiter character
 * @return Array of substrings
 */
dyn_string split(string text, string delimiter)
{
  dyn_string result;
  int pos = 0;
  int nextPos;
  
  while ((nextPos = strpos(text, delimiter, pos)) >= 0)
  {
    dynAppend(result, substr(text, pos, nextPos - pos));
    pos = nextPos + strlen(delimiter);
  }
  
  // Add remaining text
  if (pos < strlen(text))
  {
    dynAppend(result, substr(text, pos));
  }
  
  return result;
}
