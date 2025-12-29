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
    Enum = 'enum',
    EnumMember = 'enumMember',
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
    startLine?: number;  // Line where class starts (opening {)
    endLine?: number;    // Line where class ends (closing })
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

export interface EnumMemberSymbol {
    name: string;
    value?: number;
    location: SymbolLocation;
}

export interface EnumSymbol extends BaseSymbol {
    kind: SymbolKind.Enum;
    members: EnumMemberSymbol[];
    isGlobal?: boolean;
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
    enums: EnumSymbol[];
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
            enums: this.findEnumDefinitions(content, tokens),
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
    ): BaseSymbol | MemberSymbol | MethodSymbol | VariableSymbol | EnumSymbol | null {
        
        // 1. Check type definitions first (for type references like class/struct names)
        // Class definitions
        const classSymbol = symbols.classes.find(c => c.name === name);
        if (classSymbol) return classSymbol;
        
        // Struct definitions
        const structSymbol = symbols.structs.find(s => s.name === name);
        if (structSymbol) return structSymbol;
        
        // Enum definitions
        const enumSymbol = symbols.enums?.find(e => e.name === name);
        if (enumSymbol) return enumSymbol;
        
        // 2. HIGHEST PRIORITY: Check local scope (parameters and local variables)
        // This must come BEFORE checking struct fields or class members!
        
        // 2a. Check if we're inside a class method
        const containingClass = this.findContainingClass(position, symbols.classes);
        if (containingClass) {
            const containingMethod = this.findContainingMethod(position, containingClass.methods);
            if (containingMethod) {
                // Check method parameters FIRST (highest priority in method scope)
                if (containingMethod.parameters) {
                    const paramIndex = containingMethod.parameters.findIndex(p => p.name === name);
                    if (paramIndex >= 0) {
                        const param = containingMethod.parameters[paramIndex];
                        // Try to get parameter location from localVariables (paramVars were merged into localVariables)
                        // Parameters are at the beginning of localVariables array
                        const paramVar = containingMethod.localVariables?.find(v => v.name === param.name && v.dataType === param.dataType);
                        return paramVar || {
                            kind: SymbolKind.LocalVariable,
                            name: param.name,
                            dataType: param.dataType,
                            location: containingMethod.location
                        } as VariableSymbol;
                    }
                }
                
                // Then check local variables
                if (containingMethod.localVariables) {
                    const localVar = containingMethod.localVariables.find(v => v.name === name);
                    if (localVar) return localVar;
                }
            }
            
            // Check class members (lower priority than parameters/locals, but still in class scope)
            const member = containingClass.members.find(m => m.name === name);
            if (member) return member;
            
            // Check class methods (but skip if it's a constructor with same name as class)
            const method = containingClass.methods.find(m => m.name === name && m.name !== containingClass.name);
            if (method) return method;
        }
        
        // 2b. Check if we're inside a function (for parameters and local variables)
        const containingFunction = this.findContainingFunction(position, symbols.functions);
        if (containingFunction) {
            // Check function parameters FIRST
            if (containingFunction.parameters) {
                const paramIndex = containingFunction.parameters.findIndex(p => p.name === name);
                if (paramIndex >= 0) {
                    const param = containingFunction.parameters[paramIndex];
                    // Try to get parameter location from localVariables
                    const paramVar = containingFunction.localVariables?.find(v => v.name === param.name && v.dataType === param.dataType);
                    return paramVar || {
                        kind: SymbolKind.LocalVariable,
                        name: param.name,
                        dataType: param.dataType,
                        location: containingFunction.location
                    } as VariableSymbol;
                }
            }
            
            // Then check local variables
            if (containingFunction.localVariables) {
                const localVar = containingFunction.localVariables.find(v => v.name === name);
                if (localVar) return localVar;
            }
        }
        
        // 3. Check struct fields (only if not in local scope)
        for (const struct of symbols.structs) {
            const field = struct.fields.find(f => f.name === name);
            if (field) return field;
        }
        
        // 4. Check file scope (globals and functions)
        
        // Check global variables
        const globalVar = symbols.globals.find(g => g.name === name);
        if (globalVar) return globalVar;
        
        // Check global functions
        const func = symbols.functions.find(f => f.name === name);
        if (func) return func;
        
        // 5. Not found
        return null;
    }

    /**
     * Resolve member access: obj.member
     * @param objectName - Name of the object (e.g., "manager", "circle")
     * @param memberName - Name of the member (e.g., "validateConfig", "center")
     * @param position - Position in the document
     * @param symbols - File symbols
     * @returns Resolved member/method/field or null
     */
    public static resolveMemberAccess(
        objectName: string,
        memberName: string,
        position: Position,
        symbols: FileSymbols
    ): MemberSymbol | MethodSymbol | null {
        // First, resolve the object to get its type
        const objSymbol = this.resolveSymbol(objectName, position, symbols);
        
        if (!objSymbol || !('dataType' in objSymbol)) {
            return null;
        }
        
        const typeName = objSymbol.dataType;
        
        // Try to find as class definition
        const classSymbol = symbols.classes.find(c => c.name === typeName);
        if (classSymbol) {
            // Search for the member in this class
            // Check methods first (higher priority for method calls)
            const method = classSymbol.methods.find(m => m.name === memberName);
            if (method) {
                return method;
            }
            
            // Then check members
            const member = classSymbol.members.find(m => m.name === memberName);
            if (member) {
                return member;
            }
        }
        
        // Try to find as struct definition
        const structSymbol = symbols.structs.find(s => s.name === typeName);
        if (structSymbol) {
            // Search for the field in this struct
            const field = structSymbol.fields.find(f => f.name === memberName);
            if (field) {
                return field;
            }
        }
        
        return null;
    }

    /**
     * Resolve member by type name directly (for nested member access)
     * @param typeName - Name of the type (class or struct)
     * @param memberName - Name of the member to find
     * @param symbols - File symbols
     * @returns Resolved member/method/field or null
     */
    public static resolveMemberByType(
        typeName: string,
        memberName: string,
        symbols: FileSymbols
    ): MemberSymbol | MethodSymbol | null {
        // Try to find as class definition
        const classSymbol = symbols.classes.find(c => c.name === typeName);
        if (classSymbol) {
            // Search for the member in this class
            // Check methods first
            const method = classSymbol.methods.find(m => m.name === memberName);
            if (method) {
                return method;
            }
            
            // Then check members
            const member = classSymbol.members.find(m => m.name === memberName);
            if (member) {
                return member;
            }
        }
        
        // Try to find as struct definition
        const structSymbol = symbols.structs.find(s => s.name === typeName);
        if (structSymbol) {
            // Search for the field in this struct
            const field = structSymbol.fields.find(f => f.name === memberName);
            if (field) {
                return field;
            }
        }
        
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
        for (const cls of classes) {
            // Check if position is within class body
            // startLine and endLine are 1-based, position is 0-based (LSP)
            if (cls.startLine && cls.endLine) {
                if (position.line >= cls.startLine - 1 && position.line <= cls.endLine - 1) {
                    return cls;
                }
            }
        }
        return null;
    }

    /**
     * Find the method containing the given position
     */
    private static findContainingMethod(position: Position, methods: MethodSymbol[]): MethodSymbol | null {
        for (const method of methods) {
            // Check if position is within method signature or body
            // Signature line is method.location.line (1-based), body is bodyStartLine to bodyEndLine (1-based)
            // Position is 0-based (LSP protocol), so we need to convert
            const startLine = method.location.line - 1; // Include signature line, convert to 0-based
            const endLine = (method.bodyEndLine || method.location.line) - 1; // Convert to 0-based
            
            if (position.line >= startLine && position.line <= endLine) {
                return method;
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
            // bodyStartLine and bodyEndLine are 1-based, position is 0-based (LSP)
            if (func.bodyStartLine && func.bodyEndLine) {
                if (position.line >= func.bodyStartLine - 1 && position.line <= func.bodyEndLine - 1) {
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
                    baseClass,
                    startLine: classBody.startLine,
                    endLine: classBody.endLine
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
     * Find all enum definitions in the token stream
     * Pattern: [global] enum EnumName { MEMBER [= value], ... };
     */
    public static findEnumDefinitions(content: string, tokens: Token[]): EnumSymbol[] {
        const enums: EnumSymbol[] = [];
        
        for (let i = 0; i < tokens.length - 2; i++) {
            const current = tokens[i];
            const prev = i > 0 ? tokens[i - 1] : null;
            
            if (current.type === TokenType.KEYWORD && current.value === 'enum') {
                const next = tokens[i + 1];
                if (next.type !== TokenType.IDENTIFIER) continue;
                
                const enumName = next.value;
                const isGlobal = prev?.type === TokenType.KEYWORD && prev.value === 'global';
                
                const location: SymbolLocation = {
                    line: next.line,
                    column: next.column
                };
                
                // Find opening brace
                let braceIndex = i + 2;
                while (braceIndex < tokens.length && tokens[braceIndex].type !== TokenType.LBRACE) {
                    braceIndex++;
                }
                
                if (braceIndex >= tokens.length) continue;
                
                // Parse enum members until closing brace
                const members: EnumMemberSymbol[] = [];
                let j = braceIndex + 1;
                let currentValue = 0;
                
                while (j < tokens.length && tokens[j].type !== TokenType.RBRACE) {
                    const memberToken = tokens[j];
                    
                    if (memberToken.type === TokenType.IDENTIFIER) {
                        const memberName = memberToken.value;
                        const memberLocation: SymbolLocation = {
                            line: memberToken.line,
                            column: memberToken.column
                        };
                        
                        // Check for explicit value assignment: MEMBER = value
                        let explicitValue: number | undefined;
                        if (j + 2 < tokens.length && 
                            tokens[j + 1].type === TokenType.ASSIGN &&
                            tokens[j + 2].type === TokenType.NUMBER) {
                            explicitValue = parseInt(tokens[j + 2].value, 10);
                            currentValue = explicitValue;
                            j += 2; // Skip = and value
                        }
                        
                        members.push({
                            name: memberName,
                            value: currentValue,
                            location: memberLocation
                        });
                        
                        currentValue++; // Next implicit value
                    }
                    
                    j++;
                }
                
                enums.push({
                    kind: SymbolKind.Enum,
                    name: enumName,
                    location,
                    members,
                    isGlobal
                });
            }
        }
        
        return enums;
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
     * 
     * In CTRL, variables can be global in two ways:
     * 1. Explicit: global int myVar;
     * 2. Implicit: int myVar; (at file level, outside functions/classes)
     */
    public static findGlobalVariables(content: string, tokens: Token[]): VariableSymbol[] {
        const globals: VariableSymbol[] = [];
        const globalNames = new Set<string>();  // Track names to avoid duplicates
        
        let braceDepth = 0;
        let inClassOrStruct = false;
        let inFunction = false;
        
        // Pattern 1: Explicit global keyword (highest priority)
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
                globalNames.add(afterNext.value);  // Mark as found
            }
        }
        
        // Pattern 2: Implicit global (file-level variables)
        // Track brace depth to identify file-level scope
        braceDepth = 0;
        inClassOrStruct = false;
        inFunction = false;
        
        for (let i = 0; i < tokens.length - 2; i++) {
            const current = tokens[i];
            const next = tokens[i + 1];
            const afterNext = tokens[i + 2];
            
            // Track scope depth
            if (current.type === TokenType.LBRACE) braceDepth++;
            if (current.type === TokenType.RBRACE) braceDepth--;
            
            // Track if we're entering a class/struct/function
            if (current.type === TokenType.KEYWORD && 
                (current.value === 'class' || current.value === 'struct')) {
                inClassOrStruct = true;
            }
            
            // Reset when leaving class/struct/function
            if (braceDepth === 0) {
                inClassOrStruct = false;
                inFunction = false;
            }
            
            // Only parse at file level (braceDepth === 0)
            if (braceDepth !== 0) continue;
            if (inClassOrStruct || inFunction) continue;
            
            // Skip if already has 'global' keyword (handled above)
            if (current.type === TokenType.KEYWORD && current.value === 'global') continue;
            
            // Pattern: type identifier [= | ;]
            // Type can be keyword (int, string, etc.) or identifier (CustomType)
            if ((current.type === TokenType.KEYWORD || current.type === TokenType.IDENTIFIER) &&
                next.type === TokenType.IDENTIFIER &&
                (afterNext.type === TokenType.SEMICOLON || 
                 afterNext.value === '=' ||
                 afterNext.type === TokenType.LBRACKET)) {  // arrays: int arr[10]
                
                // Make sure it's not a function declaration
                if (afterNext.type === TokenType.LPAREN) continue;
                
                // Skip class/struct/function keywords
                if (current.value === 'class' || current.value === 'struct' || 
                    current.value === 'void' || current.value === 'public' || 
                    current.value === 'private' || current.value === 'protected') {
                    continue;
                }
                
                // Check if next token after identifier is '(' (function)
                const following = tokens[i + 2];
                if (following?.type === TokenType.LPAREN) {
                    inFunction = true;
                    continue;
                }
                
                // Skip if already found with 'global' keyword
                if (globalNames.has(next.value)) continue;
                
                // It's a file-level variable!
                globals.push({
                    kind: SymbolKind.GlobalVariable,
                    name: next.value,
                    dataType: current.value,
                    location: {
                        line: next.line,
                        column: next.column
                    }
                });
                globalNames.add(next.value);  // Mark as found
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
    private static extractClassBody(content: string, tokens: Token[], startIndex: number): { content: string; startLine: number; endLine: number } {
        // Find opening brace
        let braceIndex = startIndex;
        while (braceIndex < tokens.length && tokens[braceIndex].type !== TokenType.LBRACE) {
            braceIndex++;
        }
        
        if (braceIndex >= tokens.length) {
            return { content: '', startLine: 0, endLine: 0 };
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
            startLine: startLine + 1,
            endLine: endLine
        };
    }

    /**
     * Extract function parameters (for local variable resolution)
     * Parses patterns like: void func(string deviceName, int count)
     * 
     * @param tokens Token array to parse
     * @param startIndex Index to start looking for parameters
     * @param lineOffset Offset to add to parameter line numbers (for methods in classes)
     */
    private static extractFunctionParameters(tokens: Token[], startIndex: number, lineOffset: number = 0): VariableSymbol[] {
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
                        line: next.line + lineOffset,
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
        
        // Valid type keywords (exclude control flow keywords like return, if, for, etc.)
        const validTypeKeywords = new Set([
            'int', 'float', 'string', 'bool', 'char', 'unsigned', 'long', 'double', 'void',
            'bit32', 'uint', 'ulong', 'time', 'anytype', 'errClass', 'file', 
            'dyn_int', 'dyn_float', 'dyn_string', 'dyn_bool', 'dyn_char', 'dyn_time',
            'dyn_uint', 'dyn_ulong', 'dyn_bit32', 'dyn_errClass', 'dyn_anytype',
            'mapping', 'dyn_mapping', 'shared_ptr', 'vector', 'const'
        ]);
        
        // Pattern: type identifier [= | ;]
        for (let i = 0; i < tokens.length - 2; i++) {
            const current = tokens[i];
            const next = tokens[i + 1];
            const afterNext = tokens[i + 2];
            
            // Type can be valid keyword or identifier (for custom types like DeviceFactory)
            const isValidType = (current.type === TokenType.IDENTIFIER) || 
                                (current.type === TokenType.KEYWORD && validTypeKeywords.has(current.value));
            
            if (isValidType &&
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
                        line: startLine + next.line,
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
                const paramVars = this.extractFunctionParameters(tokens, i, startLine - 1);
                const parameters = paramVars.map(v => ({
                    name: v.name,
                    dataType: v.dataType,
                    byRef: false
                }));
                const bodyInfo = this.extractFunctionBody(classBody, tokens, i);
                const bodyLocalVars = bodyInfo ? this.findLocalVariables(bodyInfo.content, startLine + bodyInfo.startLine - 1) : [];
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
                    bodyStartLine: bodyInfo ? startLine + bodyInfo.startLine - 1 : undefined,
                    bodyEndLine: bodyInfo ? startLine + bodyInfo.endLine - 1 : undefined
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
                const paramVars = this.extractFunctionParameters(tokens, returnTypeIndex, startLine - 1);
                const parameters = paramVars.map(v => ({
                    name: v.name,
                    dataType: v.dataType,
                    byRef: false
                }));
                const bodyInfo = this.extractFunctionBody(classBody, tokens, returnTypeIndex);
                const bodyLocalVars = bodyInfo ? this.findLocalVariables(bodyInfo.content, startLine + bodyInfo.startLine - 1) : [];
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
                    bodyStartLine: bodyInfo ? startLine + bodyInfo.startLine - 1 : undefined,
                    bodyEndLine: bodyInfo ? startLine + bodyInfo.endLine - 1 : undefined
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
