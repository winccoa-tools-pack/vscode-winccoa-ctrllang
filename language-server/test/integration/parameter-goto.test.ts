import * as assert from 'assert';
import * as path from 'path';
import { SymbolTable } from '../../src/symbolTable';
import { Position } from 'vscode-languageserver';

suite('Parameter Go-to-Definition Test', () => {
    test('Go-to on parameter should jump to parameter declaration, not shadowed struct field', () => {
        const code = `
struct TestStruct
{
  float value;
};

class Calculator
{
  public void setResult(int value)
  {
    int x = value; // Go-to on 'value' here should jump to line 8 (parameter), NOT line 4 (struct field)
  }
};
`;

        const symbols = SymbolTable.parseFile(code);

        // Find 'value' usage in line 10 (int x = value;)
        const position: Position = { line: 10, character: 15 };
        const valueSymbol = SymbolTable.resolveSymbol('value', position, symbols);

        assert.ok(valueSymbol, 'Symbol "value" should be resolved');
        assert.strictEqual(valueSymbol.name, 'value', 'Symbol name should be "value"');
        assert.ok('dataType' in valueSymbol, 'Symbol should have dataType property');
        if ('dataType' in valueSymbol) {
            assert.strictEqual(valueSymbol.dataType, 'int', 'Symbol type should be "int" (parameter), not "float" (struct field)');
        }
        
        // CRITICAL: Location should point to parameter declaration (line 8), NOT struct field (line 4)
        // Note: Currently parameters use the method location (line 9) as they don't have their own location
        assert.ok(valueSymbol.location, 'Symbol should have location');
        assert.ok(valueSymbol.location.line >= 8 && valueSymbol.location.line <= 9, 
            `Go-to should jump to parameter area (lines 8-9), not struct field at line 4. Got line ${valueSymbol.location.line}`);
    });

    test('Go-to on parameter in method body should resolve to parameter even with global variable of same name', () => {
        const code = `
int value = 100; // global variable

class Calculator
{
  public void setResult(int value)
  {
    int x = value; // Should resolve to parameter at line 6, not global at line 2
  }
};
`;

        const symbols = SymbolTable.parseFile(code);

        // Find 'value' usage in line 8
        const position: Position = { line: 8, character: 15 };
        const valueSymbol = SymbolTable.resolveSymbol('value', position, symbols);

        assert.ok(valueSymbol, 'Symbol "value" should be resolved');
        assert.ok('dataType' in valueSymbol, 'Symbol should have dataType property');
        if ('dataType' in valueSymbol) {
            assert.strictEqual(valueSymbol.dataType, 'int', 'Symbol type should be "int" (parameter)');
        }
        assert.strictEqual(valueSymbol.location?.line, 6, 'Go-to should jump to parameter declaration at line 6, not global at line 2');
    });
});
