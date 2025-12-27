/**
 * Symbol Table for WinCC OA CTRL Language
 * 
 * Provides scope-aware symbol resolution for classes, structs, functions, and variables.
 * Uses token-based parsing with simple scope tracking - not a full AST.
 */

import { Tokenizer } from './tokenizer';
import { Token, TokenType } from './types';

// ============================================================================
// Symbol Types
// ============================================================================

export enum SymbolKind {
    Class = 'class',
    Struct = 'struct',
    Function = 'function',
    Method = 'method',
    Variable = 'variable',
    GlobalVariable = 'global',
    MemberVariable = 'member',
    LocalVariable = 'local',
}

export enum AccessModifier {
    Public = 'public',
    Private = 'private',
    Protected = 'protected',
}

export interface SymbolLocation {
    line: number;
    column: number;
}

export interface BaseSymbol {
    kind: SymbolKind;
    name: string;
    location: SymbolLocation;
}

export interface ClassSymbol extends BaseSymbol {
    kind: SymbolKind.Class;
    members: MemberSymbol[];
    methods: MethodSymbol[];
    baseClass?: string;  // For inheritance
}

export interface StructSymbol extends BaseSymbol {
    kind: SymbolKind.Struct;
    fields: MemberSymbol[];
}

export interface FunctionSymbol extends BaseSymbol {
    kind: SymbolKind.Function;
    returnType: string;
    parameters: ParameterSymbol[];
    localVariables?: VariableSymbol[];  // Local variables inside function
    bodyStartLine?: number;  // Line where function body starts (after {)
    bodyEndLine?: number;    // Line where function body ends (before })
}

export interface MethodSymbol extends BaseSymbol {
    kind: SymbolKind.Method;
    returnType: string;
    parameters: ParameterSymbol[];
    accessModifier: AccessModifier;
    localVariables?: VariableSymbol[];
    bodyStartLine?: number;
    bodyEndLine?: number;
}

export interface MemberSymbol extends BaseSymbol {
    kind: SymbolKind.MemberVariable;
    dataType: string;
    accessModifier: AccessModifier;
}

export interface VariableSymbol extends BaseSymbol {
    kind: SymbolKind.Variable | SymbolKind.GlobalVariable | SymbolKind.LocalVariable;
    dataType: string;
}

export interface ParameterSymbol {
    name: string;
    dataType: string;
    byRef: boolean;
}

export interface FileSymbols {
    classes: ClassSymbol[];
    structs: StructSymbol[];
    functions: FunctionSymbol[];
    globals: VariableSymbol[];
}

// ============================================================================
// Reference Interface
// ============================================================================

export interface SymbolReference {
    name: string;
    location: SymbolLocation;
    isDefinition: boolean;  // true if this is the symbol declaration
    kind?: SymbolKind;       // Optional: type of symbol being referenced
}

// ============================================================================
// Position Interface for Symbol Resolution
// ============================================================================

export interface Position {
    line: number;
    character: number;
}

// ============================================================================
// Symbol Table Class
// ============================================================================

export class SymbolTable {
    /**
     * Parse a file and extract all symbols
     */
    public static parseFile(content: string): FileSymbols {
        const tokenizer = new Tokenizer(content);
        const tokens = tokenizer.tokenize();
        
        return {
            classes: this.findClassDefinitions(content, tokens),
            structs: this.findStructDefinitions(content, tokens),
            functions: this.findFunctionDefinitions(content, tokens),
            globals: this.findGlobalVariables(content, tokens),
        };
    }

    /**
     * Resolve a symbol name at a given position
     * 
     * Scope chain: Local scope → Class/Function scope → File scope
     * 
     * @param name Symbol name to resolve
     * @param position Cursor position in the file
     * @param symbols Parsed file symbols
     * @returns Resolved symbol or null
     */
    public static resolveSymbol(
        name: string, 
        position: Position, 
        symbols: FileSymbols
    ): BaseSymbol | MemberSymbol | MethodSymbol | VariableSymbol | null {
        
        // 1. Check type definitions first (highest priority)
        // Class definitions
        const classSymbol = symbols.classes.find(c => c.name === name);
        if (classSymbol) return classSymbol;
        
        // Struct definitions
        const structSymbol = symbols.structs.find(s => s.name === name);
        if (structSymbol) return structSymbol;
        
        // Struct fields (check all structs for fields matching the name)
        for (const struct of symbols.structs) {
            const field = struct.fields.find(f => f.name === name);
            if (field) return field;
        }
        
        // 2. Check if we're inside a class (class scope)
        const containingClass = this.findContainingClass(position, symbols.classes);
        if (containingClass) {
            // Check if we're inside a method (for local variables in methods)
            const containingMethod = this.findContainingMethod(position, containingClass.methods);
            if (containingMethod && containingMethod.localVariables) {
                const localVar = containingMethod.localVariables.find(v => v.name === name);
                if (localVar) return localVar;
            }
            
            // Check class members
            const member = containingClass.members.find(m => m.name === name);
            if (member) return member;
            
            // Check class methods (but skip if it's a constructor with same name as class)
            const method = containingClass.methods.find(m => m.name === name && m.name !== containingClass.name);
            if (method) return method;
        }
        
        // 2.5. Check if we're inside a function (for local variables)
        const containingFunction = this.findContainingFunction(position, symbols.functions);
        if (containingFunction && containingFunction.localVariables) {
            const localVar = containingFunction.localVariables.find(v => v.name === name);
            if (localVar) return localVar;
        }
        
        // 3. Check file scope
        
        // Check global variables
        const globalVar = symbols.globals.find(g => g.name === name);
        if (globalVar) return globalVar;
        
        // Check global functions
        const func = symbols.functions.find(f => f.name === name);
        if (func) return func;
        
        // 4. Not found
        return null;
    }

    /**
     * Find all references to a symbol in the given content
     * 
     * @param name Symbol name to find references for
     * @param content File content to search in
     * @param symbols Parsed symbols from the file
     * @returns Array of all references (including definition)
     */
    public static findReferences(
        name: string,
        content: string,
        symbols: FileSymbols
    ): SymbolReference[] {
        const references: SymbolReference[] = [];
        
        // 1. Add definitions from Symbol Table
        
        // Check classes
        for (const cls of symbols.classes) {
            if (cls.name === name) {
                references.push({
                    name: cls.name,
                    location: cls.location,
                    isDefinition: true,
                    kind: cls.kind
                });
            }
            
            // Check class members
            for (const member of cls.members) {
                if (member.name === name) {
                    references.push({
                        name: member.name,
                        location: member.location,
                        isDefinition: true,
                        kind: member.kind
                    });
                }
            }
            
            // Check class methods
            for (const method of cls.methods) {
                if (method.name === name) {
                    references.push({
                        name: method.name,
                        location: method.location,
                        isDefinition: true,
                        kind: method.kind
                    });
                }
            }
        }
        
        // Check structs
        for (const struct of symbols.structs) {
            if (struct.name === name) {
                references.push({
                    name: struct.name,
                    location: struct.location,
                    isDefinition: true,
                    kind: struct.kind
                });
            }
            
            // Check struct fields
            for (const field of struct.fields) {
                if (field.name === name) {
                    references.push({
                        name: field.name,
                        location: field.location,
                        isDefinition: true,
                        kind: field.kind
                    });
                }
            }
        }
        
        // Check global functions
        for (const func of symbols.functions) {
            if (func.name === name) {
                references.push({
                    name: func.name,
                    location: func.location,
                    isDefinition: true,
                    kind: func.kind
                });
            }
        }
        
        // Check global variables
        for (const globalVar of symbols.globals) {
            if (globalVar.name === name) {
                references.push({
                    name: globalVar.name,
                    location: globalVar.location,
                    isDefinition: true,
                    kind: globalVar.kind
                });
            }
        }
        
        // 2. Find all usages in the content (tokenize and search)
        const tokenizer = new Tokenizer(content);
        const tokens = tokenizer.tokenize();
        
        for (const token of tokens) {
            if (token.type === TokenType.IDENTIFIER && token.value === name) {
                // Check if this is already in references (avoid duplicate definitions)
                const isDuplicate = references.some(
                    ref => ref.location.line === token.line && 
                           ref.location.column === token.column
                );
                
                if (!isDuplicate) {
                    references.push({
                        name: token.value,
                        location: {
                            line: token.line,
                            column: token.column
                        },
                        isDefinition: false
                    });
                }
            }
        }
        
        return references;
    }

    /**
     * Find the class containing a given position
     */
    private static findContainingClass(position: Position, classes: ClassSymbol[]): ClassSymbol | null {
        // For now, use simple line-based containment
        // TODO: Improve with brace-level tracking
        for (const cls of classes) {
            // Assume class definition is at cls.location.line
            // and extends for some lines (heuristic: check if position is close)
            // This is simplified - real implementation needs brace tracking
            if (position.line >= cls.location.line && position.line <= cls.location.line + 100) {
                return cls;
            }
        }
        return null;
    }

    /**
     * Find the method containing the given position
     */
    private static findContainingMethod(position: Position, methods: MethodSymbol[]): MethodSymbol | null {
        for (const method of methods) {
            // Check if position is within method body
            if (method.bodyStartLine !== undefined && method.bodyEndLine !== undefined) {
                if (position.line >= method.bodyStartLine && position.line <= method.bodyEndLine) {
                    return method;
                }
            }
        }
        return null;
    }

    /**
     * Find the function containing the given position
     */
    private static findContainingFunction(position: Position, functions: FunctionSymbol[]): FunctionSymbol | null {
        for (const func of functions) {
            // Check if position is within function body
            if (func.bodyStartLine && func.bodyEndLine) {
                if (position.line >= func.bodyStartLine && position.line <= func.bodyEndLine) {
                    return func;
                }
            }
        }
        return null;
    }

    /**
     * Find all class definitions in the token stream
     */
    public static findClassDefinitions(content: string, tokens: Token[]): ClassSymbol[] {
        const classes: ClassSymbol[] = [];
        
        // Pattern: class ClassName [: BaseClass] {
        for (let i = 0; i < tokens.length - 2; i++) {
            const current = tokens[i];
            const next = tokens[i + 1];
            
            if (current.type === TokenType.KEYWORD && 
                current.value === 'class' &&
                next.type === TokenType.IDENTIFIER) {
                
                const className = next.value;
                const location: SymbolLocation = {
                    line: next.line,
                    column: next.column
                };
                
                // Check for inheritance (: BaseClass)
                let baseClass: string | undefined;
                if (i + 2 < tokens.length && tokens[i + 2].type === TokenType.COLON) {
                    // Can be either ": BaseClass" or ": public BaseClass"
                    let baseIdx = i + 3;
                    
                    // Skip optional 'public', 'private', 'protected'
                    if (tokens[baseIdx]?.type === TokenType.KEYWORD &&
                        (tokens[baseIdx].value === 'public' || 
                         tokens[baseIdx].value === 'private' ||
                         tokens[baseIdx].value === 'protected')) {
                        baseIdx++;
                    }
                    
                    if (tokens[baseIdx]?.type === TokenType.IDENTIFIER) {
                        baseClass = tokens[baseIdx].value;
                    }
                }
                
                // Find class body
                const classBody = this.extractClassBody(content, tokens, i);
                const members = this.findClassMembers(classBody.content, classBody.startLine);
                const methods = this.findClassMethods(classBody.content, classBody.startLine, className);
                
                classes.push({
                    kind: SymbolKind.Class,
                    name: className,
                    location,
                    members,
                    methods,
                    baseClass
                });
            }
        }
        
        return classes;
    }

    /**
     * Find all struct definitions in the token stream
     */
    public static findStructDefinitions(content: string, tokens: Token[]): StructSymbol[] {
        const structs: StructSymbol[] = [];
        
        // Pattern: struct StructName {
        for (let i = 0; i < tokens.length - 2; i++) {
            const current = tokens[i];
            const next = tokens[i + 1];
            
            if (current.type === TokenType.KEYWORD && 
                current.value === 'struct' &&
                next.type === TokenType.IDENTIFIER) {
                
                const structName = next.value;
                const location: SymbolLocation = {
                    line: next.line,
                    column: next.column
                };
                
                // Find struct body
                const structBody = this.extractClassBody(content, tokens, i);
                const fields = this.findStructFields(structBody.content, structBody.startLine);
                
                structs.push({
                    kind: SymbolKind.Struct,
                    name: structName,
                    location,
                    fields
                });
            }
        }
        
        return structs;
    }

    /**
     * Find all global function definitions
     */
    public static findFunctionDefinitions(content: string, tokens: Token[]): FunctionSymbol[] {
        const functions: FunctionSymbol[] = [];
        
        // First, find all class/struct ranges to exclude
        const classRanges: Array<{start: number, end: number}> = [];
        
        for (let i = 0; i < tokens.length; i++) {
            const current = tokens[i];
            
            if (current.type === TokenType.KEYWORD && 
                (current.value === 'class' || current.value === 'struct')) {
                // Find opening brace
                let braceIndex = i;
                while (braceIndex < tokens.length && tokens[braceIndex].type !== TokenType.LBRACE) {
                    braceIndex++;
                }
                
                if (braceIndex < tokens.length) {
                    // Find matching closing brace
                    let braceCount = 1;
                    let endIndex = braceIndex + 1;
                    
                    while (endIndex < tokens.length && braceCount > 0) {
                        if (tokens[endIndex].type === TokenType.LBRACE) braceCount++;
                        if (tokens[endIndex].type === TokenType.RBRACE) braceCount--;
                        endIndex++;
                    }
                    
                    classRanges.push({ start: i, end: endIndex });
                }
            }
        }
        
        // Now find functions, skipping class/struct ranges and nested scopes
        let braceDepth = 0;  // Track nested braces to skip function bodies
        
        for (let i = 0; i < tokens.length - 2; i++) {
            // Check if this token is inside a class/struct
            const insideClass = classRanges.some(range => i >= range.start && i < range.end);
            if (insideClass) continue;
            
            const current = tokens[i];
            const next = tokens[i + 1];
            const afterNext = tokens[i + 2];
            
            // Track brace depth (only outside classes)
            if (current.type === TokenType.LBRACE) {
                braceDepth++;
                continue;
            }
            if (current.type === TokenType.RBRACE) {
                braceDepth--;
                continue;
            }
            
            // Only parse at top level (braceDepth === 0)
            if (braceDepth > 0) {
                continue;
            }
            
            // Pattern 1: type identifier ( - regular functions
            // Pattern 2: main ( - special main function without return type (main can be KEYWORD or IDENTIFIER)
            const isRegularFunction = (current.type === TokenType.KEYWORD || current.type === TokenType.IDENTIFIER) &&
                                      next.type === TokenType.IDENTIFIER &&
                                      afterNext.type === TokenType.LPAREN;
            
            const isMainFunction = (current.type === TokenType.IDENTIFIER || current.type === TokenType.KEYWORD) &&
                                   current.value === 'main' &&
                                   next.type === TokenType.LPAREN;
            
            if (isRegularFunction || isMainFunction) {
                const functionName = isMainFunction ? current.value : next.value;
                const returnType = isMainFunction ? 'void' : current.value;
                const nameToken = isMainFunction ? current : next;
                const startIndex = isMainFunction ? i : i;  // Both use i, but keep for clarity
                
                // Extract function parameters as VariableSymbol[]
                const paramVars = this.extractFunctionParameters(tokens, startIndex);
                
                // Convert to ParameterSymbol[]
                const parameters = paramVars.map(v => ({
                    name: v.name,
                    dataType: v.dataType,
                    byRef: false  // TODO: Detect & parameters
                }));
                
                // Find function body for local variable extraction
                const bodyInfo = this.extractFunctionBody(content, tokens, startIndex);
                const bodyLocalVars = bodyInfo ? this.findLocalVariables(bodyInfo.content, bodyInfo.startLine) : [];
                
                // Combine parameters and local variables (parameters have priority)
                const allLocalVars = [...paramVars, ...bodyLocalVars];
                
                functions.push({
                    kind: SymbolKind.Function,
                    name: functionName,
                    returnType: returnType,
                    location: {
                        line: nameToken.line,
                        column: nameToken.column
                    },
                    parameters: parameters,
                    localVariables: allLocalVars,
                    bodyStartLine: bodyInfo?.startLine,
                    bodyEndLine: bodyInfo?.endLine
                });
            }
        }
        
        return functions;
    }

    /**
     * Find all global variable declarations
     */
    public static findGlobalVariables(content: string, tokens: Token[]): VariableSymbol[] {
        const globals: VariableSymbol[] = [];
        
        // Pattern: global type identifier
        for (let i = 0; i < tokens.length - 2; i++) {
            const current = tokens[i];
            const next = tokens[i + 1];
            const afterNext = tokens[i + 2];
            
            if (current.type === TokenType.KEYWORD && 
                current.value === 'global' &&
                (next.type === TokenType.KEYWORD || next.type === TokenType.IDENTIFIER) &&
                afterNext.type === TokenType.IDENTIFIER) {
                
                globals.push({
                    kind: SymbolKind.GlobalVariable,
                    name: afterNext.value,
                    dataType: next.value,
                    location: {
                        line: afterNext.line,
                        column: afterNext.column
                    }
                });
            }
        }
        
        return globals;
    }

    // ========================================================================
    // Helper Methods
    // ========================================================================

    /**
     * Extract class/struct body content
     */
    private static extractClassBody(content: string, tokens: Token[], startIndex: number): { content: string; startLine: number } {
        // Find opening brace
        let braceIndex = startIndex;
        while (braceIndex < tokens.length && tokens[braceIndex].type !== TokenType.LBRACE) {
            braceIndex++;
        }
        
        if (braceIndex >= tokens.length) {
            return { content: '', startLine: 0 };
        }
        
        const openBrace = tokens[braceIndex];
        let braceCount = 1;
        let endIndex = braceIndex + 1;
        
        // Find matching closing brace
        while (endIndex < tokens.length && braceCount > 0) {
            if (tokens[endIndex].type === TokenType.LBRACE) braceCount++;
            if (tokens[endIndex].type === TokenType.RBRACE) braceCount--;
            endIndex++;
        }
        
        // Extract content between braces
        const lines = content.split('\n');
        const startLine = openBrace.line;
        const endLine = tokens[endIndex - 1]?.line || startLine;
        
        const bodyLines = lines.slice(startLine, endLine);
        
        return {
            content: bodyLines.join('\n'),
            startLine: startLine + 1
        };
    }

    /**
     * Extract function parameters (for local variable resolution)
     * Parses patterns like: void func(string deviceName, int count)
     */
    private static extractFunctionParameters(tokens: Token[], startIndex: number): VariableSymbol[] {
        const params: VariableSymbol[] = [];
        
        // Find opening parenthesis
        let parenIndex = startIndex;
        while (parenIndex < tokens.length && tokens[parenIndex].type !== TokenType.LPAREN) {
            parenIndex++;
        }
        
        if (parenIndex >= tokens.length) {
            return params;
        }
        
        // Find closing parenthesis
        let endParenIndex = parenIndex + 1;
        let parenDepth = 1;
        while (endParenIndex < tokens.length && parenDepth > 0) {
            if (tokens[endParenIndex].type === TokenType.LPAREN) parenDepth++;
            if (tokens[endParenIndex].type === TokenType.RPAREN) parenDepth--;
            endParenIndex++;
        }
        
        // Parse parameters between parentheses
        // Pattern: type name [, type name]*
        for (let i = parenIndex + 1; i < endParenIndex - 1; i++) {
            const current = tokens[i];
            const next = tokens[i + 1];
            
            // Type (keyword or identifier) followed by parameter name
            if ((current.type === TokenType.KEYWORD || current.type === TokenType.IDENTIFIER) &&
                next && next.type === TokenType.IDENTIFIER) {
                
                params.push({
                    kind: SymbolKind.LocalVariable,  // Treat parameters as local variables
                    name: next.value,
                    dataType: current.value,
                    location: {
                        line: next.line,
                        column: next.column
                    }
                });
                
                i++;  // Skip the name token
            }
        }
        
        return params;
    }

    /**
     * Extract function body content (for local variable parsing)
     */
    private static extractFunctionBody(content: string, tokens: Token[], startIndex: number): { content: string; startLine: number; endLine: number } | null {
        // Find opening brace after function signature
        let braceIndex = startIndex;
        while (braceIndex < tokens.length && tokens[braceIndex].type !== TokenType.LBRACE) {
            braceIndex++;
        }
        
        if (braceIndex >= tokens.length) {
            return null;
        }
        
        const openBrace = tokens[braceIndex];
        let braceCount = 1;
        let endIndex = braceIndex + 1;
        
        // Find matching closing brace
        while (endIndex < tokens.length && braceCount > 0) {
            if (tokens[endIndex].type === TokenType.LBRACE) braceCount++;
            if (tokens[endIndex].type === TokenType.RBRACE) braceCount--;
            endIndex++;
        }
        
        if (endIndex >= tokens.length) {
            return null;
        }
        
        // Extract content between braces
        const lines = content.split('\n');
        const startLine = openBrace.line;
        const endLine = tokens[endIndex - 1]?.line || startLine;
        
        const bodyLines = lines.slice(startLine, endLine);
        
        return {
            content: bodyLines.join('\n'),
            startLine: startLine,  // Keep 0-based for LSP compatibility
            endLine: endLine
        };
    }

    /**
     * Find local variables in function body
     * 
     * Parses patterns like:
     * - DeviceFactory factory = new DeviceFactory();
     * - string deviceName = "test";
     * - int counter;
     */
    private static findLocalVariables(functionBody: string, startLine: number): VariableSymbol[] {
        const locals: VariableSymbol[] = [];
        const tokenizer = new Tokenizer(functionBody);
        const tokens = tokenizer.tokenize();
        
        // Pattern: type identifier [= | ;]
        for (let i = 0; i < tokens.length - 2; i++) {
            const current = tokens[i];
            const next = tokens[i + 1];
            const afterNext = tokens[i + 2];
            
            // Type can be keyword (int, string, etc.) or identifier (DeviceFactory, etc.)
            if ((current.type === TokenType.KEYWORD || current.type === TokenType.IDENTIFIER) &&
                next.type === TokenType.IDENTIFIER &&
                (afterNext.type === TokenType.SEMICOLON || 
                 afterNext.value === '=' ||
                 afterNext.type === TokenType.LBRACKET)) {  // arrays: int arr[10]
                
                // Make sure it's not a function call or method declaration
                // Function calls have pattern: name(
                const following = tokens[i + 2];
                if (following?.type === TokenType.LPAREN) {
                    continue;  // It's a function call or declaration
                }
                
                locals.push({
                    kind: SymbolKind.LocalVariable,
                    name: next.value,
                    dataType: current.value,
                    location: {
                        line: startLine + next.line - 1,
                        column: next.column
                    }
                });
            }
        }
        
        return locals;
    }

    /**
     * Find member variables in class body
     */
    private static findClassMembers(classBody: string, startLine: number): MemberSymbol[] {
        const members: MemberSymbol[] = [];
        const tokenizer = new Tokenizer(classBody);
        const tokens = tokenizer.tokenize();
        
        let currentAccess: AccessModifier = AccessModifier.Public;  // Default in CTRL
        
        for (let i = 0; i < tokens.length; i++) {
            const current = tokens[i];
            
            // Track access modifiers (private:, public:, protected:) - section-based
            if (current.type === TokenType.KEYWORD) {
                if (current.value === 'private' || current.value === 'public' || current.value === 'protected') {
                    const next = tokens[i + 1];
                    if (next?.type === TokenType.COLON) {
                        currentAccess = current.value as AccessModifier;
                        i++;  // Skip the colon
                        continue;
                    }
                }
            }
            
            // Check for inline access modifiers: "private int myVar;" or "public void myMethod()"
            let inlineAccess: AccessModifier | null = null;
            let typeTokenIndex = i;
            
            if (current.type === TokenType.KEYWORD && 
                (current.value === 'private' || current.value === 'public' || current.value === 'protected')) {
                // This might be inline modifier
                const next = tokens[i + 1];
                if (next && next.type !== TokenType.COLON && 
                    (next.type === TokenType.KEYWORD || next.type === TokenType.IDENTIFIER)) {
                    // It's inline: "private int myVar"
                    inlineAccess = current.value as AccessModifier;
                    typeTokenIndex = i + 1;
                }
            }
            
            // Pattern: [access] type identifier; (not followed by '(')
            const typeToken = tokens[typeTokenIndex];
            const nameToken = tokens[typeTokenIndex + 1];
            const afterName = tokens[typeTokenIndex + 2];
            
            if ((typeToken?.type === TokenType.KEYWORD || typeToken?.type === TokenType.IDENTIFIER) &&
                nameToken?.type === TokenType.IDENTIFIER &&
                afterName?.type === TokenType.SEMICOLON) {
                
                // Additional check: make sure this is a valid type keyword
                const isTypeKeyword = typeToken.type === TokenType.KEYWORD && 
                    (typeToken.value === 'int' || typeToken.value === 'string' || typeToken.value === 'float' ||
                     typeToken.value === 'double' || typeToken.value === 'bool' || typeToken.value === 'long' ||
                     typeToken.value === 'uint' || typeToken.value === 'ulong' || typeToken.value === 'char' ||
                     typeToken.value === 'time' || typeToken.value === 'blob' || typeToken.value === 'anytype' ||
                     typeToken.value === 'mixed' || typeToken.value === 'mapping' || typeToken.value === 'shape' ||
                     typeToken.value.startsWith('dyn_'));
                
                if (!isTypeKeyword) {
                    continue;
                }
                
                // Use inline access modifier if present, otherwise use section-based
                const accessModifier = inlineAccess !== null ? inlineAccess : currentAccess;
                
                members.push({
                    kind: SymbolKind.MemberVariable,
                    name: nameToken.value,
                    dataType: typeToken.value,
                    accessModifier: accessModifier,
                    location: {
                        line: startLine + nameToken.line - 1,
                        column: nameToken.column
                    }
                });
                
                // Skip ahead to avoid processing the same tokens again
                if (inlineAccess !== null) {
                    i = typeTokenIndex + 2;  // Skip to semicolon
                }
            }
        }
        
        return members;
    }

    /**
     * Find methods in class body
     */
    private static findClassMethods(classBody: string, startLine: number, className?: string): MethodSymbol[] {
        const methods: MethodSymbol[] = [];
        const tokenizer = new Tokenizer(classBody);
        const tokens = tokenizer.tokenize();
        
        let currentAccess: AccessModifier = AccessModifier.Public;
        let braceDepth = 0;  // Track nested braces to skip method bodies
        
        for (let i = 0; i < tokens.length - 2; i++) {
            const current = tokens[i];
            
            // Track brace depth to skip method bodies
            if (current.type === TokenType.LBRACE) {
                braceDepth++;
                continue;
            }
            if (current.type === TokenType.RBRACE) {
                braceDepth--;
                continue;
            }
            
            // Only parse at top level (braceDepth === 0)
            if (braceDepth > 0) {
                continue;
            }
            
            // Track access modifiers - section-based
            if (current.type === TokenType.KEYWORD) {
                if (current.value === 'private' || current.value === 'public' || current.value === 'protected') {
                    const next = tokens[i + 1];
                    if (next?.type === TokenType.COLON) {
                        currentAccess = current.value as AccessModifier;
                        i++;  // Skip the colon
                        continue;
                    }
                }
            }
            
            // Check for inline access modifiers: "public void myMethod()"
            let inlineAccess: AccessModifier | null = null;
            let returnTypeIndex = i;
            
            if (current.type === TokenType.KEYWORD && 
                (current.value === 'private' || current.value === 'public' || current.value === 'protected')) {
                const next = tokens[i + 1];
                if (next && next.type !== TokenType.COLON &&
                    (next.type === TokenType.KEYWORD || next.type === TokenType.IDENTIFIER)) {
                    // It's inline: "public void myMethod"
                    inlineAccess = current.value as AccessModifier;
                    returnTypeIndex = i + 1;
                }
            }
            
            // Check for constructor pattern: ClassName(
            if (className && current.type === TokenType.IDENTIFIER && 
                current.value === className &&
                tokens[i + 1]?.type === TokenType.LPAREN) {
                
                const accessModifier = inlineAccess !== null ? inlineAccess : currentAccess;
                
                // Extract parameters and body
                const paramVars = this.extractFunctionParameters(tokens, i);
                const parameters = paramVars.map(v => ({
                    name: v.name,
                    dataType: v.dataType,
                    byRef: false
                }));
                const bodyInfo = this.extractFunctionBody(classBody, tokens, i);
                const bodyLocalVars = bodyInfo ? this.findLocalVariables(bodyInfo.content, bodyInfo.startLine) : [];
                const allLocalVars = [...paramVars, ...bodyLocalVars];
                
                methods.push({
                    kind: SymbolKind.Method,
                    name: current.value,
                    returnType: 'void',  // Constructors don't have return type
                    accessModifier: accessModifier,
                    location: {
                        line: startLine + current.line - 1,
                        column: current.column
                    },
                    parameters: parameters,
                    localVariables: allLocalVars,
                    bodyStartLine: bodyInfo?.startLine,
                    bodyEndLine: bodyInfo?.endLine
                });
                
                continue;
            }
            
            const returnTypeToken = tokens[returnTypeIndex];
            const nameToken = tokens[returnTypeIndex + 1];
            const afterName = tokens[returnTypeIndex + 2];
            
            // Pattern: [access] type identifier (
            if ((returnTypeToken?.type === TokenType.KEYWORD || returnTypeToken?.type === TokenType.IDENTIFIER) &&
                nameToken?.type === TokenType.IDENTIFIER &&
                afterName?.type === TokenType.LPAREN) {
                
                // Use inline access modifier if present, otherwise use section-based
                const accessModifier = inlineAccess !== null ? inlineAccess : currentAccess;
                
                // Extract parameters and body
                const paramVars = this.extractFunctionParameters(tokens, returnTypeIndex);
                const parameters = paramVars.map(v => ({
                    name: v.name,
                    dataType: v.dataType,
                    byRef: false
                }));
                const bodyInfo = this.extractFunctionBody(classBody, tokens, returnTypeIndex);
                const bodyLocalVars = bodyInfo ? this.findLocalVariables(bodyInfo.content, bodyInfo.startLine) : [];
                const allLocalVars = [...paramVars, ...bodyLocalVars];
                
                methods.push({
                    kind: SymbolKind.Method,
                    name: nameToken.value,
                    returnType: returnTypeToken.value,
                    accessModifier: accessModifier,
                    location: {
                        line: startLine + nameToken.line - 1,
                        column: nameToken.column
                    },
                    parameters: parameters,
                    localVariables: allLocalVars,
                    bodyStartLine: bodyInfo?.startLine,
                    bodyEndLine: bodyInfo?.endLine
                });
                
                // Skip ahead to avoid processing the same tokens again
                if (inlineAccess !== null) {
                    i = returnTypeIndex + 1;  // Skip to method name
                }
            }
        }
        
        return methods;
    }

    /**
     * Find fields in struct body
     */
    private static findStructFields(structBody: string, startLine: number): MemberSymbol[] {
        const fields: MemberSymbol[] = [];
        const tokenizer = new Tokenizer(structBody);
        const tokens = tokenizer.tokenize();
        
        for (let i = 0; i < tokens.length - 2; i++) {
            const current = tokens[i];
            const next = tokens[i + 1];
            const afterNext = tokens[i + 2];
            
            // Pattern: type identifier;
            if ((current.type === TokenType.KEYWORD || current.type === TokenType.IDENTIFIER) &&
                next.type === TokenType.IDENTIFIER &&
                afterNext.type === TokenType.SEMICOLON) {
                
                fields.push({
                    kind: SymbolKind.MemberVariable,
                    name: next.value,
                    dataType: current.value,
                    accessModifier: AccessModifier.Public,  // Structs are always public
                    location: {
                        line: startLine + next.line - 1,
                        column: next.column
                    }
                });
            }
        }
        
        return fields;
    }
}
