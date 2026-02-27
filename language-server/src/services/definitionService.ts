/**
 * Definition Service for WinCC OA CTL Language Server
 * 
 * Handles Go-to-Definition for:
 * - #uses directives (navigate to library file)
 * - User-defined symbols (classes, structs, functions, variables)
 * - Member access chains (obj.member.field)
 * - Symbols in dependency files
 */

import { Definition, Location, Position } from 'vscode-languageserver/node';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { pathToFileURL, fileURLToPath } from 'url';
import * as fs from 'fs';
import { SymbolTable, FileSymbols, SymbolKind, BaseSymbol, MemberSymbol, MethodSymbol } from '../symbolTable';
import { getSymbolAtPosition, findFunctionDefinitions, findGlobalVariables } from '../symbolFinder';

// Symbol info returned by getSymbolAtPosition
interface SymbolInfo {
    name: string;
    line: number;
    column: number;
    memberAccess?: { objectName: string };
    memberAccessChain?: string[];
    enumAccess?: { enumName: string };
}
import { resolveUsesPath, getUsesAtPosition, ProjectInfo } from '../usesResolver';
import { SymbolCache } from '../core/symbolCache';

export class DefinitionService {
    private cache: SymbolCache;
    private getProjectInfo: () => Promise<ProjectInfo | null>;
    
    constructor(cache: SymbolCache, getProjectInfo: () => Promise<ProjectInfo | null>) {
        this.cache = cache;
        this.getProjectInfo = getProjectInfo;
    }
    
    /**
     * Handle go-to-definition request
     */
    async handle(doc: TextDocument, position: Position): Promise<Definition | null> {
        const content = doc.getText();
        const offset = doc.offsetAt(position);
        const filePath = fileURLToPath(doc.uri);
        
        // 1. Check for #uses statement (highest priority)
        const usesInfo = getUsesAtPosition(content, offset);
        if (usesInfo) {
            return this.handleUsesDefinition(usesInfo.path);
        }
        
        // 2. Get symbol at cursor position
        const symbolInfo = getSymbolAtPosition(content, offset);
        if (!symbolInfo) {
            return null;
        }
        
        // Get all symbols including dependencies
        const allSymbols = this.cache.getSymbolsWithDependencies(filePath, content);
        if (allSymbols.length === 0) {
            return null;
        }
        
        const symbols = allSymbols[0];  // Main file symbols
        
        // 3. Handle enum member access (Color::RED)
        if (symbolInfo.enumAccess) {
            const result = this.resolveEnumMember(symbolInfo, symbols, doc.uri);
            if (result) return result;
        }
        
        // 4. Handle member access chains
        if (symbolInfo.memberAccessChain && symbolInfo.memberAccessChain.length > 1) {
            const result = await this.resolveMemberAccessChain(symbolInfo, position, allSymbols, filePath);
            if (result) return result;
        } else if (symbolInfo.memberAccess) {
            const result = await this.resolveMemberAccess(symbolInfo, position, allSymbols, filePath);
            if (result) return result;
        }
        
        // 5. Try Symbol Table resolution in CURRENT FILE first
        const resolved = SymbolTable.resolveSymbol(symbolInfo.name, position, symbols);
        if (resolved) {
            return this.createLocation(doc.uri, resolved);
        }
        
        // 6. Search in ALL DEPENDENCIES (from allSymbols)
        // Loop through all dependency symbols (skip [0] which is the main file)
        for (let i = 1; i < allSymbols.length; i++) {
            const depSymbols = allSymbols[i];
            const depResolved = SymbolTable.resolveSymbol(symbolInfo.name, position, depSymbols);
            
            if (depResolved) {
                // Find the file path for this dependency
                const depFilePath = await this.findSymbolFilePath(depSymbols, filePath);
                if (depFilePath) {
                    return this.createLocation(pathToFileURL(depFilePath).href, depResolved);
                }
            }
        }
        
        // 7. Fallback: Search in dependencies using old method
        const depResult = await this.searchInDependencies(symbolInfo.name, position);
        if (depResult) return depResult;
        
        // 7. Legacy fallback: file-based search
        return this.legacySearch(symbolInfo.name, filePath);
    }
    
    /**
     * Resolve enum member access (e.g., Color::RED → go to enum Color definition)
     */
    private resolveEnumMember(symbolInfo: SymbolInfo, symbols: FileSymbols, docUri: string): Definition | null {
        if (!symbolInfo.enumAccess) return null;
        
        const enumName = symbolInfo.enumAccess.enumName;
        
        // Find the enum definition
        const enumSymbol = symbols.enums?.find(e => e.name === enumName);
        if (!enumSymbol) return null;
        
        // Go to enum definition (not the specific member, as they don't have separate locations)
        return this.createLocation(docUri, enumSymbol);
    }
    
    /**
     * Handle #uses directive navigation
     */
    private async handleUsesDefinition(usesPath: string): Promise<Definition | null> {
        const info = await this.getProjectInfo();
        if (!info) return null;
        
        const resolvedPath = resolveUsesPath(usesPath, info);
        if (!resolvedPath || !fs.existsSync(resolvedPath)) return null;
        
        return Location.create(
            pathToFileURL(resolvedPath).href,
            { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } }
        );
    }
    
    /**
     * Resolve member access chain like circle.center.x
     */
    private async resolveMemberAccessChain(
        symbolInfo: SymbolInfo,
        position: Position,
        allSymbols: FileSymbols[],
        currentFilePath: string
    ): Promise<Definition | null> {
        if (!symbolInfo.memberAccessChain) return null;
        
        const chain = symbolInfo.memberAccessChain;
        let currentType: string | null = null;
        
        // Resolve first symbol
        const firstSymbol = SymbolTable.resolveSymbol(chain[0], position, allSymbols[0]);
        if (!firstSymbol || !('dataType' in firstSymbol)) return null;
        
        currentType = firstSymbol.dataType;
        
        // Walk through the chain
        for (let i = 1; i < chain.length; i++) {
            const memberName = chain[i];
            let foundMember: MemberSymbol | MethodSymbol | null = null;
            let foundInSymbols: FileSymbols | null = null;
            
            for (const symbolTable of allSymbols) {
                foundMember = SymbolTable.resolveMemberByType(currentType!, memberName, symbolTable);
                if (foundMember) {
                    foundInSymbols = symbolTable;
                    break;
                }
            }
            
            if (!foundMember) return null;
            
            // If this is the last element, return location
            if (i === chain.length - 1) {
                // Find file containing this symbol
                const targetUri = await this.findSymbolFile(currentType!, memberName, currentFilePath);
                return Location.create(targetUri, {
                    start: { line: foundMember.location.line - 1, character: foundMember.location.column },
                    end: { line: foundMember.location.line - 1, character: foundMember.location.column + foundMember.name.length }
                });
            }
            
            // Update type for next iteration
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
    private async resolveMemberAccess(
        symbolInfo: SymbolInfo,
        position: Position,
        allSymbols: FileSymbols[],
        currentFilePath: string
    ): Promise<Definition | null> {
        if (!symbolInfo.memberAccess) return null;
        
        const objectName = symbolInfo.memberAccess.objectName;
        const objSymbol = SymbolTable.resolveSymbol(objectName, position, allSymbols[0]);
        
        if (!objSymbol || !('dataType' in objSymbol)) return null;
        
        const typeName = objSymbol.dataType;
        
        for (const symbolTable of allSymbols) {
            const resolved = SymbolTable.resolveMemberByType(typeName, symbolInfo.name, symbolTable);
            if (resolved) {
                const targetUri = await this.findSymbolFile(typeName, symbolInfo.name, currentFilePath);
                return Location.create(targetUri, {
                    start: { line: resolved.location.line - 1, character: resolved.location.column },
                    end: { line: resolved.location.line - 1, character: resolved.location.column + resolved.name.length }
                });
            }
        }
        
        return null;
    }
    
    /**
     * Find which file contains a symbol (for cross-file navigation)
     */
    private async findSymbolFile(typeName: string, memberName: string, currentFilePath: string): Promise<string> {
        // Default to current file
        let targetUri = pathToFileURL(currentFilePath).href;
        
        const info = await this.getProjectInfo();
        if (!info) return targetUri;
        
        // Extract #uses from current file
        const content = fs.readFileSync(currentFilePath, 'utf-8');
        const usesPaths = this.extractUsesDirectives(content);
        
        for (const usesPath of usesPaths) {
            const resolvedPath = resolveUsesPath(usesPath, info);
            if (!resolvedPath) continue;
            
            const depSymbols = this.cache.getSymbols(resolvedPath);
            if (!depSymbols) continue;
            
            const member = SymbolTable.resolveMemberByType(typeName, memberName, depSymbols);
            if (member) {
                return pathToFileURL(resolvedPath).href;
            }
        }
        
        return targetUri;
    }
    
    /**
     * Find the file path for a given FileSymbols object
     * Matches FileSymbols against cached files from #uses dependencies
     */
    private async findSymbolFilePath(depSymbols: FileSymbols, currentFilePath: string): Promise<string | null> {
        const info = await this.getProjectInfo();
        if (!info) return null;
        
        // Extract #uses from current file
        const content = fs.readFileSync(currentFilePath, 'utf-8');
        const usesPaths = this.extractUsesDirectives(content);
        
        // Try to match the depSymbols with one of the resolved #uses paths
        for (const usesPath of usesPaths) {
            const resolvedPath = resolveUsesPath(usesPath, info);
            if (!resolvedPath) continue;
            
            // Check if this is the file by comparing cached symbols
            const cachedSymbols = this.cache.getSymbols(resolvedPath);
            if (cachedSymbols === depSymbols) {
                return resolvedPath;
            }
        }
        
        return null;
    }
    
    /**
     * Search for symbol in dependency files
     */
    private async searchInDependencies(symbolName: string, position: Position): Promise<Definition | null> {
        const info = await this.getProjectInfo();
        if (!info) return null;
        
        // Search in script paths
        const scriptDirs = [
            `${info.projectPath}/scripts/libs`,
            ...info.subProjects.map(sp => `${sp}/scripts/libs`)
        ];
        
        for (const dir of scriptDirs) {
            if (!fs.existsSync(dir)) continue;
            
            const files = fs.readdirSync(dir).filter(f => f.endsWith('.ctl'));
            for (const file of files) {
                const filePath = `${dir}/${file}`;
                const symbols = this.cache.getSymbols(filePath);
                if (!symbols) continue;
                
                const resolved = SymbolTable.resolveSymbol(symbolName, position, symbols);
                if (resolved) {
                    return this.createLocation(pathToFileURL(filePath).href, resolved);
                }
            }
        }
        
        return null;
    }
    
    /**
     * Legacy search using file-based function finder
     */
    private async legacySearch(symbolName: string, currentFilePath: string): Promise<Definition | null> {
        const info = await this.getProjectInfo();
        if (!info) return null;
        
        const scriptDirs = [
            `${info.projectPath}/scripts/libs`,
            ...info.subProjects.map(sp => `${sp}/scripts/libs`)
        ];
        
        for (const dir of scriptDirs) {
            if (!fs.existsSync(dir)) continue;
            
            const files = fs.readdirSync(dir).filter(f => f.endsWith('.ctl'));
            for (const file of files) {
                const filePath = `${dir}/${file}`;
                const functions = findFunctionDefinitions(filePath);
                const match = functions.find(f => f.name === symbolName);
                
                if (match) {
                    return Location.create(
                        pathToFileURL(filePath).href,
                        {
                            start: { line: match.line - 1, character: match.column },
                            end: { line: match.line - 1, character: match.column + match.name.length }
                        }
                    );
                }
            }
        }
        
        return null;
    }
    
    /**
     * Create Location from resolved symbol
     */
    private createLocation(uri: string, symbol: BaseSymbol): Location {
        return Location.create(uri, {
            start: { line: symbol.location.line - 1, character: symbol.location.column },
            end: { line: symbol.location.line - 1, character: symbol.location.column + symbol.name.length }
        });
    }
    
    /**
     * Extract #uses directives from content
     */
    private extractUsesDirectives(content: string): string[] {
        const uses: string[] = [];
        const lines = content.split('\n');
        for (const line of lines) {
            const match = line.match(/#uses\s+["']([^"']+)["']/);
            if (match) uses.push(match[1]);
        }
        return uses;
    }
}
