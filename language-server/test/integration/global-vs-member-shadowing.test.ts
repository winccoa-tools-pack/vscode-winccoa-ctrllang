import * as assert from 'assert';
import { SymbolTable } from '../../src/symbolTable';

suite('Global vs Member Variable Shadowing', () => {
    test('resolves to global variable when outside class scope', () => {
        const code = `
int m_result;

class Calculator
{
  private int m_result;
  
  public void setResult(int value)
  {
    m_result = value; // Should resolve to member
  }
}

void main()
{
  m_result = 42; // Should resolve to GLOBAL, not member!
}
`;
        const symbols = SymbolTable.parseFile(code);
        
        // Position in main() on "m_result = 42;" (line 15)
        const resolved = SymbolTable.resolveSymbol('m_result', { line: 14, character: 3 }, symbols);
        
        console.log('Resolved in main():', JSON.stringify(resolved, null, 2));
        
        assert.ok(resolved, 'Should resolve m_result');
        assert.strictEqual(resolved.kind, 'global', `Should be global, got: ${resolved.kind}`);
        if ('location' in resolved) {
            assert.strictEqual(resolved.location.line, 2, 'Should point to global variable at line 2');
        }
    });
    
    test('resolves to member variable when inside class method', () => {
        const code = `
int m_result;

class Calculator
{
  private int m_result;
  
  public void setResult(int value)
  {
    m_result = value; // Should resolve to member
  }
}
`;
        const symbols = SymbolTable.parseFile(code);
        
        // Position in setResult() on "m_result = value;" (line 10)
        const resolved = SymbolTable.resolveSymbol('m_result', { line: 9, character: 5 }, symbols);
        
        console.log('Resolved in class method:', JSON.stringify(resolved, null, 2));
        
        assert.ok(resolved, 'Should resolve m_result');
        assert.strictEqual(resolved.kind, 'member', `Should be member, got: ${resolved.kind}`);
        if ('location' in resolved) {
            assert.strictEqual(resolved.location.line, 6, 'Should point to member variable at line 6');
        }
    });
});
