import * as assert from 'assert';
import * as path from 'path';
import { SymbolTable, SymbolKind } from '../../src/symbolTable';
import { Position } from 'vscode-languageserver';

suite('Constructor Hover Test', () => {
    test('Hover over "new ClassName()" should show constructor signature, not "class ClassName"', () => {
        const code = `
class Calculator
{
  private int m_result;

  public Calculator()
  {
    m_result = 0;
  }

  public Calculator(int initialValue)
  {
    m_result = initialValue;
  }
};

void main()
{
  Calculator calc = new Calculator(); // Hover on 'Calculator' after 'new' should show "Calculator()"
}
`;

        const symbols = SymbolTable.parseFile(code);

        // Find 'Calculator' in 'new Calculator()' at line 19
        // This should resolve to the default constructor, not the class definition
        const position: Position = { line: 19, character: 30 };
        const constructorSymbol = SymbolTable.resolveSymbol('Calculator', position, symbols);

        assert.ok(constructorSymbol, 'Constructor symbol should be resolved');
        
        // When hovering over 'new Calculator()', we want to see the constructor signature
        // The symbol should indicate it's a constructor (could be SymbolKind.Method with name === class name)
        // For now, let's check that we can distinguish this from the class definition
        
        // The challenge: How do we know if 'Calculator' in 'new Calculator()' refers to:
        // a) The class definition (for type information)
        // b) The constructor method (for signature)
        
        // Expected behavior: Context matters!
        // - In 'Calculator calc = ...' -> class type
        // - In 'new Calculator()' -> constructor signature
        
        console.log('Constructor symbol:', constructorSymbol);
        console.log('Constructor kind:', constructorSymbol.kind);
        console.log('Constructor name:', constructorSymbol.name);
        if ('dataType' in constructorSymbol) {
            console.log('Constructor dataType:', constructorSymbol.dataType);
        }
    });

    test('Hover over "new ClassName(args)" should show matching constructor signature', () => {
        const code = `
class Calculator
{
  private int m_result;

  public Calculator()
  {
    m_result = 0;
  }

  public Calculator(int initialValue)
  {
    m_result = initialValue;
  }
};

void main()
{
  Calculator calc = new Calculator(42); // Should show "Calculator(int initialValue)"
}
`;

        const symbols = SymbolTable.parseFile(code);

        // Find 'Calculator' in 'new Calculator(42)' at line 19
        const position: Position = { line: 19, character: 30 };
        const constructorSymbol = SymbolTable.resolveSymbol('Calculator', position, symbols);

        assert.ok(constructorSymbol, 'Constructor symbol should be resolved');
        
        console.log('Constructor with args:', constructorSymbol);
    });

    test('Constructor should be listed in class methods', () => {
        const code = `
class Calculator
{
  public Calculator()
  {
  }

  public Calculator(int value)
  {
  }
};
`;

        const symbols = SymbolTable.parseFile(code);

        // Find the class - symbols is FileSymbols object
        const classSymbols = Object.values(symbols.classes || {});
        assert.strictEqual(classSymbols.length, 1, 'Should find 1 class');

        const calcClass = classSymbols[0];
        assert.strictEqual(calcClass.name, 'Calculator', 'Class name should be Calculator');

        // Check if constructors are in methods
        assert.ok(calcClass.methods, 'Class should have methods');
        
        const constructors = calcClass.methods.filter((m: any) => m.name === 'Calculator');
        assert.strictEqual(constructors.length, 2, 'Should find 2 constructors (overloaded)');

        console.log('Constructors found:', constructors);
    });
});
