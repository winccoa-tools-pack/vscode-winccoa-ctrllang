/**
 * LSP Integration Tests for Hover
 * 
 * Tests the complete hover flow: Request → Handler → Response
 */

import * as assert from 'assert';
import * as path from 'path';
import * as fs from 'fs';
import { 
    TextDocument 
} from 'vscode-languageserver-textdocument';
import { 
    Position,
    TextDocumentPositionParams,
    Hover,
    MarkupKind
} from 'vscode-languageserver';

// Mock document manager
class MockDocuments {
    private docs = new Map<string, TextDocument>();
    
    get(uri: string): TextDocument | undefined {
        return this.docs.get(uri);
    }
    
    add(uri: string, content: string): void {
        const doc = TextDocument.create(uri, 'ctrl', 1, content);
        this.docs.set(uri, doc);
    }
}

// Helper to create a hover request
function createHoverRequest(uri: string, line: number, character: number): TextDocumentPositionParams {
    return {
        textDocument: { uri },
        position: { line, character }
    };
}

// Import the hover handler logic (we'll simulate it)
import { SymbolTable } from '../../src/symbolTable';
import { getSymbolAtPosition } from '../../src/symbolFinder';
import { BaseSymbol } from '../../src/symbolTable';

// Simulated hover handler (same logic as server.ts)
function handleHover(doc: TextDocument, position: Position): Hover | null {
    const txt = doc.getText();
    const offset = doc.offsetAt(position);
    
    try {
        const symbols = SymbolTable.parseFile(txt);
        const symbolInfo = getSymbolAtPosition(txt, offset);
        
        if (!symbolInfo) return null;
        
        let resolved: BaseSymbol | null = null;
        
        // Check if this is member access
        if (symbolInfo.memberAccess) {
            const objectName = symbolInfo.memberAccess.objectName;
            const objSymbol = SymbolTable.resolveSymbol(objectName, position, symbols);
            
            if (objSymbol && 'dataType' in objSymbol) {
                const typeName = objSymbol.dataType;
                
                // Check if it's a class
                const classSymbol = symbols.classes.find(c => c.name === typeName);
                if (classSymbol) {
                    const method = classSymbol.methods.find(m => m.name === symbolInfo.name);
                    const member = classSymbol.members.find(m => m.name === symbolInfo.name);
                    resolved = method || member || null;
                } else {
                    // Check if it's a struct
                    const structSymbol = symbols.structs.find(s => s.name === typeName);
                    if (structSymbol) {
                        const field = structSymbol.fields.find(f => f.name === symbolInfo.name);
                        if (field) {
                            resolved = field;
                        }
                    }
                }
            }
        } else {
            // Normal symbol resolution
            resolved = SymbolTable.resolveSymbol(symbolInfo.name, position, symbols);
        }
        
        if (resolved) {
            let hoverText = '';
            
            if ('dataType' in resolved) {
                hoverText = `\`\`\`ctrl\n${resolved.dataType} ${resolved.name}\n\`\`\``;
            } else if ('returnType' in resolved) {
                const func = resolved as any;
                const params = func.parameters || [];
                const paramList = params.map((p: any) => `${p.dataType} ${p.name}`).join(', ');
                hoverText = `\`\`\`ctrl\n${func.returnType} ${func.name}(${paramList})\n\`\`\``;
            }
            
            if (hoverText) {
                return { 
                    contents: { 
                        kind: MarkupKind.Markdown, 
                        value: hoverText 
                    } 
                };
            }
        }
    } catch (error) {
        return null;
    }
    
    return null;
}

const fixturesPath = path.join(__dirname, '../../../test-workspace/scripts/fixtures');

suite('LSP Hover Integration Tests', () => {
    const docs = new MockDocuments();
    
    test('LSP: Hover on struct field via member access returns type', () => {
        // Setup
        const testFile = path.join(fixturesPath, 'TestHover.ctl');
        const content = fs.readFileSync(testFile, 'utf-8');
        const uri = `file://${testFile}`;
        docs.add(uri, content);
        
        // Find line: "myStruct.id = 1;"
        const lines = content.split('\n');
        const lineIdx = lines.findIndex(l => l.includes('myStruct.id = 1'));
        assert.ok(lineIdx >= 0, 'Test line not found');
        
        // Position on 'id'
        const charIdx = lines[lineIdx].indexOf('id');
        const position: Position = { line: lineIdx, character: charIdx };
        
        // Execute
        const doc = docs.get(uri);
        assert.ok(doc, 'Document should exist');
        const hoverResult = handleHover(doc!, position);
        
        // Validate
        assert.ok(hoverResult, 'Hover should return a result');
        assert.ok(hoverResult.contents, 'Hover should have contents');
        
        const contents = hoverResult.contents as any;
        assert.strictEqual(contents.kind, MarkupKind.Markdown);
        assert.ok(contents.value.includes('int id'), 
            `Expected hover to contain 'int id', got: ${contents.value}`);
    });
    
    test('LSP: Hover on method via member access returns signature', () => {
        // Setup
        const testFile = path.join(fixturesPath, 'TestGoToDefinition.ctl');
        const content = fs.readFileSync(testFile, 'utf-8');
        const uri = `file://${testFile}`;
        docs.add(uri, content);
        
        // Find line: "manager.createDevice(testName, 1)"
        const lines = content.split('\n');
        const lineIdx = lines.findIndex(l => l.includes('manager.createDevice(testName'));
        assert.ok(lineIdx >= 0, 'Test line not found');
        
        // Position on 'createDevice'
        const charIdx = lines[lineIdx].indexOf('createDevice');
        const position: Position = { line: lineIdx, character: charIdx };
        
        // Execute
        const doc = docs.get(uri);
        assert.ok(doc, 'Document should exist');
        const hoverResult = handleHover(doc!, position);
        
        // Validate
        assert.ok(hoverResult, 'Hover should return a result');
        assert.ok(hoverResult.contents, 'Hover should have contents');
        
        const contents = hoverResult.contents as any;
        assert.strictEqual(contents.kind, MarkupKind.Markdown);
        const expectedSignature = 'int createDevice(string deviceName, int deviceType)';
        assert.ok(contents.value.includes(expectedSignature), 
            `Expected hover to contain '${expectedSignature}', got: ${contents.value}`);
    });
    
    test('LSP: Hover on local variable returns type', () => {
        // Setup
        const testFile = path.join(fixturesPath, 'TestHover.ctl');
        const content = fs.readFileSync(testFile, 'utf-8');
        const uri = `file://${testFile}`;
        docs.add(uri, content);
        
        // Find line: "int localInt = intVariable;"
        const lines = content.split('\n');
        const lineIdx = lines.findIndex(l => l.includes('int localInt = intVariable'));
        assert.ok(lineIdx >= 0, 'Test line not found');
        
        // Position on 'localInt' (the local variable, not intVariable)
        const charIdx = lines[lineIdx].indexOf('localInt');
        const position: Position = { line: lineIdx, character: charIdx };
        
        // Execute
        const doc = docs.get(uri);
        assert.ok(doc, 'Document should exist');
        const hoverResult = handleHover(doc!, position);
        
        // Validate
        assert.ok(hoverResult, 'Hover should return a result');
        assert.ok(hoverResult.contents, 'Hover should have contents');
        
        const contents = hoverResult.contents as any;
        assert.strictEqual(contents.kind, MarkupKind.Markdown);
        assert.ok(contents.value.includes('int localInt'), 
            `Expected hover to contain 'int localInt', got: ${contents.value}`);
    });
    
    test('LSP: Hover on function call returns signature', () => {
        // Setup
        const testFile = path.join(fixturesPath, 'TestHover.ctl');
        const content = fs.readFileSync(testFile, 'utf-8');
        const uri = `file://${testFile}`;
        docs.add(uri, content);
        
        // Find line: "int sum = add(5, 10);"
        const lines = content.split('\n');
        const lineIdx = lines.findIndex(l => l.includes('int sum = add(5, 10)'));
        assert.ok(lineIdx >= 0, 'Test line not found');
        
        // Position on 'add'
        const charIdx = lines[lineIdx].indexOf('add(');
        const position: Position = { line: lineIdx, character: charIdx };
        
        // Execute
        const doc = docs.get(uri);
        assert.ok(doc, 'Document should exist');
        const hoverResult = handleHover(doc!, position);
        
        // Validate
        assert.ok(hoverResult, 'Hover should return a result');
        assert.ok(hoverResult.contents, 'Hover should have contents');
        
        const contents = hoverResult.contents as any;
        assert.strictEqual(contents.kind, MarkupKind.Markdown);
        const expectedSignature = 'int add(int a, int b)';
        assert.ok(contents.value.includes(expectedSignature), 
            `Expected hover to contain '${expectedSignature}', got: ${contents.value}`);
    });
    
    test('LSP: Hover on non-existent symbol returns null', () => {
        // Setup
        const testFile = path.join(fixturesPath, 'TestHover.ctl');
        const content = fs.readFileSync(testFile, 'utf-8');
        const uri = `file://${testFile}`;
        docs.add(uri, content);
        
        const doc = docs.get(uri);
        assert.ok(doc, 'Document should exist');
        
        // Position on whitespace (should find nothing)
        const position: Position = { line: 0, character: 0 };
        
        // Execute
        const hoverResult = handleHover(doc!, position);
        
        // Validate - should return null or empty
        // (null is OK for non-existent symbols)
        assert.ok(hoverResult === null || !hoverResult.contents);
    });
});
