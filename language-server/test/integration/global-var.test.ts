/**
 * Global Variable Tests
 * 
 * Tests for hover and go-to-definition on global variable USAGE (not declaration)
 */

import * as assert from 'assert';
import * as path from 'path';
import * as fs from 'fs';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { Position } from 'vscode-languageserver';
import { SymbolTable } from '../../src/symbolTable';

function createDocument(filePath: string): TextDocument {
    const content = fs.readFileSync(filePath, 'utf-8');
    return TextDocument.create(filePath, 'ctl', 1, content);
}

const fixturesPath = path.join(__dirname, '../../../test-workspace/scripts/fixtures');

suite('Global Variable Tests', () => {
    
    test('Hover: Global variable usage shows type', () => {
        const testFile = path.join(fixturesPath, 'TestHover.ctl');
        assert.ok(fs.existsSync(testFile), 'Test file not found: ' + testFile);
        
        const doc = createDocument(testFile);
        const content = doc.getText();
        const symbols = SymbolTable.parseFile(content);
        
        // Find line: int localInt = intVariable;
        const lines = content.split('\n');
        const usageLineIdx = lines.findIndex(l => l.includes('int localInt = intVariable'));
        assert.ok(usageLineIdx >= 0, 'Test line "int localInt = intVariable" not found');
        
        console.log(`Found usage line at index ${usageLineIdx}: ${lines[usageLineIdx]}`);
        
        // Position on "intVariable" in usage
        const charIdx = lines[usageLineIdx].indexOf('intVariable');
        const position: Position = { line: usageLineIdx, character: charIdx + 1 };
        
        console.log(`Testing hover at position line ${position.line}, char ${position.character}`);
        
        const symbol = SymbolTable.resolveSymbol('intVariable', position, symbols);
        
        assert.ok(symbol, 'Should find intVariable symbol');
        assert.strictEqual(symbol.name, 'intVariable');
        assert.ok('dataType' in symbol, 'Symbol should have dataType');
        if ('dataType' in symbol) {
            assert.strictEqual(symbol.dataType, 'int', 'intVariable should be type int');
        }
    });
    
    test('Go-to-Definition: Global variable usage jumps to declaration', () => {
        const testFile = path.join(fixturesPath, 'TestHover.ctl');
        const doc = createDocument(testFile);
        const content = doc.getText();
        const symbols = SymbolTable.parseFile(content);
        
        // Find line: int localInt = intVariable;
        const lines = content.split('\n');
        const usageLineIdx = lines.findIndex(l => l.includes('int localInt = intVariable'));
        assert.ok(usageLineIdx >= 0, 'Test line not found');
        
        const charIdx = lines[usageLineIdx].indexOf('intVariable');
        const position: Position = { line: usageLineIdx, character: charIdx + 1 };
        
        const symbol = SymbolTable.resolveSymbol('intVariable', position, symbols);
        
        assert.ok(symbol, 'Should find symbol');
        assert.strictEqual(symbol.name, 'intVariable');
        
        // Find declaration line: int intVariable = 42;
        const declLineIdx = lines.findIndex(l => l.includes('int intVariable = 42'));
        assert.ok(declLineIdx >= 0, 'Declaration line not found');
        
        // Symbol location should point to declaration (1-based line)
        assert.strictEqual(symbol.location.line, declLineIdx + 1, 
            `Should point to declaration line ${declLineIdx + 1}, but got ${symbol.location.line}`);
    });
    
    test('Go-to-Definition: Struct field usage in member access', () => {
        const testFile = path.join(fixturesPath, 'TestHover.ctl');
        const doc = createDocument(testFile);
        const content = doc.getText();
        const symbols = SymbolTable.parseFile(content);
        
        // Find line: myStruct.id = 1;
        const lines = content.split('\n');
        const usageLineIdx = lines.findIndex(l => l.includes('myStruct.id = 1'));
        assert.ok(usageLineIdx >= 0, 'Test line "myStruct.id = 1" not found');
        
        console.log(`Found usage line at index ${usageLineIdx}: ${lines[usageLineIdx]}`);
        
        // First, resolve myStruct to get its type
        const charIdx = lines[usageLineIdx].indexOf('myStruct');
        const myStructPos: Position = { line: usageLineIdx, character: charIdx + 1 };
        
        const myStructSymbol = SymbolTable.resolveSymbol('myStruct', myStructPos, symbols);
        assert.ok(myStructSymbol, 'Should find myStruct symbol');
        assert.ok('dataType' in myStructSymbol, 'myStruct should have dataType');
        
        if ('dataType' in myStructSymbol) {
            assert.strictEqual(myStructSymbol.dataType, 'TestStruct', 'myStruct should be type TestStruct');
            
            // Now find the struct definition
            const structSymbol = symbols.structs.find(s => s.name === 'TestStruct');
            assert.ok(structSymbol, 'Should find TestStruct definition');
            
            // Find the 'id' field
            const idField = structSymbol!.fields.find(f => f.name === 'id');
            assert.ok(idField, 'Should find id field in TestStruct');
            assert.strictEqual(idField!.dataType, 'int', 'id field should be type int');
            
            console.log(`id field location: line ${idField!.location.line}, column ${idField!.location.column}`);
            
            // Find declaration line in struct
            const structDeclLineIdx = lines.findIndex(l => l.includes('struct TestStruct'));
            const idDeclLineIdx = lines.findIndex((l, idx) => 
                idx > structDeclLineIdx && l.includes('int id;'));
            assert.ok(idDeclLineIdx >= 0, 'id field declaration not found');
            
            console.log(`Expected id declaration at line ${idDeclLineIdx + 1}, got ${idField!.location.line}`);
        }
    });
});
