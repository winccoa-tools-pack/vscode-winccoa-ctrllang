/**
 * Completion Service for WinCC OA CTL Language Server
 * 
 * Currently provides completion for:
 * - Built-in WinCC OA functions
 * 
 * Future expansion:
 * - User-defined symbols (classes, functions, variables)
 * - Member access completion (obj. triggers members)
 * - Import suggestions
 */

import { CompletionItem, CompletionItemKind } from 'vscode-languageserver/node';
import { getAllBuiltinFunctions, FunctionSignature } from '../builtins';

export class CompletionService {
    /**
     * Get all completion items
     * Currently returns only built-in functions
     */
    getCompletions(): CompletionItem[] {
        return getAllBuiltinFunctions().map((fn, idx) => 
            this.createFunctionCompletionItem(fn, idx)
        );
    }
    
    /**
     * Resolve additional completion item details
     * Currently a pass-through, can be extended for lazy loading
     */
    resolveCompletionItem(item: CompletionItem): CompletionItem {
        return item;
    }
    
    /**
     * Create CompletionItem from FunctionSignature
     */
    private createFunctionCompletionItem(fn: FunctionSignature, idx: number): CompletionItem {
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
            data: idx
        };
    }
}
