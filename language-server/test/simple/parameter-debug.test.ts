/**
 * Debug Test for Parameter Resolution
 */

import * as assert from 'assert';
import { SymbolTable } from '../../src/symbolTable';
import { Position } from 'vscode-languageserver';

suite('Parameter Resolution Debug', () => {
    test('Debug: Check parsed symbols for setResult method', () => {
        const code = `
struct TestStruct
{
  float value;
};

class Calculator
{
  public void setResult(int value)
  {
    int x = value;
  }
};
`;

        const symbols = SymbolTable.parseFile(code);

        console.log('=== PARSED SYMBOLS ===');
        console.log('Classes:', symbols.classes.length);
        
        if (symbols.classes.length > 0) {
            const calcClass = symbols.classes[0];
            console.log('Class name:', calcClass.name);
            console.log('Methods:', calcClass.methods.length);
            
            if (calcClass.methods.length > 0) {
                const setResultMethod = calcClass.methods[0];
                console.log('\nMethod details:');
                console.log('  Name:', setResultMethod.name);
                console.log('  Location:', setResultMethod.location);
                console.log('  bodyStartLine:', setResultMethod.bodyStartLine);
                console.log('  bodyEndLine:', setResultMethod.bodyEndLine);
                console.log('  Parameters:', setResultMethod.parameters);
                console.log('  Local variables:', setResultMethod.localVariables);
            }
        }

        console.log('\nStructs:', symbols.structs.length);
        if (symbols.structs.length > 0) {
            const testStruct = symbols.structs[0];
            console.log('Struct name:', testStruct.name);
            console.log('Fields:', testStruct.fields);
        }

        // Try resolving 'value' at line 10 (int x = value;)
        const position: Position = { line: 10, character: 15 };
        console.log('\n=== RESOLVING "value" at line 10 ===');
        const valueSymbol = SymbolTable.resolveSymbol('value', position, symbols);
        console.log('Resolved symbol:', valueSymbol);
        
        if (valueSymbol && 'dataType' in valueSymbol) {
            console.log('Symbol dataType:', valueSymbol.dataType);
            console.log('Symbol location:', valueSymbol.location);
        }
    });
});
