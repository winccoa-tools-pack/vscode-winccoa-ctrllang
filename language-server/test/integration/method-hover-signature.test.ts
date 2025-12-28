import * as assert from 'assert';
import { SymbolTable } from '../../src/symbolTable';

suite('Method Hover Signature', () => {
    test('hover on method call shows method signature', () => {
        const code = `
class DeviceManager
{
  private int m_count;

  public bool validateConfig(DeviceConfig config)
  {
    return config.enabled;
  }

  public int getCount()
  {
    return m_count;
  }
}

main()
{
  DeviceManager manager = new DeviceManager();
  
  // Hover on validateConfig should show: bool validateConfig(DeviceConfig config)
  // NOT just: method validateConfig
  bool valid = manager.validateConfig(config);
}
`;
        const symbols = SymbolTable.parseFile(code);
        
        // Position on "validateConfig" in method call (line 22, after "manager.")
        // This is member access: manager.validateConfig(...)
        const resolved = SymbolTable.resolveMemberAccess('manager', 'validateConfig', { line: 21, character: 25 }, symbols);
        
        console.log('Resolved method:', JSON.stringify(resolved, null, 2));
        
        assert.ok(resolved, 'Should resolve validateConfig');
        assert.strictEqual(resolved.kind, 'method', 'Should be a method');
        
        // Method should have returnType and parameters for signature display
        if (resolved.kind === 'method') {
            assert.ok('returnType' in resolved, 'Method should have returnType');
            assert.ok('parameters' in resolved, 'Method should have parameters');
            console.log('Method signature info:');
            console.log('  returnType:', (resolved as any).returnType);
            console.log('  parameters:', (resolved as any).parameters);
        }
    });
});
