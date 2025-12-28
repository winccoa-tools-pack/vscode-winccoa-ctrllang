import * as assert from 'assert';
import { SymbolTable } from '../../src/symbolTable';

suite('Debug Local Variables Parsing', () => {
    test('what does findLocalVariables parse from getResult method', () => {
        const code = `
class Calculator
{
  private int m_result;

  public int getResult()
  {
    return m_result;
  }
}
`;
        const symbols = SymbolTable.parseFile(code);
        const calcClass = symbols.classes.find(c => c.name === 'Calculator');
        assert.ok(calcClass);
        
        const getResult = calcClass.methods.find(m => m.name === 'getResult');
        assert.ok(getResult);
        
        console.log('getResult localVariables:', JSON.stringify(getResult.localVariables, null, 2));
        console.log('m_result should NOT be in localVariables!');
        
        // m_result should NOT be a local variable
        const hasM_result = getResult.localVariables?.some(v => v.name === 'm_result');
        assert.strictEqual(hasM_result, false, 'm_result should not be parsed as local variable!');
    });
});
