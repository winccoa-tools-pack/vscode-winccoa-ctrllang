/**
 * Debug test for main() function parsing
 */

import * as assert from 'assert';
import * as path from 'path';
import * as fs from 'fs';
import { SymbolTable } from '../../src/symbolTable';

const fixturesPath = path.join(__dirname, '../../../test-workspace/scripts/fixtures');

suite('Main Function Debug', () => {
    
    test('Parse main() function and check body lines', () => {
        const testFile = path.join(fixturesPath, 'TestHover.ctl');
        const content = fs.readFileSync(testFile, 'utf-8');
        const symbols = SymbolTable.parseFile(content);
        
        console.log(`Found ${symbols.functions.length} functions`);
        symbols.functions.forEach(f => {
            console.log(`  Function: ${f.name}, bodyStart: ${f.bodyStartLine}, bodyEnd: ${f.bodyEndLine}`);
        });
        
        const mainFunc = symbols.functions.find(f => f.name === 'main');
        assert.ok(mainFunc, 'main() function should be found');
        
        console.log(`main() function details:`);
        console.log(`  Location: line ${mainFunc!.location.line}, column ${mainFunc!.location.column}`);
        console.log(`  Body: ${mainFunc!.bodyStartLine} to ${mainFunc!.bodyEndLine}`);
        console.log(`  Parameters: ${mainFunc!.parameters.length}`);
        console.log(`  Local variables: ${mainFunc!.localVariables?.length || 0}`);
        
        if (mainFunc!.localVariables) {
            mainFunc!.localVariables.forEach(v => {
                console.log(`    Local: ${v.dataType} ${v.name} at line ${v.location.line}`);
            });
        }
        
        assert.ok(mainFunc!.bodyStartLine, 'main() should have bodyStartLine');
        assert.ok(mainFunc!.bodyEndLine, 'main() should have bodyEndLine');
        
        // Check globals
        console.log(`\nFound ${symbols.globals.length} global variables:`);
        symbols.globals.forEach(g => {
            console.log(`  Global: ${g.dataType} ${g.name} at line ${g.location.line}`);
        });
    });
    
    test('Resolve intVariable from within main()', () => {
        const testFile = path.join(fixturesPath, 'TestHover.ctl');
        const content = fs.readFileSync(testFile, 'utf-8');
        const symbols = SymbolTable.parseFile(content);
        
        const lines = content.split('\n');
        const usageLineIdx = lines.findIndex(l => l.includes('int localInt = intVariable'));
        
        console.log(`\nTrying to resolve 'intVariable' at line ${usageLineIdx + 1}`);
        
        // Position in 0-based (LSP style)
        const position = { line: usageLineIdx, character: 20 };
        
        const containingFunc = (SymbolTable as any).findContainingFunction(position, symbols.functions);
        console.log(`Containing function: ${containingFunc ? containingFunc.name : 'null'}`);
        
        if (containingFunc) {
            console.log(`  Body range: ${containingFunc.bodyStartLine} to ${containingFunc.bodyEndLine}`);
            console.log(`  Position line: ${position.line} (0-based)`);
        }
        
        const resolved = SymbolTable.resolveSymbol('intVariable', position, symbols);
        console.log(`Resolved symbol: ${resolved ? resolved.kind + ' ' + resolved.name : 'null'}`);
        
        if (resolved && 'dataType' in resolved) {
            console.log(`  Type: ${resolved.dataType}`);
        }
    });
});
