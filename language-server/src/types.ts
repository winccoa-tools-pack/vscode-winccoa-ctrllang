// Token Types
export enum TokenType {
    // Keywords
    KEYWORD = 'KEYWORD',
    
    // Identifiers and literals
    IDENTIFIER = 'IDENTIFIER',
    NUMBER = 'NUMBER',
    STRING = 'STRING',
    
    // Operators
    ASSIGN = 'ASSIGN',           // =
    PLUS = 'PLUS',               // +
    MINUS = 'MINUS',             // -
    MULTIPLY = 'MULTIPLY',       // *
    DIVIDE = 'DIVIDE',           // /
    EQUALS = 'EQUALS',           // ==
    NOT_EQUALS = 'NOT_EQUALS',   // !=
    LESS_THAN = 'LESS_THAN',     // <
    GREATER_THAN = 'GREATER_THAN', // >
    AND = 'AND',                 // &&
    OR = 'OR',                   // ||
    NOT = 'NOT',                 // !
    BIT_AND = 'BIT_AND',         // &
    BIT_OR = 'BIT_OR',           // |
    BIT_XOR = 'BIT_XOR',         // ^
    LEFT_SHIFT = 'LEFT_SHIFT',   // <<
    RIGHT_SHIFT = 'RIGHT_SHIFT', // >>
    
    // Delimiters
    SEMICOLON = 'SEMICOLON',     // ;
    COMMA = 'COMMA',             // ,
    DOT = 'DOT',                 // .
    COLON = 'COLON',             // :
    QUESTION = 'QUESTION',       // ?
    LPAREN = 'LPAREN',           // (
    RPAREN = 'RPAREN',           // )
    LBRACE = 'LBRACE',           // {
    RBRACE = 'RBRACE',           // }
    LBRACKET = 'LBRACKET',       // [
    RBRACKET = 'RBRACKET',       // ]
    
    // Preprocessor
    DIRECTIVE = 'DIRECTIVE',     // #uses, #include, etc.
    
    // Special
    EOF = 'EOF',
    UNKNOWN = 'UNKNOWN'
}

export interface Token {
    type: TokenType;
    value: string;
    line: number;
    column: number;
}

// WinCC OA Keywords
export const KEYWORDS = new Set([
    // Control flow
    'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'default', 'break', 'continue', 'return',
    
    // Data types
    'int', 'uint', 'long', 'ulong', 'float', 'double', 'string', 'bool', 'char', 'time', 'blob',
    'anytype', 'void', 'mixed', 'mapping', 'shape', 'file',
    
    // Dynamic arrays
    'dyn_int', 'dyn_uint', 'dyn_long', 'dyn_ulong', 'dyn_float', 'dyn_double', 
    'dyn_string', 'dyn_bool', 'dyn_char', 'dyn_time', 'dyn_anytype', 'dyn_mixed',
    
    // Modifiers
    'const', 'static', 'global', 'public', 'private', 'synchronized',
    
    // Type definitions
    'struct', 'class', 'enum', 'typedef',
    
    // Other
    'main', 'function', 'new', 'delete', 'foreach', 'try', 'catch', 'finally', 'throw'
]);

export const DATA_TYPES = new Set([
    'int', 'uint', 'long', 'ulong', 'float', 'double', 'string', 'bool', 'char', 'time', 'blob',
    'anytype', 'void', 'mixed', 'mapping', 'shape', 'file',
    'dyn_int', 'dyn_uint', 'dyn_long', 'dyn_ulong', 'dyn_float', 'dyn_double', 
    'dyn_string', 'dyn_bool', 'dyn_char', 'dyn_time', 'dyn_anytype', 'dyn_mixed'
]);

// WinCC OA Constants
export const CONSTANTS = new Set([
    // Boolean and NULL
    'TRUE', 'FALSE', 'NULL',
    'true', 'false',
    
    // Platform
    '_UNIX', '_WIN32',
    
    // Paths
    'PROJ_PATH', 'PVSS_PATH', 'WINCCOA_PATH', 'PVSS_BIN_PATH', 'DATA_PATH',
    'PROJ', '__FILE__', '__FUNCTION__', '__LINE__',
    
    // Standard streams
    'stdin', 'stdout', 'stderr',
    
    // Version
    'VERSION', 'VERSION_DISP', 'VERSION_NUMERIC',
    
    // Border styles
    'BS_NONE', 'BS_3D', 'BS_SUNKEN', 'BS_RAISED', 'BS_STYLED',
    
    // Path constants (getPath)
    'BIN_REL_PATH', 'SCRIPTS_REL_PATH', 'PANELS_REL_PATH', 'LIB_REL_PATH',
    'ICONS_REL_PATH', 'DB_REL_PATH', 'PARA_REL_PATH', 'DP_REL_PATH',
    'ALERT_REL_PATH', 'DPFUNCTIONS_REL_PATH', 'PROJECT_PATH',
    'ETC_REL_PATH', 'DATA_REL_PATH', 'LOG_REL_PATH', 'TMP_REL_PATH',
    'SEARCH_PATH_LEN',
    
    // Datapoint element types (DPEL_*)
    'DPEL_INT', 'DPEL_STRING', 'DPEL_TIME', 'DPEL_BOOL', 'DPEL_FLOAT',
    'DPEL_BLOB', 'DPEL_LONG', 'DPEL_ULONG', 'DPEL_DYN_INT', 'DPEL_DYN_STRING',
    'DPEL_DYN_FLOAT', 'DPEL_DYN_BOOL', 'DPEL_DYN_TIME', 'DPEL_DYN_BLOB',
    'DPEL_STRUCT', 'DPEL_DYN_STRUCT',
    
    // Variable types
    'INT_VAR', 'STRING_VAR', 'TIME_VAR', 'ANYTYPE_VAR', 'MAPPING_VAR',
    'ERRCLASS_VAR', 'DYN_INT_VAR', 'DYN_STRING_VAR', 'DYN_TIME_VAR',
    'DYN_FLOAT_VAR', 'DYN_BOOL_VAR', 'DYN_BLOB_VAR', 'DYN_STRUCT_VAR',
    
    // Numeric limits
    'MAX_INT', 'MIN_INT', 'MAX_UINT', 'MAX_LONG', 'MIN_LONG',
    'MAX_ULONG', 'MAX_FLOAT', 'MIN_FLOAT',
    
    // Config types
    'DPCONFIG_DB_ARCHIVEINFO', 'DPCONFIG_DEFAULTVALUE', 'DPCONFIG_DP_FUNCTION',
    'DPCONFIG_STAT_FUNCTION', 'DPCONFIG_DISTRIBUTION_INFO', 'DPCONFIG_SMOOTHING',
    'DPCONFIG_SMOOTH_TYPE',
    
    // Alert attributes
    'DPATTR_ALERTEVENT_CAME', 'DPATTR_ALERTEVENT_WENT',
    'DPATTR_ALERTEVENT_MULTIPLE_ACK', 'DPATTR_ALERTEVENT_UNACK',
    
    // Language enum prefix
    'OaLanguage'
]);

// Language constants with dot notation (OaLanguage.German, etc.)
export const LANGUAGE_CONSTANTS = new Set([
    'OaLanguage.German', 'OaLanguage.English', 'OaLanguage.French',
    'OaLanguage.Italian', 'OaLanguage.Spanish', 'OaLanguage.Portuguese',
    'OaLanguage.Czech', 'OaLanguage.Slovak', 'OaLanguage.Hungarian',
    'OaLanguage.Polish', 'OaLanguage.Russian', 'OaLanguage.Chinese',
    'OaLanguage.Japanese', 'OaLanguage.Korean'
]);

// AST Node Types
export interface ASTNode {
    type: string;
    line: number;
    column: number;
}

export interface VariableDeclaration extends ASTNode {
    type: 'VariableDeclaration';
    varType: string;
    name: string;
    value?: Expression;
}

export interface Expression extends ASTNode {
    type: 'Expression' | 'NumberLiteral' | 'StringLiteral' | 'Identifier' | 'BinaryExpression' | 'FunctionCall';
}

export interface NumberLiteral extends Expression {
    type: 'NumberLiteral';
    value: number;
}

export interface StringLiteral extends Expression {
    type: 'StringLiteral';
    value: string;
}

export interface Identifier extends Expression {
    type: 'Identifier';
    name: string;
}

export interface BinaryExpression extends Expression {
    type: 'BinaryExpression';
    operator: string;
    left: Expression;
    right: Expression;
}

export interface FunctionCall extends Expression {
    type: 'FunctionCall';
    name: string;
    arguments: Expression[];
}

export interface UsesDirective extends ASTNode {
    type: 'UsesDirective';
    library: string;
}

export interface Program extends ASTNode {
    type: 'Program';
    body: ASTNode[];
}
