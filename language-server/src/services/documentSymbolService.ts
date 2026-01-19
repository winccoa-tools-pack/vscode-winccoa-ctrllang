/**
 * Document Symbol Service
 * 
 * Provides VS Code's Outline View with document symbols (functions, classes, methods, etc.)
 * for the currently opened CTL file.
 * 
 * @see https://code.visualstudio.com/api/language-extensions/programmatic-language-features#show-all-symbol-definitions-in-file
 */

import { DocumentSymbol, SymbolKind as VSCodeSymbolKind, Range, Position } from 'vscode-languageserver/node';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { SymbolCache } from '../core/symbolCache';
import { 
    SymbolKind, 
    ClassSymbol, 
    FunctionSymbol, 
    MethodSymbol, 
    StructSymbol,
    EnumSymbol,
    VariableSymbol,
    MemberSymbol
} from '../symbolTable';

export class DocumentSymbolService {
    constructor(private cache: SymbolCache) {}

    /**
     * Get all document symbols for the given document
     * This populates VS Code's Outline View
     */
    async handle(document: TextDocument): Promise<DocumentSymbol[]> {
        const filePath = this.uriToPath(document.uri);
        const content = document.getText();
        
        // Parse symbols from document
        const fileSymbols = this.cache.getSymbolsFromContent(content, filePath);
        
        const symbols: DocumentSymbol[] = [];
        
        // Add Classes (with methods and members as children)
        for (const classSymbol of fileSymbols.classes) {
            symbols.push(this.createClassSymbol(classSymbol, document));
        }
        
        // Add Structs (with fields as children)
        for (const structSymbol of fileSymbols.structs) {
            symbols.push(this.createStructSymbol(structSymbol, document));
        }
        
        // Add Functions
        for (const funcSymbol of fileSymbols.functions) {
            symbols.push(this.createFunctionSymbol(funcSymbol, document));
        }
        
        // Add Global Variables
        for (const varSymbol of fileSymbols.globals) {
            symbols.push(this.createGlobalVariableSymbol(varSymbol, document));
        }
        
        // Add Enums (with enum members as children)
        for (const enumSymbol of fileSymbols.enums) {
            symbols.push(this.createEnumSymbol(enumSymbol, document));
        }
        
        return symbols;
    }

    private createClassSymbol(classSymbol: ClassSymbol, document: TextDocument): DocumentSymbol {
        // Full range: from class start to end (or approximate)
        // NOTE: SymbolTable uses 1-based line numbers, LSP uses 0-based
        // Use classSymbol.startLine for body start (after {), not for class keyword!
        const rangeStart = classSymbol.location.line - 1;  // Use location.line for class keyword
        const rangeEnd = (classSymbol.endLine || classSymbol.location.line + 20) - 1;
        
        const range = this.createRangeForLine(document, rangeStart, rangeEnd);
        
        // Selection range: just the class name (MUST be inside range!)
        const selectionRange = this.createSelectionRange(
            document,
            classSymbol.location.line - 1,  // Convert to 0-based
            classSymbol.location.column,
            classSymbol.name.length,
            range
        );
        
        const children: DocumentSymbol[] = [];
        
        // Add members
        for (const member of classSymbol.members) {
            children.push(this.createMemberSymbol(member, document));
        }
        
        // Add methods
        for (const method of classSymbol.methods) {
            children.push(this.createMethodSymbol(method, document));
        }
        
        return DocumentSymbol.create(
            classSymbol.name,
            classSymbol.baseClass ? `extends ${classSymbol.baseClass}` : undefined,
            VSCodeSymbolKind.Class,
            range,
            selectionRange,
            children
        );
    }

    private createStructSymbol(structSymbol: StructSymbol, document: TextDocument): DocumentSymbol {
        // Full range: from struct start line to approximate end
        // NOTE: SymbolTable uses 1-based line numbers, LSP uses 0-based
        const startLine = structSymbol.location.line - 1;
        const endLine = (structSymbol.location.line + Math.max(10, structSymbol.fields.length + 2)) - 1;
        
        const range = this.createRangeForLine(document, startLine, endLine);
        
        // Selection range: just the struct name (MUST be inside range!)
        const selectionRange = this.createSelectionRange(
            document,
            structSymbol.location.line - 1,  // Convert to 0-based
            structSymbol.location.column,
            structSymbol.name.length,
            range
        );
        
        const children: DocumentSymbol[] = [];
        
        // Add fields
        for (const field of structSymbol.fields) {
            children.push(this.createMemberSymbol(field, document));
        }
        
        return DocumentSymbol.create(
            structSymbol.name,
            undefined,
            VSCodeSymbolKind.Struct,
            range,
            selectionRange,
            children
        );
    }

    private createFunctionSymbol(funcSymbol: FunctionSymbol, document: TextDocument): DocumentSymbol {
        // Full range: from function start to body end
        // NOTE: SymbolTable uses 1-based line numbers, LSP uses 0-based
        const startLine = funcSymbol.location.line - 1;
        const endLine = (funcSymbol.bodyEndLine || funcSymbol.location.line + 10) - 1;
        
        const range = this.createRangeForLine(document, startLine, endLine);
        
        // Selection range: just the function name (MUST be inside range!)
        const selectionRange = this.createSelectionRange(
            document,
            funcSymbol.location.line - 1,  // Convert to 0-based
            funcSymbol.location.column,
            funcSymbol.name.length,
            range
        );
        
        // Detail: return type + parameters
        const params = funcSymbol.parameters
            .map(p => `${p.dataType} ${p.name}`)
            .join(', ');
        const detail = `${funcSymbol.returnType} ${funcSymbol.name}(${params})`;
        
        return DocumentSymbol.create(
            funcSymbol.name,
            detail,
            VSCodeSymbolKind.Function,
            range,
            selectionRange
        );
    }

    private createMethodSymbol(methodSymbol: MethodSymbol, document: TextDocument): DocumentSymbol {
        // Full range: from method start to body end
        // NOTE: SymbolTable uses 1-based line numbers, LSP uses 0-based
        const startLine = methodSymbol.location.line - 1;
        const endLine = (methodSymbol.bodyEndLine || methodSymbol.location.line + 10) - 1;
        
        const range = this.createRangeForLine(document, startLine, endLine);
        
        // Selection range: just the method name (MUST be inside range!)
        const selectionRange = this.createSelectionRange(
            document,
            methodSymbol.location.line - 1,  // Convert to 0-based
            methodSymbol.location.column,
            methodSymbol.name.length,
            range
        );
        
        // Detail: access modifier + return type + parameters
        const params = methodSymbol.parameters
            .map(p => `${p.dataType} ${p.name}`)
            .join(', ');
        const detail = `${methodSymbol.accessModifier} ${methodSymbol.returnType} ${methodSymbol.name}(${params})`;
        
        return DocumentSymbol.create(
            methodSymbol.name,
            detail,
            VSCodeSymbolKind.Method,
            range,
            selectionRange
        );
    }

    private createMemberSymbol(memberSymbol: MemberSymbol, document: TextDocument): DocumentSymbol {
        // Full range: entire line
        // NOTE: SymbolTable uses 1-based line numbers, LSP uses 0-based
        const line = memberSymbol.location.line - 1;
        const range = this.createRangeForLine(document, line, line);
        
        // Selection range: just the member name (MUST be inside range!)
        const selectionRange = this.createSelectionRange(
            document,
            memberSymbol.location.line - 1,  // Convert to 0-based
            memberSymbol.location.column,
            memberSymbol.name.length,
            range
        );
        
        // Detail: data type
        const detail = `${memberSymbol.dataType} ${memberSymbol.name}`;
        
        return DocumentSymbol.create(
            memberSymbol.name,
            detail,
            VSCodeSymbolKind.Field,
            range,
            selectionRange
        );
    }

    private createGlobalVariableSymbol(varSymbol: VariableSymbol, document: TextDocument): DocumentSymbol {
        // Full range: entire line
        // NOTE: SymbolTable uses 1-based line numbers, LSP uses 0-based
        const line = varSymbol.location.line - 1;
        const range = this.createRangeForLine(document, line, line);
        
        // Selection range: just the variable name (MUST be inside range!)
        const selectionRange = this.createSelectionRange(
            document,
            varSymbol.location.line - 1,  // Convert to 0-based
            varSymbol.location.column,
            varSymbol.name.length,
            range
        );
        
        // Detail: data type
        const detail = `${varSymbol.dataType} ${varSymbol.name}`;
        
        return DocumentSymbol.create(
            varSymbol.name,
            detail,
            VSCodeSymbolKind.Variable,
            range,
            selectionRange
        );
    }

    private createEnumSymbol(enumSymbol: EnumSymbol, document: TextDocument): DocumentSymbol {
        // Full range: from enum start to approximate end
        // NOTE: SymbolTable uses 1-based line numbers, LSP uses 0-based
        const startLine = enumSymbol.location.line - 1;
        const endLine = (enumSymbol.location.line + Math.max(5, enumSymbol.members.length + 2)) - 1;
        
        const range = this.createRangeForLine(document, startLine, endLine);
        
        // Selection range: just the enum name (MUST be inside range!)
        const selectionRange = this.createSelectionRange(
            document,
            enumSymbol.location.line - 1,  // Convert to 0-based
            enumSymbol.location.column,
            enumSymbol.name.length,
            range
        );
        
        const children: DocumentSymbol[] = [];
        
        // Add enum members
        for (const member of enumSymbol.members) {
            const memberLine = member.location.line - 1;  // Convert to 0-based
            const memberRange = this.createRangeForLine(document, memberLine, memberLine);
            const memberSelectionRange = this.createSelectionRange(
                document,
                member.location.line - 1,  // Convert to 0-based
                member.location.column,
                member.name.length,
                memberRange
            );
            
            children.push(DocumentSymbol.create(
                member.name,
                `= ${member.value}`,
                VSCodeSymbolKind.EnumMember,
                memberRange,
                memberSelectionRange
            ));
        }
        
        return DocumentSymbol.create(
            enumSymbol.name,
            undefined,
            VSCodeSymbolKind.Enum,
            range,
            selectionRange,
            children
        );
    }

    /**
     * Create a range for entire line(s) based on actual document content
     * This ensures the range is valid and selectionRange can be contained within it
     */
    private createRangeForLine(document: TextDocument, startLine: number, endLine: number): Range {
        // Clamp to document bounds
        const lineCount = document.lineCount;
        const safeStartLine = Math.max(0, Math.min(startLine, lineCount - 1));
        const safeEndLine = Math.max(safeStartLine, Math.min(endLine, lineCount - 1));
        
        // Get actual line length for end position
        const endLineText = document.getText({
            start: { line: safeEndLine, character: 0 },
            end: { line: safeEndLine + 1, character: 0 }
        });
        const endChar = endLineText.trimEnd().length;
        
        return Range.create(
            Position.create(safeStartLine, 0),
            Position.create(safeEndLine, endChar)
        );
    }

    /**
     * Create a selection range that is GUARANTEED to be inside the full range
     * This is critical for LSP validation
     */
    private createSelectionRange(
        document: TextDocument,
        line: number,
        column: number,
        nameLength: number,
        fullRange: Range
    ): Range {
        // Ensure line is within fullRange
        const safeLine = Math.max(fullRange.start.line, Math.min(line, fullRange.end.line));
        
        // Get actual line text to validate column positions
        const lineText = document.getText({
            start: { line: safeLine, character: 0 },
            end: { line: safeLine + 1, character: 0 }
        }).trimEnd();
        
        // Clamp start column to line length
        const startCol = Math.max(0, Math.min(column, lineText.length));
        
        // Clamp end column to line length (startCol + nameLength, but not beyond line end)
        const endCol = Math.min(startCol + nameLength, lineText.length);
        
        // Ensure we're within fullRange bounds
        let finalStartLine = safeLine;
        let finalStartCol = startCol;
        let finalEndLine = safeLine;
        let finalEndCol = endCol;
        
        // If on fullRange.start line, ensure we don't go before fullRange.start.character
        if (finalStartLine === fullRange.start.line) {
            finalStartCol = Math.max(finalStartCol, fullRange.start.character);
            finalEndCol = Math.max(finalEndCol, fullRange.start.character);
        }
        
        // If on fullRange.end line, ensure we don't go beyond fullRange.end.character
        if (finalEndLine === fullRange.end.line) {
            finalStartCol = Math.min(finalStartCol, fullRange.end.character);
            finalEndCol = Math.min(finalEndCol, fullRange.end.character);
        }
        
        return Range.create(
            Position.create(finalStartLine, finalStartCol),
            Position.create(finalEndLine, finalEndCol)
        );
    }

    private createRange(startLine: number, startChar: number, endLine: number, endChar: number): Range {
        return Range.create(
            Position.create(startLine, startChar),
            Position.create(endLine, endChar)
        );
    }

    private uriToPath(uri: string): string {
        if (uri.startsWith('file://')) {
            return uri.substring(7);
        }
        return uri;
    }
}
