// ============================================================================
// StringHelper.ctl - String utility functions (in subdirectory for testing)
// ============================================================================

// Uppercase string
string toUpperCase(string str)
{
  return strtoupper(str);
}

// Lowercase string
string toLowerCase(string str)
{
  return strtolower(str);
}

// Trim whitespace
string trim(string str)
{
  return strrtrim(strltrim(str));
}

// Check if string starts with prefix
bool startsWith(string str, string prefix)
{
  if (strlen(prefix) > strlen(str))
  {
    return false;
  }

  return substr(str, 0, strlen(prefix)) == prefix;
}

// Global counter for string operations
global int g_stringOpCount;
