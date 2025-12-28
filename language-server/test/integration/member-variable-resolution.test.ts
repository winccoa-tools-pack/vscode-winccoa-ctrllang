import * as assert from 'assert';
import { SymbolTable } from '../../src/symbolTable';

suite('Member Variable Resolution', () => {
    const testCode = `
class Calculator
{
  private int m_result;
  private string m_lastOperation;

  public Calculator()
  {
    m_result = 0;
    m_lastOperation = "";
  }

  public int getResult()
  {
    return m_result;
  }

  public void setResult(int value)
  {
    m_result = value;
  }
}
`;

    test('resolves member variable in return statement', () => {
        const symbols = SymbolTable.parseFile(testCode);
        
        // Find the getResult method
        const calcClass = symbols.classes.find(c => c.name === 'Calculator');
        assert.ok(calcClass, 'Calculator class should exist');
        
        const getResultMethod = calcClass.methods.find(m => m.name === 'getResult');
        assert.ok(getResultMethod, 'getResult method should exist');
        
        // Position in "return m_result;" - line 15, column ~12
        // Line 15 is "    return m_result;"
        const resolved = SymbolTable.resolveSymbol('m_result', { line: 14, character: 12 }, symbols);
        
        assert.ok(resolved, 'Should resolve m_result');
        assert.strictEqual(resolved.kind, 'member', 'Should be a member variable');
        assert.strictEqual(resolved.name, 'm_result', 'Name should be m_result');
        if ('dataType' in resolved) {
            assert.strictEqual(resolved.dataType, 'int', 'Type should be int');
        }
        assert.strictEqual(resolved.location.line, 4, 'Should point to member declaration at line 4');
    });

    test('resolves member variable in assignment', () => {
        const symbols = SymbolTable.parseFile(testCode);
        
        // Position in "m_result = value;" - line 20, column ~5
        const resolved = SymbolTable.resolveSymbol('m_result', { line: 19, character: 5 }, symbols);
        
        assert.ok(resolved, 'Should resolve m_result');
        assert.strictEqual(resolved.kind, 'member', 'Should be a member variable');
        assert.strictEqual(resolved.name, 'm_result', 'Name should be m_result');
        if ('dataType' in resolved) {
            assert.strictEqual(resolved.dataType, 'int', 'Type should be int');
        }
    });

    test('prioritizes parameter over member with same name', () => {
        const testCodeShadowing = `
class Test
{
  private int value;

  public void setValue(int value)
  {
    this.value = value;
}
`;
        const symbols = SymbolTable.parseFile(testCodeShadowing);
        
        // Position on parameter "value" in method signature (line 6, after "int ")
        const paramResolved = SymbolTable.resolveSymbol('value', { line: 5, character: 28 }, symbols);
        
        assert.ok(paramResolved, 'Should resolve parameter value');
        // Should resolve to parameter, not member
        assert.strictEqual(paramResolved.kind, 'local', 'Should be local (parameter) not member');
        if ('dataType' in paramResolved) {
            assert.strictEqual(paramResolved.dataType, 'int', 'Type should be int');
        }
    });

    test('resolves member when this.member is used', () => {
        const testCodeThis = `
class Test
{
  private int value;

  public void setValue(int value)
  {
    this.value = value;
  }
}
`;
        const symbols = SymbolTable.parseFile(testCodeThis);
        
        // Position on "value" in "this.value" (line 8, after "this.")
        // Note: This test checks if we can resolve member after "this."
        const memberResolved = SymbolTable.resolveSymbol('value', { line: 7, character: 10 }, symbols);
        
        assert.ok(memberResolved, 'Should resolve member value');
        // When "this.value" is used, should resolve to member
        if ('dataType' in memberResolved) {
            assert.strictEqual(memberResolved.dataType, 'int', 'Type should be int');
        }
    });

    test('resolves multiple member variables correctly', () => {
        const symbols = SymbolTable.parseFile(testCode);
        
        const calcClass = symbols.classes.find(c => c.name === 'Calculator');
        assert.ok(calcClass, 'Calculator class should exist');
        
        // Check both members exist
        const m_result = calcClass.members.find(m => m.name === 'm_result');
        const m_lastOperation = calcClass.members.find(m => m.name === 'm_lastOperation');
        
        assert.ok(m_result, 'm_result member should exist');
        assert.ok(m_lastOperation, 'm_lastOperation member should exist');
        
        assert.strictEqual(m_result.dataType, 'int', 'm_result should be int');
        assert.strictEqual(m_lastOperation.dataType, 'string', 'm_lastOperation should be string');
        
        // Resolve m_result in getResult (line 15)
        const resolved1 = SymbolTable.resolveSymbol('m_result', { line: 14, character: 12 }, symbols);
        assert.ok(resolved1);
        assert.strictEqual(resolved1.name, 'm_result');
        
        // Resolve m_lastOperation in constructor (line 10)
        const resolved2 = SymbolTable.resolveSymbol('m_lastOperation', { line: 9, character: 5 }, symbols);
        assert.ok(resolved2);
        assert.strictEqual(resolved2.name, 'm_lastOperation');
    });
});
