/**
 * Cross-File Go-to-Definition Integration Tests
 * 
 * Tests that Go-to-Definition works for symbols imported via #uses directives.
 * This is a critical feature for navigating between CTL files in real projects.
 */

import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import { Position } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { DefinitionService } from '../../src/services/definitionService';
import { SymbolCache } from '../../src/core/symbolCache';
import { ProjectInfo } from '../../src/usesResolver';
import { pathToFileURL, fileURLToPath } from 'url';

suite('Cross-File Go-to-Definition Tests', () => {
    const testWorkspacePath = path.resolve(__dirname, '../../../test-workspace');
    const fixturesPath = path.join(testWorkspacePath, 'scripts', 'fixtures');
    const libsPath = path.join(testWorkspacePath, 'scripts', 'libs');
    
    let cache: SymbolCache;
    let definitionService: DefinitionService;
    
    // Mock project info
    const projectInfo: ProjectInfo = {
        projectPath: testWorkspacePath,
        projectName: 'test-workspace',
        configPath: path.join(testWorkspacePath, 'config', 'config'),
        logPath: path.join(testWorkspacePath, 'log'),
        installPath: '/opt/WinCC_OA/3.20',
        version: '3.20',
        subProjects: []
    };
    
    setup(() => {
        cache = new SymbolCache();
        cache.setProjectInfo(projectInfo);
        
        definitionService = new DefinitionService(
            cache,
            async () => projectInfo
        );
    });
    
    test('Go-to-Definition: Function from #uses library (add)', async () => {
        const testFile = path.join(fixturesPath, 'TestCrossFileGoto.ctl');
        assert.ok(fs.existsSync(testFile), `Test file not found: ${testFile}`);
        
        const content = fs.readFileSync(testFile, 'utf-8');
        const doc = TextDocument.create(
            pathToFileURL(testFile).href,
            'ctl',
            1,
            content
        );
        
        // Find line with "int sum = add(5, 10);"
        const lines = content.split('\n');
        const addLineIdx = lines.findIndex(l => l.includes('int sum = add(5, 10)'));
        assert.ok(addLineIdx >= 0, 'Test line with add() not found');
        
        const addCharIdx = lines[addLineIdx].indexOf('add(');
        const position: Position = { line: addLineIdx, character: addCharIdx + 1 };
        
        // Execute
        const result = await definitionService.handle(doc, position);
        
        // Assert
        assert.ok(result, 'Should find definition for add()');
        
        if (result && 'uri' in result) {
            const resultPath = fileURLToPath(result.uri);
            assert.ok(
                resultPath.includes('MathLibrary.ctl'),
                `Expected MathLibrary.ctl, got: ${resultPath}`
            );
            
            // Check line number (add function is at line 6 in MathLibrary.ctl)
            assert.strictEqual(
                result.range.start.line,
                5, // 0-based, so line 6 = index 5
                'Should jump to line 6 (add function definition)'
            );
        } else {
            assert.fail('Result should be a Location');
        }
    });
    
    test('Go-to-Definition: Function from #uses library (multiply)', async () => {
        const testFile = path.join(fixturesPath, 'TestCrossFileGoto.ctl');
        const content = fs.readFileSync(testFile, 'utf-8');
        const doc = TextDocument.create(
            pathToFileURL(testFile).href,
            'ctl',
            1,
            content
        );
        
        // Find line with "int product = multiply(3, 7);"
        const lines = content.split('\n');
        const multiplyLineIdx = lines.findIndex(l => l.includes('multiply(3, 7)'));
        assert.ok(multiplyLineIdx >= 0, 'Test line with multiply() not found');
        
        const multiplyCharIdx = lines[multiplyLineIdx].indexOf('multiply(');
        const position: Position = { line: multiplyLineIdx, character: multiplyCharIdx + 1 };
        
        // Execute
        const result = await definitionService.handle(doc, position);
        
        // Assert
        assert.ok(result, 'Should find definition for multiply()');
        
        if (result && 'uri' in result) {
            const resultPath = fileURLToPath(result.uri);
            assert.ok(resultPath.includes('MathLibrary.ctl'));
            
            // multiply function is at line 18 in MathLibrary.ctl
            assert.strictEqual(
                result.range.start.line,
                17, // 0-based
                'Should jump to line 18 (multiply function definition)'
            );
        } else {
            assert.fail('Result should be a Location');
        }
    });
    
    test('Go-to-Definition: Global variable from #uses library', async () => {
        const testFile = path.join(fixturesPath, 'TestCrossFileGoto.ctl');
        const content = fs.readFileSync(testFile, 'utf-8');
        const doc = TextDocument.create(
            pathToFileURL(testFile).href,
            'ctl',
            1,
            content
        );
        
        // Find line with "g_mathCallCount = g_mathCallCount + 1;"
        const lines = content.split('\n');
        const globalLineIdx = lines.findIndex(l => l.includes('g_mathCallCount = g_mathCallCount + 1'));
        assert.ok(globalLineIdx >= 0, 'Test line with g_mathCallCount not found');
        
        // Click on first occurrence of g_mathCallCount
        const globalCharIdx = lines[globalLineIdx].indexOf('g_mathCallCount');
        const position: Position = { line: globalLineIdx, character: globalCharIdx + 1 };
        
        // Execute
        const result = await definitionService.handle(doc, position);
        
        // Assert
        assert.ok(result, 'Should find definition for g_mathCallCount');
        
        if (result && 'uri' in result) {
            const resultPath = fileURLToPath(result.uri);
            assert.ok(resultPath.includes('MathLibrary.ctl'));
            
            // g_mathCallCount is at line 35 in MathLibrary.ctl
            assert.strictEqual(
                result.range.start.line,
                34, // 0-based
                'Should jump to line 35 (global variable declaration)'
            );
        } else {
            assert.fail('Result should be a Location');
        }
    });
    
    test('Go-to-Definition: Recursive function call (factorial)', async () => {
        const testFile = path.join(fixturesPath, 'TestCrossFileGoto.ctl');
        const content = fs.readFileSync(testFile, 'utf-8');
        
        // Add a line that calls factorial
        const modifiedContent = content.replace(
            'DebugN("Call count: " + g_mathCallCount);',
            'int fact = factorial(5);\n    DebugN("Call count: " + g_mathCallCount);'
        );
        
        const doc = TextDocument.create(
            pathToFileURL(testFile).href,
            'ctl',
            1,
            modifiedContent
        );
        
        const lines = modifiedContent.split('\n');
        const factLineIdx = lines.findIndex(l => l.includes('factorial(5)'));
        assert.ok(factLineIdx >= 0, 'Modified line with factorial() not found');
        
        const factCharIdx = lines[factLineIdx].indexOf('factorial(');
        const position: Position = { line: factLineIdx, character: factCharIdx + 1 };
        
        // Execute
        const result = await definitionService.handle(doc, position);
        
        // Assert
        assert.ok(result, 'Should find definition for factorial()');
        
        if (result && 'uri' in result) {
            const resultPath = fileURLToPath(result.uri);
            assert.ok(resultPath.includes('MathLibrary.ctl'));
            
            // factorial function is at line 24 in MathLibrary.ctl
            assert.strictEqual(
                result.range.start.line,
                23, // 0-based
                'Should jump to line 24 (factorial function definition)'
            );
        } else {
            assert.fail('Result should be a Location');
        }
    });
    
    test('Go-to-Definition: Non-existent function returns null', async () => {
        const testFile = path.join(fixturesPath, 'TestCrossFileGoto.ctl');
        const content = fs.readFileSync(testFile, 'utf-8');
        
        // Add a line with non-existent function
        const modifiedContent = content.replace(
            'DebugN("Call count: " + g_mathCallCount);',
            'nonExistentFunc();\n    DebugN("Call count: " + g_mathCallCount);'
        );
        
        const doc = TextDocument.create(
            pathToFileURL(testFile).href,
            'ctl',
            1,
            modifiedContent
        );
        
        const lines = modifiedContent.split('\n');
        const lineIdx = lines.findIndex(l => l.includes('nonExistentFunc()'));
        const charIdx = lines[lineIdx].indexOf('nonExistentFunc');
        const position: Position = { line: lineIdx, character: charIdx + 1 };
        
        // Execute
        const result = await definitionService.handle(doc, position);
        
        // Assert - should return null for non-existent symbol
        assert.strictEqual(result, null, 'Should return null for non-existent function');
    });
    
    // ========================================================================
    // SUBDIRECTORY TESTS
    // Critical: These tests validate that Go-to-Definition works for libraries
    // in subdirectories (e.g., libs/Utils/StringHelper.ctl), not just top-level
    // libs/*.ctl files. This was the original bug!
    // ========================================================================
    
    test('Go-to-Definition: Function from subdirectory library (toUpperCase)', async () => {
        const testFile = path.join(fixturesPath, 'TestSubdirectoryGoto.ctl');
        assert.ok(fs.existsSync(testFile), `Test file not found: ${testFile}`);
        
        const content = fs.readFileSync(testFile, 'utf-8');
        const doc = TextDocument.create(
            pathToFileURL(testFile).href,
            'ctl',
            1,
            content
        );
        
        // Find line with "string upper = toUpperCase(text);"
        const lines = content.split('\n');
        const lineIdx = lines.findIndex(l => l.includes('toUpperCase('));
        assert.ok(lineIdx >= 0, 'Test line with toUpperCase() not found');
        
        const charIdx = lines[lineIdx].indexOf('toUpperCase(');
        const position: Position = { line: lineIdx, character: charIdx + 1 };
        
        // Execute
        const result = await definitionService.handle(doc, position);
        
        // Assert
        assert.ok(result, 'Should find definition for toUpperCase()');
        
        if (result && 'uri' in result) {
            const resultPath = fileURLToPath(result.uri);
            assert.ok(
                resultPath.includes('Utils/StringHelper.ctl') || resultPath.includes('Utils\\StringHelper.ctl'),
                `Expected Utils/StringHelper.ctl, got: ${resultPath}`
            );
            
            // toUpperCase function is at line 6 in StringHelper.ctl
            assert.strictEqual(
                result.range.start.line,
                5, // 0-based
                'Should jump to line 6 (toUpperCase function definition)'
            );
        } else {
            assert.fail('Result should be a Location');
        }
    });
    
    test('Go-to-Definition: Global variable from subdirectory library', async () => {
        const testFile = path.join(fixturesPath, 'TestSubdirectoryGoto.ctl');
        const content = fs.readFileSync(testFile, 'utf-8');
        const doc = TextDocument.create(
            pathToFileURL(testFile).href,
            'ctl',
            1,
            content
        );
        
        // Find line with "g_stringOpCount = g_stringOpCount + 1;"
        const lines = content.split('\n');
        const lineIdx = lines.findIndex(l => l.includes('g_stringOpCount = g_stringOpCount'));
        assert.ok(lineIdx >= 0, 'Test line with g_stringOpCount not found');
        
        const charIdx = lines[lineIdx].indexOf('g_stringOpCount');
        const position: Position = { line: lineIdx, character: charIdx + 1 };
        
        // Execute
        const result = await definitionService.handle(doc, position);
        
        // Assert
        assert.ok(result, 'Should find definition for g_stringOpCount');
        
        if (result && 'uri' in result) {
            const resultPath = fileURLToPath(result.uri);
            assert.ok(
                resultPath.includes('Utils/StringHelper.ctl') || resultPath.includes('Utils\\StringHelper.ctl'),
                `Expected Utils/StringHelper.ctl, got: ${resultPath}`
            );
            
            // g_stringOpCount is at line 35 in StringHelper.ctl
            assert.strictEqual(
                result.range.start.line,
                34, // 0-based
                'Should jump to line 35 (global variable declaration)'
            );
        } else {
            assert.fail('Result should be a Location');
        }
    });
    
    test('Go-to-Definition: Another function from subdirectory (startsWith)', async () => {
        const testFile = path.join(fixturesPath, 'TestSubdirectoryGoto.ctl');
        const content = fs.readFileSync(testFile, 'utf-8');
        const doc = TextDocument.create(
            pathToFileURL(testFile).href,
            'ctl',
            1,
            content
        );
        
        // Find line with "bool starts = startsWith(text, "Hello");"
        const lines = content.split('\n');
        const lineIdx = lines.findIndex(l => l.includes('startsWith('));
        assert.ok(lineIdx >= 0, 'Test line with startsWith() not found');
        
        const charIdx = lines[lineIdx].indexOf('startsWith(');
        const position: Position = { line: lineIdx, character: charIdx + 1 };
        
        // Execute
        const result = await definitionService.handle(doc, position);
        
        // Assert
        assert.ok(result, 'Should find definition for startsWith()');
        
        if (result && 'uri' in result) {
            const resultPath = fileURLToPath(result.uri);
            assert.ok(
                resultPath.includes('Utils/StringHelper.ctl') || resultPath.includes('Utils\\StringHelper.ctl'),
                `Expected Utils/StringHelper.ctl, got: ${resultPath}`
            );
            
            // startsWith function is at line 24 in StringHelper.ctl
            assert.strictEqual(
                result.range.start.line,
                23, // 0-based
                'Should jump to line 24 (startsWith function definition)'
            );
        } else {
            assert.fail('Result should be a Location');
        }
    });
});
