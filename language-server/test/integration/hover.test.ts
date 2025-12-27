/**
 * Hover E2E Tests
 * 
 * Tests hover information for functions, methods, variables, and classes.
 */

import * as assert from 'assert';
import * as path from 'path';
import * as fs from 'fs';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { Position } from 'vscode-languageserver';
import { SymbolTable, SymbolKind } from '../../src/symbolTable';
import { getSymbolAtPosition } from '../../src/symbolFinder';

// Helper to create TextDocument from file
function createDocument(filePath: string): TextDocument {
    const content = fs.readFileSync(filePath, 'utf-8');
    return TextDocument.create(filePath, 'ctl', 1, content);
}

const fixturesPath = path.join(__dirname, '../../../test-workspace/scripts/fixtures');

suite('Hover Information Tests', () => {
    
    test('Hover: Function signature with parameters', () => {
        const testFile = path.join(fixturesPath, 'TestHover.ctl');
        const doc = createDocument(testFile);
        const content = doc.getText();
        const symbols = SymbolTable.parseFile(content);
        
        // Find 'add' function
        const addFunc = symbols.functions.find(f => f.name === 'add');
        assert.ok(addFunc, 'Should find add function');
        assert.strictEqual(addFunc.returnType, 'int', 'Return type should be int');
        assert.ok(addFunc.parameters, 'Should have parameters');
        assert.strictEqual(addFunc.parameters.length, 2, 'Should have 2 parameters');
        
        // Verify parameter details
        assert.strictEqual(addFunc.parameters[0].name, 'a');
        assert.strictEqual(addFunc.parameters[0].dataType, 'int');
        assert.strictEqual(addFunc.parameters[1].name, 'b');
        assert.strictEqual(addFunc.parameters[1].dataType, 'int');
    });
    
    test('Hover: Multiple function signatures', () => {
        const testFile = path.join(fixturesPath, 'TestHover.ctl');
        const doc = createDocument(testFile);
        const content = doc.getText();
        const symbols = SymbolTable.parseFile(content);
        
        // Test multiply(float x, float y)
        const multiplyFunc = symbols.functions.find(f => f.name === 'multiply');
        assert.ok(multiplyFunc, 'Should find multiply function');
        assert.strictEqual(multiplyFunc.returnType, 'float');
        assert.strictEqual(multiplyFunc.parameters.length, 2);
        assert.strictEqual(multiplyFunc.parameters[0].dataType, 'float');
        assert.strictEqual(multiplyFunc.parameters[0].name, 'x');
        
        // Test concatenate(string s1, string s2)
        const concatFunc = symbols.functions.find(f => f.name === 'concatenate');
        assert.ok(concatFunc, 'Should find concatenate function');
        assert.strictEqual(concatFunc.returnType, 'string');
        assert.strictEqual(concatFunc.parameters.length, 2);
        assert.strictEqual(concatFunc.parameters[0].dataType, 'string');
        assert.strictEqual(concatFunc.parameters[1].dataType, 'string');
        
        // Test compare(int value, int threshold)
        const compareFunc = symbols.functions.find(f => f.name === 'compare');
        assert.ok(compareFunc, 'Should find compare function');
        assert.strictEqual(compareFunc.returnType, 'bool');
        assert.strictEqual(compareFunc.parameters.length, 2);
    });
    
    test('Hover: Variable type information', () => {
        const testFile = path.join(fixturesPath, 'TestGoToDefinition.ctl');
        const doc = createDocument(testFile);
        const content = doc.getText();
        const symbols = SymbolTable.parseFile(content);
        
        // Test global variables (with 'global' keyword in TestGoToDefinition.ctl)
        const g_counter = symbols.globals.find(g => g.name === 'g_counter');
        assert.ok(g_counter, 'Should find g_counter');
        assert.strictEqual(g_counter.dataType, 'int');
        
        const g_deviceName = symbols.globals.find(g => g.name === 'g_deviceName');
        assert.ok(g_deviceName, 'Should find g_deviceName');
        assert.strictEqual(g_deviceName.dataType, 'string');
    });
    
    test('Hover: Class method signatures', () => {
        const testFile = path.join(fixturesPath, 'TestHover.ctl');
        const doc = createDocument(testFile);
        const content = doc.getText();
        const symbols = SymbolTable.parseFile(content);
        
        // Find Calculator class
        const calcClass = symbols.classes.find(c => c.name === 'Calculator');
        assert.ok(calcClass, 'Should find Calculator class');
        
        // Test getResult() method
        const getResultMethod = calcClass.methods.find(m => m.name === 'getResult');
        assert.ok(getResultMethod, 'Should find getResult method');
        assert.strictEqual(getResultMethod.returnType, 'int');
        assert.strictEqual(getResultMethod.parameters.length, 0, 'getResult has no parameters');
        
        // Test setResult(int value) method
        const setResultMethod = calcClass.methods.find(m => m.name === 'setResult');
        assert.ok(setResultMethod, 'Should find setResult method');
        assert.strictEqual(setResultMethod.returnType, 'void');
        assert.strictEqual(setResultMethod.parameters.length, 1, 'setResult has 1 parameter');
        assert.strictEqual(setResultMethod.parameters[0].name, 'value');
        assert.strictEqual(setResultMethod.parameters[0].dataType, 'int');
    });
    
    test('Hover: Struct field types', () => {
        const testFile = path.join(fixturesPath, 'TestHover.ctl');
        const doc = createDocument(testFile);
        const content = doc.getText();
        const symbols = SymbolTable.parseFile(content);
        
        // Find TestStruct
        const testStruct = symbols.structs.find(s => s.name === 'TestStruct');
        assert.ok(testStruct, 'Should find TestStruct');
        
        // Test struct fields
        const idField = testStruct.fields.find(f => f.name === 'id');
        assert.ok(idField, 'Should find id field');
        assert.strictEqual(idField.dataType, 'int');
        
        const nameField = testStruct.fields.find(f => f.name === 'name');
        assert.ok(nameField, 'Should find name field');
        assert.strictEqual(nameField.dataType, 'string');
        
        const valueField = testStruct.fields.find(f => f.name === 'value');
        assert.ok(valueField, 'Should find value field');
        assert.strictEqual(valueField.dataType, 'float');
        
        const activeField = testStruct.fields.find(f => f.name === 'active');
        assert.ok(activeField, 'Should find active field');
        assert.strictEqual(activeField.dataType, 'bool');
    });
    
    test('Hover: Function in TestGoToDefinition.ctl', () => {
        const testFile = path.join(fixturesPath, 'TestGoToDefinition.ctl');
        const doc = createDocument(testFile);
        const content = doc.getText();
        const symbols = SymbolTable.parseFile(content);
        
        // Test calculateSum(int a, int b)
        const calcSum = symbols.functions.find(f => f.name === 'calculateSum');
        assert.ok(calcSum, 'Should find calculateSum function');
        assert.strictEqual(calcSum.returnType, 'int');
        assert.strictEqual(calcSum.parameters.length, 2);
        assert.strictEqual(calcSum.parameters[0].name, 'a');
        assert.strictEqual(calcSum.parameters[0].dataType, 'int');
        assert.strictEqual(calcSum.parameters[1].name, 'b');
        assert.strictEqual(calcSum.parameters[1].dataType, 'int');
        
        // Test checkDevice(DeviceConfig config)
        const checkDev = symbols.functions.find(f => f.name === 'checkDevice');
        assert.ok(checkDev, 'Should find checkDevice function');
        assert.strictEqual(checkDev.returnType, 'bool');
        assert.strictEqual(checkDev.parameters.length, 1);
        assert.strictEqual(checkDev.parameters[0].name, 'config');
        assert.strictEqual(checkDev.parameters[0].dataType, 'DeviceConfig');
        
        // Test formatValue(float value, int precision)
        const formatVal = symbols.functions.find(f => f.name === 'formatValue');
        assert.ok(formatVal, 'Should find formatValue function');
        assert.strictEqual(formatVal.returnType, 'string');
        assert.strictEqual(formatVal.parameters.length, 2);
        assert.strictEqual(formatVal.parameters[0].dataType, 'float');
        assert.strictEqual(formatVal.parameters[1].dataType, 'int');
    });
    
    test('Hover: Class method with multiple parameters', () => {
        const testFile = path.join(fixturesPath, 'TestGoToDefinition.ctl');
        const doc = createDocument(testFile);
        const content = doc.getText();
        const symbols = SymbolTable.parseFile(content);
        
        // Find DeviceManager class
        const deviceMgr = symbols.classes.find(c => c.name === 'DeviceManager');
        assert.ok(deviceMgr, 'Should find DeviceManager class');
        
        // Test createDevice(string deviceName, int deviceType)
        const createDev = deviceMgr.methods.find(m => m.name === 'createDevice');
        assert.ok(createDev, 'Should find createDevice method');
        assert.strictEqual(createDev.returnType, 'int');
        assert.strictEqual(createDev.parameters.length, 2);
        assert.strictEqual(createDev.parameters[0].name, 'deviceName');
        assert.strictEqual(createDev.parameters[0].dataType, 'string');
        assert.strictEqual(createDev.parameters[1].name, 'deviceType');
        assert.strictEqual(createDev.parameters[1].dataType, 'int');
        
        // Test validateConfig(DeviceConfig config)
        const validateCfg = deviceMgr.methods.find(m => m.name === 'validateConfig');
        assert.ok(validateCfg, 'Should find validateConfig method');
        assert.strictEqual(validateCfg.returnType, 'bool');
        assert.strictEqual(validateCfg.parameters.length, 1);
        assert.strictEqual(validateCfg.parameters[0].dataType, 'DeviceConfig');
    });
    
    test('Hover: Resolving symbol at specific position', () => {
        const testFile = path.join(fixturesPath, 'TestHover.ctl');
        const doc = createDocument(testFile);
        const content = doc.getText();
        const symbols = SymbolTable.parseFile(content);
        
        // Find line with "int sum = add(5, 10);"
        const lines = content.split('\n');
        const lineIdx = lines.findIndex(l => l.includes('int sum = add(5, 10)'));
        assert.ok(lineIdx >= 0, 'Test line should exist');
        
        const charIdx = lines[lineIdx].indexOf('add(');
        const position: Position = { line: lineIdx, character: charIdx + 1 };
        
        // Resolve 'add' at this position
        const symbol = SymbolTable.resolveSymbol('add', position, symbols);
        assert.ok(symbol, 'Should resolve add function');
        assert.strictEqual(symbol.name, 'add');
        assert.strictEqual(symbol.kind, SymbolKind.Function);
        
        if ('returnType' in symbol) {
            assert.strictEqual(symbol.returnType, 'int');
            
            if ('parameters' in symbol) {
                const funcSymbol = symbol as any;  // FunctionSymbol
                assert.strictEqual(funcSymbol.parameters.length, 2);
            }
        }
    });
    
    test('Hover: Member access method signature (E2E)', () => {
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
        const offset = content.split('\n').slice(0, lineIdx).join('\n').length + 1 + charIdx;
        
        // Use getSymbolAtPosition to detect member access
        const symbolInfo = getSymbolAtPosition(content, offset);
        assert.ok(symbolInfo, 'Should find symbol');
        assert.strictEqual(symbolInfo.name, 'createDevice');
        assert.ok(symbolInfo.memberAccess, 'Should detect member access');
        assert.strictEqual(symbolInfo.memberAccess?.objectName, 'manager');
        
        // Resolve the object type
        const position: Position = { line: lineIdx, character: charIdx };
        const managerSymbol = SymbolTable.resolveSymbol('manager', position, symbols);
        assert.ok(managerSymbol && 'dataType' in managerSymbol);
        assert.strictEqual(managerSymbol.dataType, 'DeviceManager');
        
        // Find the method in the class
        const deviceMgrClass = symbols.classes.find(c => c.name === 'DeviceManager');
        const method = deviceMgrClass?.methods.find(m => m.name === 'createDevice');
        
        assert.ok(method, 'Should find createDevice method');
        assert.strictEqual(method.returnType, 'int');
        assert.strictEqual(method.parameters.length, 2);
        assert.strictEqual(method.parameters[0].dataType, 'string');
        assert.strictEqual(method.parameters[0].name, 'deviceName');
        assert.strictEqual(method.parameters[1].dataType, 'int');
        assert.strictEqual(method.parameters[1].name, 'deviceType');
    });
    
    test('Hover: Struct field via member access', () => {
        const testFile = path.join(fixturesPath, 'TestHover.ctl');
        const doc = createDocument(testFile);
        const content = doc.getText();
        const symbols = SymbolTable.parseFile(content);
        
        // Find line: "myStruct.id = 1;"
        const lines = content.split('\n');
        const lineIdx = lines.findIndex(l => l.includes('myStruct.id = 1'));
        assert.ok(lineIdx >= 0, 'Test line not found');
        
        // Position on 'id'
        const charIdx = lines[lineIdx].indexOf('id');
        const offset = content.split('\n').slice(0, lineIdx).join('\n').length + 1 + charIdx;
        
        // Use getSymbolAtPosition to detect member access
        const symbolInfo = getSymbolAtPosition(content, offset);
        assert.ok(symbolInfo, 'Should find symbol');
        assert.strictEqual(symbolInfo.name, 'id');
        assert.ok(symbolInfo.memberAccess, 'Should detect member access');
        assert.strictEqual(symbolInfo.memberAccess?.objectName, 'myStruct');
        
        // Resolve the object type
        const position: Position = { line: lineIdx, character: charIdx };
        const myStructSymbol = SymbolTable.resolveSymbol('myStruct', position, symbols);
        assert.ok(myStructSymbol && 'dataType' in myStructSymbol);
        assert.strictEqual(myStructSymbol.dataType, 'TestStruct');
        
        // Find the field in the struct
        const testStruct = symbols.structs.find(s => s.name === 'TestStruct');
        const field = testStruct?.fields.find(f => f.name === 'id');
        
        assert.ok(field, 'Should find id field');
        assert.strictEqual(field.dataType, 'int');
        assert.strictEqual(field.name, 'id');
    });
});
