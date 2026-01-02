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
import { getAllBuiltinFunctions, FunctionSignature } from '../builtins';
import { SymbolCache } from '../core/symbolCache';
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
    constructor(private cache: SymbolCache) {}

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
            return this.getMemberCompletions(document.uri, memberContext);
        }
        
        // Default: All symbols
        return this.getAllSymbolCompletions(document.uri);
    }
    
    /**
     * Get all available symbols for completion
     */
    private getAllSymbolCompletions(fileUri: string): CompletionItem[] {
        const items: CompletionItem[] = [];
        
        // 1. Built-in functions
        items.push(...getAllBuiltinFunctions().map((fn, idx) => 
            this.createBuiltinFunctionItem(fn, idx)
        ));
        
        // 2. User-defined symbols (with dependencies from #uses)
        const allSymbols = this.cache.getSymbolsWithDependencies(fileUri);
        
        for (const symbols of allSymbols) {
            // Functions
            items.push(...symbols.functions.map(f => this.createFunctionItem(f)));
            
            // Classes
            items.push(...symbols.classes.map(c => this.createClassItem(c)));
            
            // Global variables
            items.push(...symbols.globals
                .filter((v: VariableSymbol) => v.kind === SymbolKind.GlobalVariable)
                .map((v: VariableSymbol) => this.createVariableItem(v))
            );
            
            // Enums
            items.push(...symbols.enums.map(e => this.createEnumItem(e)));
            
            // Enum members (for direct access like Color::RED)
            for (const enumSym of symbols.enums) {
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
    private getMemberCompletions(fileUri: string, typeName: string): CompletionItem[] {
        const items: CompletionItem[] = [];
        const allSymbols = this.cache.getSymbolsWithDependencies(fileUri);
        
        // Find the class/struct definition
        for (const symbols of allSymbols) {
            const classSym = symbols.classes.find(c => c.name === typeName);
            
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
                    items.push(...this.getMemberCompletions(fileUri, classSym.baseClass));
                }
                
                break;
            }
            
            const structSym = symbols.structs.find(s => s.name === typeName);
            if (structSym) {
                // Struct fields (all public)
                items.push(...structSym.fields.map(f => this.createMemberItem(f)));
                break;
            }
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
            let s = p.byRef ? '&' : '';
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
}
