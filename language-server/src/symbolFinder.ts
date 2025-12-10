/**
 * Simple token-based symbol finder for Go to Definition
 * 
 * This is a lightweight approach that uses the tokenizer to find symbols
 * without building a full AST. Good enough for basic navigation features.
 * 
 * When we build the full Language Server later, this can be replaced by
 * a proper Symbol Table with scope awareness.
 */

import { Tokenizer } from './tokenizer';
import { Token, TokenType } from './types';
import * as fs from 'fs';

export interface SymbolLocation {
    filePath: string;
    line: number;
    column: number;
    name: string;
    type: 'function' | 'variable' | 'global';
}

/**
 * Find all function definitions in a file
 * 
 * Matches patterns like:
 * - void myFunction()
 * - int myFunction(string param)
 * - static string myFunction()
 */
export function findFunctionDefinitions(filePath: string): SymbolLocation[] {
    const symbols: SymbolLocation[] = [];
    
    if (!fs.existsSync(filePath)) {
        return symbols;
    }
    
    const content = fs.readFileSync(filePath, 'utf-8');
    const tokenizer = new Tokenizer(content);
    const tokens = tokenizer.tokenize();
    
    // Look for pattern: [modifier*] type identifier (
    for (let i = 0; i < tokens.length - 2; i++) {
        const current = tokens[i];
        const next = tokens[i + 1];
        const afterNext = tokens[i + 2];
        
        // Skip 'main' as it's special
        if (next.type === TokenType.IDENTIFIER && 
            next.value === 'main' && 
            afterNext.type === TokenType.LPAREN) {
            
            symbols.push({
                filePath,
                line: next.line,
                column: next.column,
                name: 'main',
                type: 'function'
            });
            continue;
        }
        
        // Pattern: type identifier (
        if ((current.type === TokenType.KEYWORD || current.type === TokenType.IDENTIFIER) &&
            next.type === TokenType.IDENTIFIER &&
            afterNext.type === TokenType.LPAREN) {
            
            symbols.push({
                filePath,
                line: next.line,
                column: next.column,
                name: next.value,
                type: 'function'
            });
        }
    }
    
    return symbols;
}

/**
 * Find all global variable declarations
 * 
 * Matches patterns like:
 * - global string myVar;
 * - global int counter = 0;
 */
export function findGlobalVariables(filePath: string): SymbolLocation[] {
    const symbols: SymbolLocation[] = [];
    
    if (!fs.existsSync(filePath)) {
        return symbols;
    }
    
    const content = fs.readFileSync(filePath, 'utf-8');
    const tokenizer = new Tokenizer(content);
    const tokens = tokenizer.tokenize();
    
    // Look for pattern: global type identifier
    for (let i = 0; i < tokens.length - 2; i++) {
        const current = tokens[i];
        const next = tokens[i + 1];
        const afterNext = tokens[i + 2];
        
        if (current.type === TokenType.KEYWORD && 
            current.value === 'global' &&
            (next.type === TokenType.KEYWORD || next.type === TokenType.IDENTIFIER) &&
            afterNext.type === TokenType.IDENTIFIER) {
            
            symbols.push({
                filePath,
                line: afterNext.line,
                column: afterNext.column,
                name: afterNext.value,
                type: 'global'
            });
        }
    }
    
    return symbols;
}

/**
 * Find symbol at specific position
 * Returns the identifier token at the cursor position
 */
export function getSymbolAtPosition(content: string, offset: number): { name: string; line: number; column: number } | null {
    // Simple approach: find word boundaries around offset
    let start = offset;
    let end = offset;
    
    // Find word start
    while (start > 0 && /[a-zA-Z0-9_]/.test(content[start - 1])) {
        start--;
    }
    
    // Find word end
    while (end < content.length && /[a-zA-Z0-9_]/.test(content[end])) {
        end++;
    }
    
    const name = content.substring(start, end);
    if (!name) {
        return null;
    }
    
    // Calculate line and column (for logging)
    const textBefore = content.substring(0, start);
    const line = (textBefore.match(/\n/g) || []).length + 1;
    const lastNewline = textBefore.lastIndexOf('\n');
    const column = start - lastNewline - 1;
    
    return { name, line, column };
}

/**
 * Check if position is in a function call context
 * Simple heuristic: check if followed by (
 */
export function isFunctionCall(content: string, offset: number): boolean {
    // Skip the identifier
    let pos = offset;
    while (pos < content.length && /[a-zA-Z0-9_]/.test(content[pos])) {
        pos++;
    }
    
    // Skip whitespace
    while (pos < content.length && /\s/.test(content[pos])) {
        pos++;
    }
    
    // Check for opening parenthesis
    return content[pos] === '(';
}
