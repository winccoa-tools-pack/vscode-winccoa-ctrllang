/**
 * Language Server E2E Tests
 * 
 * End-to-end tests using real CTL fixture files from TestLab project.
 */

import * as assert from 'assert';
import * as path from 'path';
import * as fs from 'fs';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { Position } from 'vscode-languageserver';
import { SymbolTable } from '../../src/symbolTable';

// Helper to create TextDocument from file
function createDocument(filePath: string): TextDocument {
    const content = fs.readFileSync(filePath, 'utf-8');
    return TextDocument.create(filePath, 'ctl', 1, content);
}

const fixturesPath = path.join(__dirname, '../../../test-workspace/scripts/fixtures');

suite('Language Server E2E Tests', () => {
    
    test('Go-to-Definition: Local variable in function', () => {
        const testFile = path.join(fixturesPath, 'TestGoToDefinition.ctl');
        assert.ok(fs.existsSync(testFile), 'Test file not found: ' + testFile);
        
        const doc = createDocument(testFile);
        const content = doc.getText();
        const symbols = SymbolTable.parseFile(content);
        
        const lines = content.split('\n');
        const returnLineIdx = lines.findIndex(l => l.trim() === 'return doubled;');
        assert.ok(returnLineIdx >= 0, 'Test line not found');
        
        const charIdx = lines[returnLineIdx].indexOf('doubled');
        const position: Position = { line: returnLineIdx, character: charIdx + 1 };
        
        const symbol = SymbolTable.resolveSymbol('doubled', position, symbols);
        
        assert.ok(symbol, 'Should find doubled variable');
        assert.strictEqual(symbol.name, 'doubled');
        if (symbol && 'dataType' in symbol) {
            assert.strictEqual(symbol.dataType, 'int');
        }
    });
    
    test('Go-to-Definition: Function parameter', () => {
        const testFile = path.join(fixturesPath, 'TestGoToDefinition.ctl');
        const doc = createDocument(testFile);
        const content = doc.getText();
        const symbols = SymbolTable.parseFile(content);
        
        const lines = content.split('\n');
        const usageLineIdx = lines.findIndex(l => l.includes('int result = a + b;'));
        assert.ok(usageLineIdx >= 0, 'Test line not found');
        
        const charIdx = lines[usageLineIdx].indexOf('a +');
        const position: Position = { line: usageLineIdx, character: charIdx };
        
        const symbol = SymbolTable.resolveSymbol('a', position, symbols);
        
        assert.ok(symbol, 'Should find parameter a');
        assert.strictEqual(symbol.name, 'a');
        if (symbol && 'dataType' in symbol) {
            assert.strictEqual(symbol.dataType, 'int');
        }
    });
    
    test('Go-to-Definition: Global variable', () => {
        const testFile = path.join(fixturesPath, 'TestGoToDefinition.ctl');
        const doc = createDocument(testFile);
        const content = doc.getText();
        const symbols = SymbolTable.parseFile(content);
        
        const lines = content.split('\n');
        const usageLineIdx = lines.findIndex(l => l.includes('g_counter = 10;'));
        assert.ok(usageLineIdx >= 0, 'Test line not found');
        
        const charIdx = lines[usageLineIdx].indexOf('g_counter');
        const position: Position = { line: usageLineIdx, character: charIdx + 1 };
        
        const symbol = SymbolTable.resolveSymbol('g_counter', position, symbols);
        
        assert.ok(symbol, 'Should find global variable g_counter');
        assert.strictEqual(symbol.name, 'g_counter');
        if (symbol && 'dataType' in symbol) {
            assert.strictEqual(symbol.dataType, 'int');
        }
    });
    
    test('Go-to-Definition: Local variable in main()', () => {
        const testFile = path.join(fixturesPath, 'TestHover.ctl');
        const doc = createDocument(testFile);
        const content = doc.getText();
        const symbols = SymbolTable.parseFile(content);
        
        // Find main() function
        const mainFunc = symbols.functions.find(f => f.name === 'main');
        assert.ok(mainFunc, 'Should find main() function');
        assert.ok(mainFunc.localVariables && mainFunc.localVariables.length > 0, 'main() should have local variables');
        
        // Find line where 'calc' is used: "int result = calc.getResult();"
        const lines = content.split('\n');
        const usageLineIdx = lines.findIndex(l => l.includes('int result = calc.getResult()'));
        assert.ok(usageLineIdx >= 0, 'Test line not found');
        
        const charIdx = lines[usageLineIdx].indexOf('calc.getResult');
        const position: Position = { line: usageLineIdx, character: charIdx + 1 };
        
        const symbol = SymbolTable.resolveSymbol('calc', position, symbols);
        
        assert.ok(symbol, 'Should find local variable calc');
        assert.strictEqual(symbol.name, 'calc');
        if (symbol && 'dataType' in symbol) {
            assert.strictEqual(symbol.dataType, 'Calculator');
        }
    });
    
    test('Go-to-Definition: Method call via member access', () => {
        const testFile = path.join(fixturesPath, 'TestGoToDefinition.ctl');
        const doc = createDocument(testFile);
        const content = doc.getText();
        const symbols = SymbolTable.parseFile(content);
        
        // Find line: "int deviceId = manager.createDevice(testName, 1);"
        const lines = content.split('\n');
        const lineIdx = lines.findIndex(l => l.includes('manager.createDevice(testName'));
        assert.ok(lineIdx >= 0, 'Test line not found');
        
        // Position on 'createDevice'
        const charIdx = lines[lineIdx].indexOf('createDevice');
        const position: Position = { line: lineIdx, character: charIdx };
        
        // First resolve 'manager' to get its type
        const managerSymbol = SymbolTable.resolveSymbol('manager', position, symbols);
        assert.ok(managerSymbol, 'Should find manager variable');
        assert.ok('dataType' in managerSymbol, 'manager should have dataType');
        assert.strictEqual(managerSymbol.dataType, 'DeviceManager');
        
        // Find the DeviceManager class
        const deviceMgrClass = symbols.classes.find(c => c.name === 'DeviceManager');
        assert.ok(deviceMgrClass, 'Should find DeviceManager class');
        
        // Find the createDevice method
        const createDeviceMethod = deviceMgrClass.methods.find(m => m.name === 'createDevice');
        assert.ok(createDeviceMethod, 'Should find createDevice method');
        assert.strictEqual(createDeviceMethod.returnType, 'int');
        assert.strictEqual(createDeviceMethod.parameters.length, 2);
        assert.strictEqual(createDeviceMethod.parameters[0].name, 'deviceName');
        assert.strictEqual(createDeviceMethod.parameters[1].name, 'deviceType');
    });
    
    test('Go-to-Definition: Another method call via member access', () => {
        const testFile = path.join(fixturesPath, 'TestGoToDefinition.ctl');
        const doc = createDocument(testFile);
        const content = doc.getText();
        const symbols = SymbolTable.parseFile(content);
        
        // Find line: "bool configValid = manager.validateConfig(config);"
        const lines = content.split('\n');
        const lineIdx = lines.findIndex(l => l.includes('manager.validateConfig(config)'));
        assert.ok(lineIdx >= 0, 'Test line not found');
        
        // Position on 'validateConfig'
        const charIdx = lines[lineIdx].indexOf('validateConfig');
        const position: Position = { line: lineIdx, character: charIdx };
        
        // Resolve manager type
        const managerSymbol = SymbolTable.resolveSymbol('manager', position, symbols);
        assert.ok(managerSymbol && 'dataType' in managerSymbol);
        
        // Find validateConfig method
        const deviceMgrClass = symbols.classes.find(c => c.name === 'DeviceManager');
        const validateMethod = deviceMgrClass?.methods.find(m => m.name === 'validateConfig');
        
        assert.ok(validateMethod, 'Should find validateConfig method');
        assert.strictEqual(validateMethod.returnType, 'bool');
        assert.strictEqual(validateMethod.parameters.length, 1);
        assert.strictEqual(validateMethod.parameters[0].dataType, 'DeviceConfig');
    });
});
