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
            symbols.push(this.createClassSymbol(classSymbol));
        }
        
        // Add Structs (with fields as children)
        for (const structSymbol of fileSymbols.structs) {
            symbols.push(this.createStructSymbol(structSymbol));
        }
        
        // Add Functions
        for (const funcSymbol of fileSymbols.functions) {
            symbols.push(this.createFunctionSymbol(funcSymbol));
        }
        
        // Add Global Variables
        for (const varSymbol of fileSymbols.globals) {
            symbols.push(this.createGlobalVariableSymbol(varSymbol));
        }
        
        // Add Enums (with enum members as children)
        for (const enumSymbol of fileSymbols.enums) {
            symbols.push(this.createEnumSymbol(enumSymbol));
        }
        
        return symbols;
    }

    private createClassSymbol(classSymbol: ClassSymbol): DocumentSymbol {
        const range = this.createRange(
            classSymbol.startLine || classSymbol.location.line,
            0,
            classSymbol.endLine || classSymbol.location.line,
            1000
        );
        
        const selectionRange = this.createRange(
            classSymbol.location.line,
            classSymbol.location.column,
            classSymbol.location.line,
            classSymbol.location.column + classSymbol.name.length
        );
        
        const children: DocumentSymbol[] = [];
        
        // Add members
        for (const member of classSymbol.members) {
            children.push(this.createMemberSymbol(member));
        }
        
        // Add methods
        for (const method of classSymbol.methods) {
            children.push(this.createMethodSymbol(method));
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

    private createStructSymbol(structSymbol: StructSymbol): DocumentSymbol {
        const range = this.createRange(
            structSymbol.location.line,
            0,
            structSymbol.location.line + 10,  // Approximate - could be improved with endLine
            1000
        );
        
        const selectionRange = this.createRange(
            structSymbol.location.line,
            structSymbol.location.column,
            structSymbol.location.line,
            structSymbol.location.column + structSymbol.name.length
        );
        
        const children: DocumentSymbol[] = [];
        
        // Add fields
        for (const field of structSymbol.fields) {
            children.push(this.createMemberSymbol(field));
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

    private createFunctionSymbol(funcSymbol: FunctionSymbol): DocumentSymbol {
        const range = this.createRange(
            funcSymbol.bodyStartLine || funcSymbol.location.line,
            0,
            funcSymbol.bodyEndLine || funcSymbol.location.line + 10,
            1000
        );
        
        const selectionRange = this.createRange(
            funcSymbol.location.line,
            funcSymbol.location.column,
            funcSymbol.location.line,
            funcSymbol.location.column + funcSymbol.name.length
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

    private createMethodSymbol(methodSymbol: MethodSymbol): DocumentSymbol {
        const range = this.createRange(
            methodSymbol.bodyStartLine || methodSymbol.location.line,
            0,
            methodSymbol.bodyEndLine || methodSymbol.location.line + 10,
            1000
        );
        
        const selectionRange = this.createRange(
            methodSymbol.location.line,
            methodSymbol.location.column,
            methodSymbol.location.line,
            methodSymbol.location.column + methodSymbol.name.length
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

    private createMemberSymbol(memberSymbol: MemberSymbol): DocumentSymbol {
        const range = this.createRange(
            memberSymbol.location.line,
            0,
            memberSymbol.location.line,
            1000
        );
        
        const selectionRange = this.createRange(
            memberSymbol.location.line,
            memberSymbol.location.column,
            memberSymbol.location.line,
            memberSymbol.location.column + memberSymbol.name.length
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

    private createGlobalVariableSymbol(varSymbol: VariableSymbol): DocumentSymbol {
        const range = this.createRange(
            varSymbol.location.line,
            0,
            varSymbol.location.line,
            1000
        );
        
        const selectionRange = this.createRange(
            varSymbol.location.line,
            varSymbol.location.column,
            varSymbol.location.line,
            varSymbol.location.column + varSymbol.name.length
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

    private createEnumSymbol(enumSymbol: EnumSymbol): DocumentSymbol {
        const range = this.createRange(
            enumSymbol.location.line,
            0,
            enumSymbol.location.line + 10,  // Approximate - could be improved with endLine
            1000
        );
        
        const selectionRange = this.createRange(
            enumSymbol.location.line,
            enumSymbol.location.column,
            enumSymbol.location.line,
            enumSymbol.location.column + enumSymbol.name.length
        );
        
        const children: DocumentSymbol[] = [];
        
        // Add enum members
        for (const member of enumSymbol.members) {
            const memberRange = this.createRange(member.location.line, 0, member.location.line, 1000);
            const memberSelectionRange = this.createRange(
                member.location.line,
                member.location.column,
                member.location.line,
                member.location.column + member.name.length
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
