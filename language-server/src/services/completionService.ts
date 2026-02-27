/**
 * Completion Service for WinCC OA CTL Language Server
 * 
 * v1.1.0: Enhanced with user-defined symbol completion
 * 
 * Provides completion for:
 * - Built-in WinCC OA functions
 * - User-defined functions (from current file + #uses)
 * - Classes (with member/method completion)
 * - Global variables
 * - Enums and enum members
 * - Member access (obj.method, obj.field)
 */

import { CompletionItem, CompletionItemKind, TextDocumentPositionParams, Position } from 'vscode-languageserver/node';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { getAllBuiltinFunctions, FunctionSignature, getAllBuiltinConstants, ConstantInfo } from '../builtins';
import { SymbolCache } from '../core/symbolCache';
import { ProjectInfo } from '../usesResolver';
import { fileURLToPath } from 'url';
import { 
    ClassSymbol, 
    FunctionSymbol, 
    VariableSymbol, 
    MethodSymbol, 
    MemberSymbol,
    EnumSymbol,
    SymbolKind,
    AccessModifier
} from '../symbolTable';

export class CompletionService {
    constructor(
        private cache: SymbolCache,
        private getProjectInfo: () => Promise<ProjectInfo | null>
    ) {}

    /**
     * Get all completion items for a position in a document
     * v1.1.0: Context-aware completion with user symbols
     */
    getCompletions(document: TextDocument, position: Position): CompletionItem[] {
        const text = document.getText();
        const offset = document.offsetAt(position);
        
        // Check if we're in a member access context (obj.)
        const memberContext = this.getMemberAccessContext(text, offset);
        
        if (memberContext) {
            // Member completion (obj.method, obj.field)
            return this.getMemberCompletions(document, memberContext);
        }
        
        // Default: All symbols
        return this.getAllSymbolCompletions(document);
    }
    
    /**
     * Get all available symbols for completion
     */
    private getAllSymbolCompletions(document: TextDocument): CompletionItem[] {
        const items: CompletionItem[] = [];
        
        // 1. Built-in functions
        items.push(...getAllBuiltinFunctions().map((fn, idx) => 
            this.createBuiltinFunctionItem(fn, idx)
        ));
        
        // 1b. Built-in constants (from ctrl.xml + hardcoded)
        items.push(...getAllBuiltinConstants().map(c => this.createConstantItem(c)));
        
        // 2. Try to resolve #uses dependencies
        try {
            // Convert URI to file path
            const filePath = fileURLToPath(document.uri);
            
            // Get all symbols (current file + #uses dependencies)
            const allSymbols = this.cache.getSymbolsWithDependencies(filePath, document.getText());
            
            // Add symbols from all files (main + dependencies)
            for (const fileSymbols of allSymbols) {
                items.push(...fileSymbols.functions.map(f => this.createFunctionItem(f)));
                items.push(...fileSymbols.classes.map(c => this.createClassItem(c)));
                items.push(...fileSymbols.globals
                    .filter((v: VariableSymbol) => v.kind === SymbolKind.GlobalVariable)
                    .map((v: VariableSymbol) => this.createVariableItem(v))
                );
                items.push(...fileSymbols.enums.map(e => this.createEnumItem(e)));
                for (const enumSym of fileSymbols.enums) {
                    items.push(...enumSym.members.map(m => 
                        this.createEnumMemberItem(enumSym.name, m.name)
                    ));
                }
            }
        } catch (e) {
            // Fallback: URI conversion failed or no project info
            // Parse only current document
            const currentSymbols = this.cache.getSymbolsFromContent(document.getText(), document.uri);
            items.push(...currentSymbols.functions.map(f => this.createFunctionItem(f)));
            items.push(...currentSymbols.classes.map(c => this.createClassItem(c)));
            items.push(...currentSymbols.globals
                .filter((v: VariableSymbol) => v.kind === SymbolKind.GlobalVariable)
                .map((v: VariableSymbol) => this.createVariableItem(v))
            );
            items.push(...currentSymbols.enums.map(e => this.createEnumItem(e)));
            for (const enumSym of currentSymbols.enums) {
                items.push(...enumSym.members.map(m => 
                    this.createEnumMemberItem(enumSym.name, m.name)
                ));
            }
        }
        
        return items;
    }
    
    /**
     * Get member completions for obj.member access
     */
    private getMemberCompletions(document: TextDocument, typeName: string): CompletionItem[] {
        const items: CompletionItem[] = [];
        
        // Parse current document
        const currentSymbols = this.cache.getSymbolsFromContent(document.getText(), document.uri);
        
        // Find the class/struct definition
        const classSym = currentSymbols.classes.find(c => c.name === typeName);
        
        if (classSym) {
            // Add methods
            items.push(...classSym.methods.map(m => this.createMethodItem(m)));
            
            // Add public members
            items.push(...classSym.members
                .filter(m => m.accessModifier === AccessModifier.Public)
                .map(m => this.createMemberItem(m))
            );
            
            // Check for base class members
            if (classSym.baseClass) {
                items.push(...this.getMemberCompletions(document, classSym.baseClass));
            }
        }
        
        const structSym = currentSymbols.structs.find(s => s.name === typeName);
        if (structSym) {
            // Struct fields (all public)
            items.push(...structSym.fields.map(f => this.createMemberItem(f)));
        }
        
        return items;
    }
    
    /**
     * Detect member access context (obj.)
     * Returns the type name if in member access, null otherwise
     */
    private getMemberAccessContext(text: string, offset: number): string | null {
        // Look back for "identifier." pattern
        const before = text.substring(Math.max(0, offset - 100), offset);
        const match = before.match(/(\w+)\.\s*$/);
        
        if (match) {
            return match[1];  // Variable/object name
            // TODO: Proper type resolution - for now just return the identifier
            // In future: look up variable type in symbol table
        }
        
        return null;
    }
    
    /**
     * Resolve additional completion item details
     */
    resolveCompletionItem(item: CompletionItem): CompletionItem {
        return item;
    }
    
    // ========================================================================
    // Completion Item Factories
    // ========================================================================
    
    /**
     * Create CompletionItem from built-in FunctionSignature
     */
    private createBuiltinFunctionItem(fn: FunctionSignature, idx: number): CompletionItem {
        const paramList = fn.parameters.map(p => {
            let s = '';
            if (p.direction === 'out' || p.byRef) s += '&';
            s += `${p.type} ${p.name}`;
            if (p.optional) s = `[${s}]`;
            if (p.variadic) s = `...${s}`;
            return s;
        }).join(', ');

        return {
            label: fn.name,
            kind: CompletionItemKind.Function,
            detail: `${fn.returnType} ${fn.name}(${paramList})`,
            documentation: fn.description || '',
            insertText: fn.name,
            data: idx,
            sortText: `1_${fn.name}`  // Built-ins first
        };
    }
    
    /**
     * Create CompletionItem from user-defined FunctionSymbol
     */
    private createFunctionItem(fn: FunctionSymbol): CompletionItem {
        const paramList = fn.parameters.map(p => `${p.dataType} ${p.name}`).join(', ');
        
        return {
            label: fn.name,
            kind: CompletionItemKind.Function,
            detail: `${fn.returnType} ${fn.name}(${paramList})`,
            documentation: `User-defined function at line ${fn.location.line}`,
            insertText: fn.name,
            sortText: `2_${fn.name}`  // User functions after built-ins
        };
    }
    
    /**
     * Create CompletionItem from ClassSymbol
     */
    private createClassItem(cls: ClassSymbol): CompletionItem {
        const memberCount = cls.members.length + cls.methods.length;
        
        return {
            label: cls.name,
            kind: CompletionItemKind.Class,
            detail: `class ${cls.name}${cls.baseClass ? ` : ${cls.baseClass}` : ''}`,
            documentation: `${memberCount} members/methods`,
            insertText: cls.name,
            sortText: `2_${cls.name}`
        };
    }
    
    /**
     * Create CompletionItem from VariableSymbol
     */
    private createVariableItem(v: VariableSymbol): CompletionItem {
        return {
            label: v.name,
            kind: CompletionItemKind.Variable,
            detail: `${v.dataType} ${v.name}`,
            documentation: `Global variable at line ${v.location.line}`,
            insertText: v.name,
            sortText: `3_${v.name}`  // Variables after functions
        };
    }
    
    /**
     * Create CompletionItem from MethodSymbol
     */
    private createMethodItem(m: MethodSymbol): CompletionItem {
        const paramList = m.parameters.map(p => `${p.dataType} ${p.name}`).join(', ');
        
        return {
            label: m.name,
            kind: CompletionItemKind.Method,
            detail: `${m.returnType} ${m.name}(${paramList})`,
            documentation: `${m.accessModifier} method`,
            insertText: m.name,
            sortText: `1_${m.name}`  // Methods first in member context
        };
    }
    
    /**
     * Create CompletionItem from MemberSymbol
     */
    private createMemberItem(m: MemberSymbol): CompletionItem {
        return {
            label: m.name,
            kind: CompletionItemKind.Field,
            detail: `${m.dataType} ${m.name}`,
            documentation: `${m.accessModifier} field`,
            insertText: m.name,
            sortText: `2_${m.name}`  // Fields after methods
        };
    }
    
    /**
     * Create CompletionItem from EnumSymbol
     */
    private createEnumItem(e: EnumSymbol): CompletionItem {
        return {
            label: e.name,
            kind: CompletionItemKind.Enum,
            detail: `enum ${e.name}`,
            documentation: `${e.members.length} values`,
            insertText: e.name,
            sortText: `2_${e.name}`
        };
    }
    
    /**
     * Create CompletionItem for enum member (Color::RED)
     */
    private createEnumMemberItem(enumName: string, memberName: string): CompletionItem {
        return {
            label: `${enumName}::${memberName}`,
            kind: CompletionItemKind.EnumMember,
            detail: `${enumName}::${memberName}`,
            insertText: `${enumName}::${memberName}`,
            sortText: `3_${enumName}_${memberName}`
        };
    }
    
    /**
     * Create CompletionItem from built-in ConstantInfo
     */
    private createConstantItem(c: ConstantInfo): CompletionItem {
        const valueStr = c.value !== undefined ? ` = ${c.value}` : '';
        return {
            label: c.name,
            kind: CompletionItemKind.Constant,
            detail: `const ${c.type} ${c.name}${valueStr}`,
            insertText: c.name,
            sortText: `1_${c.name}`  // Constants alongside built-ins
        };
    }
}
