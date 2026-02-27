/**
 * Document Symbol Position Tests
 * 
 * User report: Outline View and Ctrl+Shift+O always point 1 line lower than actual position
 * This test suite validates that selectionRange points to the correct line
 */

import * as assert from 'assert';
import * as path from 'path';
import * as fs from 'fs';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { pathToFileURL } from 'url';
import { DocumentSymbolService } from '../../src/services/documentSymbolService';
import { SymbolCache } from '../../src/core/symbolCache';

suite('DocumentSymbol Position Accuracy', () => {
    let documentSymbolService: DocumentSymbolService;
    let symbolCache: SymbolCache;
    let fixturesPath: string;

    setup(() => {
        symbolCache = new SymbolCache();
        documentSymbolService = new DocumentSymbolService(symbolCache);
        fixturesPath = path.join(__dirname, '../../../test-workspace/scripts/fixtures');
    });

    test('Global variables: selectionRange points to actual declaration line', async () => {
        const testFile = path.join(fixturesPath, 'TestOutlinePosition.ctl');
        const content = fs.readFileSync(testFile, 'utf-8');
        const doc = TextDocument.create(
            pathToFileURL(testFile).href,
            'ctl',
            1,
            content
        );

        const symbols = await documentSymbolService.handle(doc);
        
        // Find global variables
        const globalVars = symbols.filter(s => s.name.includes('Variable'));
        assert.ok(globalVars.length >= 3, 'Should have at least 3 global variables');

        // Find line numbers in content
        const lines = content.split('\n');
        
        // firstVariable should be on line 4 (0-based: line 3)
        const firstVarLine = lines.findIndex(l => l.includes('int firstVariable'));
        assert.ok(firstVarLine >= 0, 'firstVariable should exist in content');
        
        const firstVar = globalVars.find(v => v.name === 'firstVariable');
        assert.ok(firstVar, 'firstVariable symbol should exist');
        
        // CRITICAL: selectionRange.start.line should match actual line number (0-based)
        assert.strictEqual(
            firstVar!.selectionRange.start.line,
            firstVarLine,
            `firstVariable selectionRange should point to line ${firstVarLine} (actual declaration), not ${firstVar!.selectionRange.start.line}`
        );

        // secondVariable should be on next line
        const secondVarLine = lines.findIndex(l => l.includes('int secondVariable'));
        const secondVar = globalVars.find(v => v.name === 'secondVariable');
        assert.strictEqual(
            secondVar!.selectionRange.start.line,
            secondVarLine,
            `secondVariable selectionRange should point to line ${secondVarLine}`
        );

        // thirdVariable should be on next line
        const thirdVarLine = lines.findIndex(l => l.includes('int thirdVariable'));
        const thirdVar = globalVars.find(v => v.name === 'thirdVariable');
        assert.strictEqual(
            thirdVar!.selectionRange.start.line,
            thirdVarLine,
            `thirdVariable selectionRange should point to line ${thirdVarLine}`
        );
    });

    test('Functions: selectionRange points to actual declaration line', async () => {
        const testFile = path.join(fixturesPath, 'TestOutlinePosition.ctl');
        const content = fs.readFileSync(testFile, 'utf-8');
        const doc = TextDocument.create(
            pathToFileURL(testFile).href,
            'ctl',
            1,
            content
        );

        const symbols = await documentSymbolService.handle(doc);
        
        // Find functions
        const functions = symbols.filter(s => s.name.includes('Function'));
        assert.ok(functions.length >= 2, 'Should have at least 2 functions');

        const lines = content.split('\n');
        
        // firstFunction declaration line
        const firstFuncLine = lines.findIndex(l => l.includes('void firstFunction'));
        const firstFunc = functions.find(f => f.name === 'firstFunction');
        
        assert.strictEqual(
            firstFunc!.selectionRange.start.line,
            firstFuncLine,
            `firstFunction selectionRange should point to line ${firstFuncLine} (actual declaration)`
        );

        // secondFunction declaration line
        const secondFuncLine = lines.findIndex(l => l.includes('void secondFunction'));
        const secondFunc = functions.find(f => f.name === 'secondFunction');
        
        assert.strictEqual(
            secondFunc!.selectionRange.start.line,
            secondFuncLine,
            `secondFunction selectionRange should point to line ${secondFuncLine}`
        );
    });

    test('Class and members: selectionRange points to actual declaration lines', async () => {
        const testFile = path.join(fixturesPath, 'TestOutlinePosition.ctl');
        const content = fs.readFileSync(testFile, 'utf-8');
        const doc = TextDocument.create(
            pathToFileURL(testFile).href,
            'ctl',
            1,
            content
        );

        const symbols = await documentSymbolService.handle(doc);
        
        // Find class
        const classSymbol = symbols.find(s => s.name === 'TestClass');
        assert.ok(classSymbol, 'TestClass should exist');

        const lines = content.split('\n');
        
        // Class declaration line
        const classLine = lines.findIndex(l => l.includes('class TestClass'));
        assert.strictEqual(
            classSymbol!.selectionRange.start.line,
            classLine,
            `TestClass selectionRange should point to line ${classLine} (actual declaration)`
        );

        // Member variable line
        const memberVarLine = lines.findIndex(l => l.includes('int memberVariable'));
        const memberVar = classSymbol!.children?.find(c => c.name === 'memberVariable');
        assert.ok(memberVar, 'memberVariable should exist as child');
        
        assert.strictEqual(
            memberVar!.selectionRange.start.line,
            memberVarLine,
            `memberVariable selectionRange should point to line ${memberVarLine}`
        );

        // Member method line
        const memberMethodLine = lines.findIndex(l => l.includes('void memberMethod'));
        const memberMethod = classSymbol!.children?.find(c => c.name === 'memberMethod');
        assert.ok(memberMethod, 'memberMethod should exist as child');
        
        assert.strictEqual(
            memberMethod!.selectionRange.start.line,
            memberMethodLine,
            `memberMethod selectionRange should point to line ${memberMethodLine} (actual declaration)`
        );
    });
});
