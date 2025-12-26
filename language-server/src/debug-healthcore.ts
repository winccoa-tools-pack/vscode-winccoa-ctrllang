/**
 * Debug script to parse HealthCore.ctl and see what symbols are found
 */

import * as fs from 'fs';
import * as path from 'path';
import { SymbolTable } from './symbolTable';

const healthCoreFile = '/home/testus/repos/simaris-control/Src/Code/SIMARIScontrol_RTP/scripts/libs/HealthCore/HealthCore.ctl';

if (!fs.existsSync(healthCoreFile)) {
    console.log('ERROR: File not found:', healthCoreFile);
    process.exit(1);
}

const content = fs.readFileSync(healthCoreFile, 'utf-8');

console.log('=== Parsing HealthCore.ctl ===\n');

const symbols = SymbolTable.parseFile(content);

console.log('Classes:', symbols.classes.length);
symbols.classes.forEach(c => {
    console.log(`  - ${c.name} at line ${c.location.line}`);
});

console.log('\nStructs:', symbols.structs.length);
symbols.structs.forEach(s => console.log(`  - ${s.name} at line ${s.location.line}`));

console.log('\nGlobal Functions:', symbols.functions.length);
symbols.functions.forEach(f => console.log(`  - ${f.name} at line ${f.location.line}`));

console.log('\nGlobal Variables:', symbols.globals.length);
symbols.globals.forEach(g => console.log(`  - ${g.name} at line ${g.location.line}`));

// Test resolve
console.log('\n=== Testing Symbol Resolution ===');
const resolved = SymbolTable.resolveSymbol('DeviceFactory', { line: 56, character: 16 }, symbols);
if (resolved) {
    console.log(`Resolved "DeviceFactory": ${resolved.kind} at line ${resolved.location.line}`);
} else {
    console.log('DeviceFactory not resolved in current file (EXPECTED - should search dependencies)');
}
