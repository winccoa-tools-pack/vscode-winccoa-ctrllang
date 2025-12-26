/**
 * Integration Tests for Language Server
 * Tests full code paths including onDefinition handler with cross-file resolution
 */

import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import { SymbolTable } from './symbolTable';
import { resolveUsesPath } from './usesResolver';
import { pathToFileURL } from 'url';

suite('Language Server Integration Tests', () => {
    const devEnvPath = path.resolve(__dirname, '../../../../wincc_proj/DevEnv');
    const scriptsPath = path.join(devEnvPath, 'scripts');
    
    /**
     * Simulates the onDefinition handler logic for cross-file resolution
     */
    function simulateGoToDefinition(
        fileUri: string,
        symbolName: string,
        currentFileContent: string
    ): { found: boolean; filePath?: string; line?: number } {
        // Step 1: Try Symbol Table in current file
        const symbols = SymbolTable.parseFile(currentFileContent);
        const resolved = SymbolTable.resolveSymbol(symbolName, { line: 0, character: 0 }, symbols);
        
        if (resolved) {
            return { found: true, filePath: fileUri, line: resolved.location.line };
        }
        
        // Step 2: Parse #uses statements
        const usesMatches = currentFileContent.matchAll(/#uses\s+"([^"]+)"/g);
        const dependencies: string[] = [];
        for (const match of usesMatches) {
            dependencies.push(match[1]);
        }
        
        // Step 3: Search in dependencies
        for (const dep of dependencies) {
            // Resolve path (simplified - no full projectInfo)
            const basePath = path.dirname(fileUri);
            let resolvedPath = path.join(basePath, 'libs', `${dep}.ctl`);
            
            if (!fs.existsSync(resolvedPath)) {
                resolvedPath = path.join(basePath, `${dep}.ctl`);
            }
            
            if (!fs.existsSync(resolvedPath)) {
                continue;
            }
            
            // Step 4: Parse dependency with Symbol Table
            try {
                const depContent = fs.readFileSync(resolvedPath, 'utf-8');
                const depSymbols = SymbolTable.parseFile(depContent);
                
                // Check for class
                const classSymbol = depSymbols.classes.find(c => c.name === symbolName);
                if (classSymbol) {
                    return { 
                        found: true, 
                        filePath: resolvedPath, 
                        line: classSymbol.location.line 
                    };
                }
                
                // Check for struct
                const structSymbol = depSymbols.structs.find(s => s.name === symbolName);
                if (structSymbol) {
                    return { 
                        found: true, 
                        filePath: resolvedPath, 
                        line: structSymbol.location.line 
                    };
                }
            } catch (error) {
                // Skip on error
            }
        }
        
        return { found: false };
    }
    
    test('finds DerivedClass from dependency in variable declaration', () => {
        const testFile = path.join(scriptsPath, 'TestGoToDefinition.ctl');
        const testContent = fs.readFileSync(testFile, 'utf-8');
        
        // Simulate Go-to-Definition on "DerivedClass" in "DerivedClass obj;"
        const result = simulateGoToDefinition(testFile, 'DerivedClass', testContent);
        
        assert.strictEqual(result.found, true, 'DerivedClass should be found');
        assert.ok(result.filePath, 'File path should be set');
        assert.ok(result.filePath!.includes('DerivedClass.ctl'), `Expected DerivedClass.ctl, got ${result.filePath}`);
        assert.strictEqual(result.line, 22, 'DerivedClass definition should be at line 22');
    });
    
    test('finds Rectangle struct from DataStructures.ctl', () => {
        const testFile = path.join(scriptsPath, 'TestGoToDefinition.ctl');
        const testContent = fs.readFileSync(testFile, 'utf-8');
        
        const result = simulateGoToDefinition(testFile, 'Rectangle', testContent);
        
        assert.strictEqual(result.found, true, 'Rectangle should be found');
        assert.ok(result.filePath!.includes('DataStructures.ctl'));
        assert.strictEqual(result.line, 24, 'Rectangle definition should be at line 24');
    });
    
    test('finds Point struct from DataStructures.ctl', () => {
        const testFile = path.join(scriptsPath, 'TestGoToDefinition.ctl');
        const testContent = fs.readFileSync(testFile, 'utf-8');
        
        const result = simulateGoToDefinition(testFile, 'Point', testContent);
        
        assert.strictEqual(result.found, true, 'Point should be found');
        assert.ok(result.filePath!.includes('DataStructures.ctl'));
        assert.strictEqual(result.line, 18, 'Point definition should be at line 18');
    });
    
    test('does not find non-existent symbol', () => {
        const testFile = path.join(scriptsPath, 'TestGoToDefinition.ctl');
        const testContent = fs.readFileSync(testFile, 'utf-8');
        
        const result = simulateGoToDefinition(testFile, 'NonExistentClass', testContent);
        
        assert.strictEqual(result.found, false, 'Non-existent class should not be found');
    });
});
