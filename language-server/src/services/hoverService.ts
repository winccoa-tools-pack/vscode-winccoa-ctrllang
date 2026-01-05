/**
 * Hover Service for WinCC OA CTL Language Server
 * 
 * Handles hover information for:
 * - User-defined symbols (classes, structs, functions, variables)
 * - Member access chains (obj.member.field)
 * - Builtin functions
 */

import { Hover, MarkupKind, Position } from 'vscode-languageserver/node';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { SymbolTable, FileSymbols, SymbolKind, BaseSymbol, MethodSymbol, MemberSymbol, EnumSymbol } from '../symbolTable';
import { getSymbolAtPosition } from '../symbolFinder';
import { fileURLToPath } from 'url';

// Symbol info returned by getSymbolAtPosition
interface SymbolInfo {
    name: string;
    line: number;
    column: number;
    memberAccess?: { objectName: string };
    memberAccessChain?: string[];
    enumAccess?: { enumName: string };
}
import { getBuiltinFunction } from '../builtins';
import { SymbolCache } from '../core/symbolCache';
import { resolveUsesPath, ProjectInfo } from '../usesResolver';

export class HoverService {
    private cache: SymbolCache;
    private getProjectInfo: () => Promise<ProjectInfo | null>;
    
    constructor(cache: SymbolCache, getProjectInfo: () => Promise<ProjectInfo | null>) {
        this.cache = cache;
        this.getProjectInfo = getProjectInfo;
    }
    
    /**
     * Handle hover request
     */
    async handle(doc: TextDocument, position: Position): Promise<Hover | null> {
        const content = doc.getText();
        const offset = doc.offsetAt(position);
        
        // Check if hovering over #uses directive
        const usesHover = await this.handleUsesHover(content, position);
        if (usesHover) {
            return usesHover;
        }
        
        // Try user-defined symbols first
        const symbolInfo = getSymbolAtPosition(content, offset);
        if (!symbolInfo) {
            return this.handleBuiltinHover(content, offset);
        }
        
        // Convert URI to file path for cache
        const filePath = doc.uri.startsWith('file://') ? fileURLToPath(doc.uri) : doc.uri;
        const allSymbols = this.cache.getSymbolsWithDependencies(filePath, content);
        if (allSymbols.length === 0) {
            return this.handleBuiltinHover(content, offset);
        }
        
        const symbols = allSymbols[0];  // Main file symbols
        
        let resolved: BaseSymbol | null = null;
        
        // Handle enum member access (e.g., Color::RED)
        if (symbolInfo.enumAccess) {
            resolved = this.resolveEnumMember(symbolInfo, position, symbols);
        }
        // Handle member access chains (e.g., circle.center.x)
        else if (symbolInfo.memberAccessChain && symbolInfo.memberAccessChain.length > 1) {
            resolved = this.resolveMemberAccessChain(symbolInfo, position, allSymbols);
        } else if (symbolInfo.memberAccess) {
            // Simple member access (e.g., obj.member)
            resolved = this.resolveMemberAccess(symbolInfo, position, allSymbols);
        } else {
            // Normal symbol resolution
            resolved = SymbolTable.resolveSymbol(symbolInfo.name, position, symbols);
        }
        
        if (resolved) {
            const hoverText = this.formatHoverText(resolved);
            if (hoverText) {
                return { contents: { kind: MarkupKind.Markdown, value: hoverText } };
            }
        }
        
        // Fallback to builtin functions
        return this.handleBuiltinHover(content, offset);
    }
    
    /**
     * Resolve enum member access like Color::RED
     */
    private resolveEnumMember(
        symbolInfo: SymbolInfo,
        position: Position,
        symbols: FileSymbols
    ): BaseSymbol | null {
        if (!symbolInfo.enumAccess) return null;
        
        const enumName = symbolInfo.enumAccess.enumName;
        const memberName = symbolInfo.name;
        
        // Find the enum definition
        const enumSymbol = symbols.enums?.find(e => e.name === enumName);
        if (!enumSymbol) return null;
        
        // Find the member in the enum
        const member = enumSymbol.members.find(m => m.name === memberName);
        if (!member) return null;
        
        // Create a pseudo-symbol for hover display
        return {
            kind: SymbolKind.EnumMember,
            name: `${enumName}::${memberName}`,
            location: member.location,
            dataType: enumName,  // Store enum name as type
            value: member.value  // Store value for display
        } as any;
    }
    
    /**
     * Resolve member access chain like circle.center.x
     */
    private resolveMemberAccessChain(
        symbolInfo: SymbolInfo,
        position: Position,
        allSymbols: FileSymbols[]
    ): BaseSymbol | null {
        if (!symbolInfo.memberAccessChain) return null;
        
        const chain = symbolInfo.memberAccessChain;
        let currentType: string | null = null;
        
        // Resolve first symbol (e.g., "circle")
        const firstSymbol = SymbolTable.resolveSymbol(chain[0], position, allSymbols[0]);
        if (!firstSymbol || !('dataType' in firstSymbol)) return null;
        
        currentType = firstSymbol.dataType;
        
        // Walk through the chain
        for (let i = 1; i < chain.length; i++) {
            const memberName = chain[i];
            let foundMember: MemberSymbol | MethodSymbol | null = null;
            
            for (const symbolTable of allSymbols) {
                foundMember = SymbolTable.resolveMemberByType(currentType!, memberName, symbolTable);
                if (foundMember) break;
            }
            
            if (!foundMember) return null;
            
            // If this is the last element, return it
            if (i === chain.length - 1) {
                return foundMember;
            }
            
            // Update currentType for next iteration
            if ('dataType' in foundMember) {
                currentType = foundMember.dataType;
            } else {
                return null;
            }
        }
        
        return null;
    }
    
    /**
     * Resolve simple member access like obj.member
     */
    private resolveMemberAccess(
        symbolInfo: SymbolInfo,
        position: Position,
        allSymbols: FileSymbols[]
    ): BaseSymbol | null {
        if (!symbolInfo.memberAccess) return null;
        
        const objectName = symbolInfo.memberAccess.objectName;
        const objSymbol = SymbolTable.resolveSymbol(objectName, position, allSymbols[0]);
        
        if (!objSymbol || !('dataType' in objSymbol)) return null;
        
        const typeName = objSymbol.dataType;
        
        for (const symbolTable of allSymbols) {
            const resolved = SymbolTable.resolveMemberByType(typeName, symbolInfo.name, symbolTable);
            if (resolved) return resolved;
        }
        
        return null;
    }
    
    /**
     * Format hover text based on symbol type
     */
    private formatHoverText(symbol: BaseSymbol): string | null {
        // Enum member (Color::RED = 0)
        if (symbol.kind === SymbolKind.EnumMember) {
            const enumMemberSymbol = symbol as any;
            const value = enumMemberSymbol.value !== undefined ? ` = ${enumMemberSymbol.value}` : '';
            return `\`\`\`ctrl\n${symbol.name}${value}\n\`\`\``;
        }
        
        if ('dataType' in symbol) {
            // Variables (local, global, member, struct fields)
            const typedSymbol = symbol as any;
            return `\`\`\`ctrl\n${typedSymbol.dataType} ${symbol.name}\n\`\`\``;
        }
        
        if (symbol.kind === SymbolKind.Class) {
            return `\`\`\`ctrl\nclass ${symbol.name}\n\`\`\``;
        }
        
        if (symbol.kind === SymbolKind.Struct) {
            return `\`\`\`ctrl\nstruct ${symbol.name}\n\`\`\``;
        }
        
        if (symbol.kind === SymbolKind.Enum) {
            const enumSymbol = symbol as EnumSymbol;
            const memberNames = enumSymbol.members.map(m => m.name).join(', ');
            return `\`\`\`ctrl\nenum ${symbol.name} { ${memberNames} }\n\`\`\``;
        }
        
        if (symbol.kind === SymbolKind.Method && 'returnType' in symbol) {
            const method = symbol as MethodSymbol;
            const paramList = (method.parameters || [])
                .map(p => `${p.dataType} ${p.name}`)
                .join(', ');
            return `\`\`\`ctrl\n${method.returnType} ${method.name}(${paramList})\n\`\`\``;
        }
        
        if (symbol.kind === SymbolKind.Function && 'returnType' in symbol) {
            const func = symbol as any;
            const paramList = (func.parameters || [])
                .map((p: any) => `${p.dataType} ${p.name}`)
                .join(', ');
            return `\`\`\`ctrl\n${func.returnType} ${func.name}(${paramList})\n\`\`\``;
        }
        
        return null;
    }
    
    /**
     * Handle hover for builtin functions
     */
    private handleBuiltinHover(content: string, offset: number): Hover | null {
        // Extract word at position
        let start = offset, end = offset;
        while (start > 0 && /[a-zA-Z0-9_]/.test(content[start - 1])) start--;
        while (end < content.length && /[a-zA-Z0-9_]/.test(content[end])) end++;
        
        const word = content.substring(start, end);
        if (!word) return null;
        
        const fn = getBuiltinFunction(word);
        if (!fn) return null;
        
        const paramList = fn.parameters.map(p => {
            let s = p.byRef ? '&' : '';
            s += `${p.type} ${p.name}`;
            if (p.optional) s = `[${s}]`;
            if (p.variadic) s = `...${s}`;
            return s;
        }).join(', ');
        
        const sig = `${fn.returnType} ${fn.name}(${paramList})`;
        let md = `**${fn.name}**\n\n\`\`\`ctrl\n${sig}\n\`\`\`\n\n`;
        if (fn.description) md += `${fn.description}\n\n`;
        if (fn.docUrl) md += `📖 [Open Documentation](${fn.docUrl})\n`;
        
        return { contents: { kind: MarkupKind.Markdown, value: md } };
    }
    
    /**
     * Handle hover over #uses directive
     */
    private async handleUsesHover(content: string, position: Position): Promise<Hover | null> {
        const lines = content.split('\n');
        const line = lines[position.line];
        
        // Check if line contains #uses
        const usesMatch = line.match(/#uses\s+"([^"]+)"/);
        if (!usesMatch) {
            return null;
        }
        
        const usesPath = usesMatch[1];
        const projectInfo = await this.getProjectInfo();
        
        if (!projectInfo) {
            return {
                contents: {
                    kind: MarkupKind.Markdown,
                    value: `\`#uses "${usesPath}"\`\n\n⚠️ No project info available`
                }
            };
        }
        
        const resolvedPath = resolveUsesPath(usesPath, projectInfo);
        
        if (resolvedPath) {
            return {
                contents: {
                    kind: MarkupKind.Markdown,
                    value: `\`#uses "${usesPath}"\`\n\n✓ Resolved to: \`${resolvedPath}\``
                }
            };
        } else {
            // Not found - show search locations
            const searchPaths = [
                `${projectInfo.projectPath}/scripts/libs/${usesPath}.ctl`,
                `${projectInfo.projectPath}/scripts/${usesPath}.ctl`
            ];
            
            const searchList = searchPaths.map(p => `• \`${p}\``).join('\n');
            
            return {
                contents: {
                    kind: MarkupKind.Markdown,
                    value: `\`#uses "${usesPath}"\`\n\n❌ File not found\n\nSearched in:\n${searchList}`
                }
            };
        }
    }
}
