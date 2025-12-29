/**
 * Symbol Cache for WinCC OA CTL Language Server
 * 
 * Provides centralized caching of parsed symbols with:
 * - Automatic invalidation based on file modification time
 * - Dependency resolution via #uses directives
 * - Memory-efficient caching
 */

import * as fs from 'fs';
import * as path from 'path';
import { SymbolTable, FileSymbols } from '../symbolTable';
import { resolveUsesPath, ProjectInfo } from '../usesResolver';

interface CachedFile {
    symbols: FileSymbols;
    mtime: number;
    usesDirectives: string[];  // Raw #uses paths for dependency tracking
}

export class SymbolCache {
    private cache = new Map<string, CachedFile>();
    private projectInfo: ProjectInfo | null = null;
    
    /**
     * Set project info for #uses resolution
     */
    setProjectInfo(info: ProjectInfo | null): void {
        this.projectInfo = info;
    }
    
    /**
     * Get symbols for a file, using cache if valid
     */
    getSymbols(filePath: string): FileSymbols | null {
        try {
            if (!fs.existsSync(filePath)) {
                return null;
            }
            
            const mtime = fs.statSync(filePath).mtimeMs;
            const cached = this.cache.get(filePath);
            
            // Cache hit - file not modified
            if (cached && cached.mtime === mtime) {
                return cached.symbols;
            }
            
            // Cache miss or stale - parse file
            const content = fs.readFileSync(filePath, 'utf-8');
            const symbols = SymbolTable.parseFile(content);
            const usesDirectives = this.extractUsesDirectives(content);
            
            this.cache.set(filePath, { symbols, mtime, usesDirectives });
            return symbols;
            
        } catch (error) {
            console.error(`[SymbolCache] Error parsing ${filePath}:`, error);
            return null;
        }
    }
    
    /**
     * Get symbols from file content directly (for unsaved documents)
     */
    getSymbolsFromContent(content: string, uri?: string): FileSymbols {
        const symbols = SymbolTable.parseFile(content);
        
        // Optionally cache if URI provided (for open documents)
        if (uri) {
            const usesDirectives = this.extractUsesDirectives(content);
            // Use current time as mtime for unsaved content
            this.cache.set(uri, { symbols, mtime: Date.now(), usesDirectives });
        }
        
        return symbols;
    }
    
    /**
     * Get symbols with all dependencies resolved
     * Returns array of [mainSymbols, ...dependencySymbols]
     */
    getSymbolsWithDependencies(filePath: string, content?: string): FileSymbols[] {
        const result: FileSymbols[] = [];
        
        // Get main file symbols
        const mainSymbols = content 
            ? this.getSymbolsFromContent(content, filePath)
            : this.getSymbols(filePath);
            
        if (!mainSymbols) {
            return result;
        }
        
        result.push(mainSymbols);
        
        // Resolve dependencies
        if (this.projectInfo) {
            const usesDirectives = content 
                ? this.extractUsesDirectives(content)
                : this.cache.get(filePath)?.usesDirectives || [];
                
            for (const usesPath of usesDirectives) {
                const resolvedPath = resolveUsesPath(usesPath, this.projectInfo);
                if (resolvedPath) {
                    const depSymbols = this.getSymbols(resolvedPath);
                    if (depSymbols) {
                        result.push(depSymbols);
                    }
                }
            }
        }
        
        return result;
    }
    
    /**
     * Invalidate cache for a specific file
     */
    invalidate(filePath: string): void {
        this.cache.delete(filePath);
    }
    
    /**
     * Invalidate all cached files
     */
    invalidateAll(): void {
        this.cache.clear();
    }
    
    /**
     * Get cache statistics (for debugging)
     */
    getStats(): { size: number; files: string[] } {
        return {
            size: this.cache.size,
            files: Array.from(this.cache.keys())
        };
    }
    
    /**
     * Extract #uses directives from file content
     */
    private extractUsesDirectives(content: string): string[] {
        const uses: string[] = [];
        const lines = content.split('\n');
        
        for (const line of lines) {
            const match = line.match(/#uses\s+["']([^"']+)["']/);
            if (match) {
                uses.push(match[1]);
            }
        }
        
        return uses;
    }
}

// Singleton instance for global access
let globalCache: SymbolCache | null = null;

export function getSymbolCache(): SymbolCache {
    if (!globalCache) {
        globalCache = new SymbolCache();
    }
    return globalCache;
}

export function resetSymbolCache(): void {
    globalCache = null;
}
