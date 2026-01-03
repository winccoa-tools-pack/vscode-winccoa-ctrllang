import { 
    Range, 
    WorkspaceEdit, 
    TextEdit, 
    PrepareRenameParams, 
    RenameParams,
    TextDocumentEdit,
    OptionalVersionedTextDocumentIdentifier
} from 'vscode-languageserver/node';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { SymbolCache } from '../core/symbolCache';
import { getSymbolAtPosition } from '../symbolFinder';
import { SymbolKind, SymbolTable, Position } from '../symbolTable';

export class RenameService {
    constructor(private cache: SymbolCache) {}

    /**
     * Prepare rename - validate that symbol can be renamed
     */
    prepareRename(document: TextDocument, params: PrepareRenameParams): Range | null {
        const position: Position = params.position;
        const offset = document.offsetAt(position);
        const symbolInfo = getSymbolAtPosition(document.getText(), offset);

        if (!symbolInfo) {
            return null;
        }

        const symbols = this.cache.getSymbolsFromContent(document.getText(), document.uri);
        const resolvedSymbol = SymbolTable.resolveSymbol(symbolInfo.name, position, symbols);

        if (!resolvedSymbol || !this.isRenameableSymbol(resolvedSymbol.kind)) {
            return null;
        }

        // Return range of the symbol at cursor
        return {
            start: position,
            end: { line: position.line, character: position.character + symbolInfo.name.length }
        };
    }

    /**
     * Perform rename - find all occurrences and create edits
     */
    rename(document: TextDocument, params: RenameParams): WorkspaceEdit | null {
        const position: Position = params.position;
        const newName = params.newName;
        const offset = document.offsetAt(position);
        const symbolInfo = getSymbolAtPosition(document.getText(), offset);

        if (!symbolInfo) {
            return null;
        }

        const symbols = this.cache.getSymbolsFromContent(document.getText(), document.uri);
        const resolvedSymbol = SymbolTable.resolveSymbol(symbolInfo.name, position, symbols);

        if (!resolvedSymbol || !this.isRenameableSymbol(resolvedSymbol.kind)) {
            return null;
        }

        const edits: TextEdit[] = [];
        const symbolName = resolvedSymbol.name;

        // Check if symbol is global (function or global variable)
        const isGlobal = this.isGlobalSymbol(resolvedSymbol.kind, position, symbols);

        if (isGlobal) {
            // Global symbols: rename in entire file
            this.findOccurrencesInFile(document, symbolName, edits, newName);
        } else {
            // Local symbols: rename only within scope
            this.findOccurrencesInScope(document, symbolName, position, symbols, edits, newName);
        }

        if (edits.length === 0) {
            return null;
        }

        // Use documentChanges format for better preview support
        const textDocumentEdit: TextDocumentEdit = {
            textDocument: {
                uri: document.uri,
                version: null  // null means any version
            } as OptionalVersionedTextDocumentIdentifier,
            edits: edits
        };

        const workspaceEdit: WorkspaceEdit = {
            documentChanges: [textDocumentEdit]
        };

        return workspaceEdit;
    }

    /**
     * Check if symbol is global scope
     */
    private isGlobalSymbol(kind: SymbolKind, position: Position, symbols: any): boolean {
        if (kind === SymbolKind.Function || kind === SymbolKind.GlobalVariable) {
            return true;
        }
        return false;
    }

    /**
     * Find occurrences in entire file (for global symbols)
     */
    private findOccurrencesInFile(
        document: TextDocument,
        symbolName: string,
        edits: TextEdit[],
        newName: string
    ): void {
        const text = document.getText();
        const lines = text.split('\n');
        const regex = new RegExp(`\\b${this.escapeRegex(symbolName)}\\b`, 'g');

        for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
            const line = lines[lineIndex];
            let match: RegExpExecArray | null;

            while ((match = regex.exec(line)) !== null) {
                const startChar = match.index;
                const endChar = startChar + symbolName.length;

                edits.push({
                    range: {
                        start: { line: lineIndex, character: startChar },
                        end: { line: lineIndex, character: endChar }
                    },
                    newText: newName
                });
            }
        }
    }

    /**
     * Find occurrences within scope (for local symbols)
     */
    private findOccurrencesInScope(
        document: TextDocument,
        symbolName: string,
        position: Position,
        symbols: any,
        edits: TextEdit[],
        newName: string
    ): void {
        // Find containing function or method
        const scope = this.findContainingScope(position, symbols);
        
        if (!scope) {
            // No scope found - fallback to file-wide (shouldn't happen)
            this.findOccurrencesInFile(document, symbolName, edits, newName);
            return;
        }

        // Only search within scope boundaries
        const startLine = scope.startLine;
        const endLine = scope.endLine;
        const text = document.getText();
        const lines = text.split('\n');
        const regex = new RegExp(`\\b${this.escapeRegex(symbolName)}\\b`, 'g');

        for (let lineIndex = startLine; lineIndex <= endLine && lineIndex < lines.length; lineIndex++) {
            const line = lines[lineIndex];
            let match: RegExpExecArray | null;

            while ((match = regex.exec(line)) !== null) {
                const startChar = match.index;
                const endChar = startChar + symbolName.length;

                edits.push({
                    range: {
                        start: { line: lineIndex, character: startChar },
                        end: { line: lineIndex, character: endChar }
                    },
                    newText: newName
                });
            }
        }
    }

    /**
     * Find the containing function or method scope
     */
    private findContainingScope(position: Position, symbols: any): { startLine: number; endLine: number } | null {
        // Check if inside a function
        for (const func of symbols.functions) {
            if (func.bodyStartLine !== undefined && func.bodyEndLine !== undefined) {
                if (position.line >= func.bodyStartLine && position.line <= func.bodyEndLine) {
                    return { startLine: func.bodyStartLine, endLine: func.bodyEndLine };
                }
            }
        }

        // Check if inside a class method
        for (const cls of symbols.classes) {
            for (const method of cls.methods) {
                if (method.bodyStartLine !== undefined && method.bodyEndLine !== undefined) {
                    if (position.line >= method.bodyStartLine && position.line <= method.bodyEndLine) {
                        return { startLine: method.bodyStartLine, endLine: method.bodyEndLine };
                    }
                }
            }
        }

        return null;
    }

    /**
     * Check if symbol kind is renameable
     */
    private isRenameableSymbol(kind: SymbolKind): boolean {
        return [
            SymbolKind.Function,
            SymbolKind.GlobalVariable,
            SymbolKind.LocalVariable,
            SymbolKind.Method,
            SymbolKind.MemberVariable
        ].includes(kind);
    }

    /**
     * Escape special regex characters
     */
    private escapeRegex(str: string): string {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}
