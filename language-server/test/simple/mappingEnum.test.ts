/**
 * Tests for mapping and enum support in SymbolTable
 */

import * as assert from 'assert';
import * as path from 'path';
import * as fs from 'fs';
import { SymbolTable, SymbolKind, FileSymbols, EnumSymbol, EnumMemberSymbol } from '../../src/symbolTable';

suite('SymbolTable - Enum Parsing', () => {
    
    test('finds simple enum definition', () => {
        const code = `
enum Color { RED, GREEN, BLUE };
`;
        const symbols = SymbolTable.parseFile(code);
        
        assert.ok(symbols.enums, 'enums should exist');
        assert.strictEqual(symbols.enums.length, 1, 'should find 1 enum');
        
        const colorEnum = symbols.enums[0];
        assert.strictEqual(colorEnum.name, 'Color');
        assert.strictEqual(colorEnum.members.length, 3);
        assert.strictEqual(colorEnum.members[0].name, 'RED');
        assert.strictEqual(colorEnum.members[1].name, 'GREEN');
        assert.strictEqual(colorEnum.members[2].name, 'BLUE');
    });
    
    test('finds enum with explicit values', () => {
        const code = `
enum Status { STOPPED = 0, RUNNING = 1, ERROR = 2 };
`;
        const symbols = SymbolTable.parseFile(code);
        
        assert.ok(symbols.enums);
        const statusEnum = symbols.enums.find(e => e.name === 'Status');
        assert.ok(statusEnum);
        
        assert.strictEqual(statusEnum.members[0].name, 'STOPPED');
        assert.strictEqual(statusEnum.members[0].value, 0);
        assert.strictEqual(statusEnum.members[1].name, 'RUNNING');
        assert.strictEqual(statusEnum.members[1].value, 1);
        assert.strictEqual(statusEnum.members[2].name, 'ERROR');
        assert.strictEqual(statusEnum.members[2].value, 2);
    });
    
    test('finds enum with mixed values (implicit and explicit)', () => {
        const code = `
enum Priority { LOW, MEDIUM = 5, HIGH, CRITICAL = 10 };
`;
        const symbols = SymbolTable.parseFile(code);
        
        const priorityEnum = symbols.enums?.find(e => e.name === 'Priority');
        assert.ok(priorityEnum);
        
        // LOW should be 0 (first implicit)
        assert.strictEqual(priorityEnum.members[0].name, 'LOW');
        assert.strictEqual(priorityEnum.members[0].value, 0);
        
        // MEDIUM is explicit 5
        assert.strictEqual(priorityEnum.members[1].name, 'MEDIUM');
        assert.strictEqual(priorityEnum.members[1].value, 5);
        
        // HIGH should be 6 (after MEDIUM = 5)
        assert.strictEqual(priorityEnum.members[2].name, 'HIGH');
        assert.strictEqual(priorityEnum.members[2].value, 6);
        
        // CRITICAL is explicit 10
        assert.strictEqual(priorityEnum.members[3].name, 'CRITICAL');
        assert.strictEqual(priorityEnum.members[3].value, 10);
    });
    
    test('finds multiple enums in file', () => {
        const code = `
enum Color { RED, GREEN, BLUE };
enum Status { STOPPED, RUNNING };
enum Priority { LOW, HIGH };
`;
        const symbols = SymbolTable.parseFile(code);
        
        assert.strictEqual(symbols.enums?.length, 3);
    });
    
    test('finds global enum', () => {
        const code = `
global enum LogLevel { DEBUG, INFO, WARNING, ERROR_LEVEL };
`;
        const symbols = SymbolTable.parseFile(code);
        
        assert.ok(symbols.enums);
        const logEnum = symbols.enums[0];
        assert.strictEqual(logEnum.name, 'LogLevel');
        assert.strictEqual(logEnum.isGlobal, true);
    });
    
    test('enum location is correct', () => {
        const code = `
// Comment line 1
enum Color { RED, GREEN, BLUE };
`;
        const symbols = SymbolTable.parseFile(code);
        
        const colorEnum = symbols.enums?.[0];
        assert.ok(colorEnum);
        assert.strictEqual(colorEnum.location.line, 3, 'enum should be on line 3');
    });
});

suite('SymbolTable - Enum Resolution', () => {
    
    test('resolves enum type in variable declaration', () => {
        const code = `
enum Color { RED, GREEN, BLUE };

void test()
{
    Color c = Color::RED;
}
`;
        const symbols = SymbolTable.parseFile(code);
        const testFunc = symbols.functions?.find(f => f.name === 'test');
        
        assert.ok(testFunc);
        const localVar = testFunc.localVariables?.find(v => v.name === 'c');
        assert.ok(localVar);
        assert.strictEqual(localVar.dataType, 'Color');
    });
    
    test('resolves enum as function parameter type', () => {
        const code = `
enum Color { RED, GREEN, BLUE };

void printColor(Color c)
{
    DebugN(c);
}
`;
        const symbols = SymbolTable.parseFile(code);
        const func = symbols.functions?.find(f => f.name === 'printColor');
        
        assert.ok(func);
        assert.strictEqual(func.parameters[0].dataType, 'Color');
    });
    
    test('resolves enum as function return type', () => {
        const code = `
enum Status { STOPPED, RUNNING };

Status getStatus()
{
    return Status::RUNNING;
}
`;
        const symbols = SymbolTable.parseFile(code);
        const func = symbols.functions?.find(f => f.name === 'getStatus');
        
        assert.ok(func);
        assert.strictEqual(func.returnType, 'Status');
    });
});

suite('SymbolTable - Mapping Variables', () => {
    
    test('finds mapping variable declaration', () => {
        const code = `
void test()
{
    mapping m;
}
`;
        const symbols = SymbolTable.parseFile(code);
        const testFunc = symbols.functions?.find(f => f.name === 'test');
        
        assert.ok(testFunc);
        const localVar = testFunc.localVariables?.find(v => v.name === 'm');
        assert.ok(localVar);
        assert.strictEqual(localVar.dataType, 'mapping');
    });
    
    test('finds dyn_mapping variable declaration', () => {
        const code = `
void test()
{
    dyn_mapping dynMap;
}
`;
        const symbols = SymbolTable.parseFile(code);
        const testFunc = symbols.functions?.find(f => f.name === 'test');
        
        assert.ok(testFunc);
        const localVar = testFunc.localVariables?.find(v => v.name === 'dynMap');
        assert.ok(localVar);
        assert.strictEqual(localVar.dataType, 'dyn_mapping');
    });
    
    test('finds global mapping variable', () => {
        const code = `
global mapping g_config;
`;
        const symbols = SymbolTable.parseFile(code);
        
        const globalVar = symbols.globals?.find(g => g.name === 'g_config');
        assert.ok(globalVar);
        assert.strictEqual(globalVar.dataType, 'mapping');
    });
});

suite('SymbolTable - Enum Hover', () => {
    
    test('resolves enum symbol for hover', () => {
        const code = `
enum Color { RED, GREEN, BLUE };
`;
        const symbols = SymbolTable.parseFile(code);
        
        // Simulate resolving 'Color' at position after enum definition
        const resolved = SymbolTable.resolveSymbol('Color', { line: 3, character: 0 }, symbols);
        
        assert.ok(resolved);
        assert.strictEqual(resolved.kind, 'enum');
        assert.strictEqual(resolved.name, 'Color');
    });
});

suite('Mapping and Enum - Fixture File', () => {
    
    test('parses TestMappingEnum.ctl fixture', () => {
        const fixturePath = path.join(__dirname, '../../../test-workspace/scripts/fixtures/TestMappingEnum.ctl');
        
        if (!fs.existsSync(fixturePath)) {
            console.log('Fixture not found at:', fixturePath);
            return;  // Skip if fixture not available
        }
        
        const content = fs.readFileSync(fixturePath, 'utf-8');
        const symbols = SymbolTable.parseFile(content);
        
        // Should find enums
        assert.ok(symbols.enums, 'should find enums');
        assert.ok(symbols.enums.length >= 3, 'should find at least 3 enums (Color, Status, Priority)');
        
        // Should find functions
        assert.ok(symbols.functions);
        const funcNames = symbols.functions.map(f => f.name);
        assert.ok(funcNames.includes('testEnumUsage'));
        assert.ok(funcNames.includes('testMappingDeclarations'));
        assert.ok(funcNames.includes('testMappingOperations'));
    });
});
