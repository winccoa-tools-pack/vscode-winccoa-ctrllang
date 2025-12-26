/**
 * Debug script to parse TestGoToDefinition.ctl and see what symbols are found
 */

import * as fs from 'fs';
import * as path from 'path';
import { SymbolTable } from './symbolTable';

const testFile = path.resolve(__dirname, '../../../../wincc_proj/DevEnv/scripts/TestGoToDefinition.ctl');
const content = fs.readFileSync(testFile, 'utf-8');

console.log('=== Parsing TestGoToDefinition.ctl ===\n');

const symbols = SymbolTable.parseFile(content);

console.log('Classes:', symbols.classes.length);
symbols.classes.forEach(c => {
    console.log(`  - ${c.name} at line ${c.location.line}`);
    console.log(`    Methods: ${c.methods.length}`);
    c.methods.forEach(m => console.log(`      - ${m.name} at line ${m.location.line}`));
});

console.log('\nStructs:', symbols.structs.length);
symbols.structs.forEach(s => console.log(`  - ${s.name} at line ${s.location.line}`));

console.log('\nGlobal Functions:', symbols.functions.length);
symbols.functions.forEach(f => console.log(`  - ${f.name} at line ${f.location.line}`));

console.log('\nGlobal Variables:', symbols.globals.length);
symbols.globals.forEach(g => console.log(`  - ${g.name} at line ${g.location.line}`));

// Test resolve
console.log('\n=== Testing Symbol Resolution ===');
const resolved = SymbolTable.resolveSymbol('DerivedClass', { line: 56, character: 12 }, symbols);
if (resolved) {
    console.log(`Resolved "DerivedClass": ${resolved.kind} at line ${resolved.location.line}`);
} else {
    console.log('DerivedClass not resolved in current file (EXPECTED - should search dependencies)');
}
