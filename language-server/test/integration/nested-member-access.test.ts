import * as assert from 'assert';
import { SymbolTable } from '../../src/symbolTable';

suite('Nested Member Access', () => {
    test('resolves nested struct field access (obj.member.field)', () => {
        const code = `
struct Point
{
  int x;
  int y;
};

struct Circle
{
  Point center;
  int radius;
};

main()
{
  Circle circle;
  circle.center.x = 50;  // Test: center.x should resolve to Point.x
}
`;
        const symbols = SymbolTable.parseFile(code);
        
        // Step 1: Resolve circle.center -> should give us a field with dataType "Point"
        const centerField = SymbolTable.resolveMemberAccess('circle', 'center', { line: 15, character: 10 }, symbols);
        console.log('Step 1 - circle.center:', JSON.stringify(centerField, null, 2));
        
        assert.ok(centerField, 'Should resolve center field');
        assert.strictEqual(centerField.kind, 'member', 'center should be a member');
        assert.strictEqual((centerField as any).dataType, 'Point', 'center should be of type Point');
        
        // Step 2: Now resolve center.x by using the type we got from Step 1
        // We know center is of type "Point", so we can directly search in Point struct
        const xField = SymbolTable.resolveMemberByType('Point', 'x', symbols);
        console.log('Step 2 - Point.x:', JSON.stringify(xField, null, 2));
        
        assert.ok(xField, 'Should resolve x field in Point struct');
        assert.strictEqual(xField.kind, 'member', 'x should be a member/field');
        assert.strictEqual(xField.name, 'x', 'Field should be named x');
        
        // This demonstrates how server.ts can handle nested member access:
        // 1. Parse expression "circle.center.x" into parts: ["circle", "center", "x"]
        // 2. Resolve "circle.center" -> get field with dataType "Point"
        // 3. Resolve "Point.x" using resolveMemberByType -> get field definition
    });
    
    test('handles duplicate struct definitions (local vs cross-file)', () => {
        const code = `
// Local Point definition
struct Point
{
  float x;  // float type
  float y;
};

// Circle uses Point from DataStructures.ctl (via #uses)
struct Circle
{
  Point center;  // Which Point? Local or cross-file?
  int radius;
};

main()
{
  Circle circle;
  circle.center.x = 50;  // Should resolve to correct Point.x
}
`;
        const symbols = SymbolTable.parseFile(code);
        
        // Find both Point structs
        const pointStructs = symbols.structs.filter(s => s.name === 'Point');
        console.log('Found Point structs:', pointStructs.length);
        
        // When Circle references Point, it should use the first/local one (or should it?)
        const circleStruct = symbols.structs.find(s => s.name === 'Circle');
        assert.ok(circleStruct, 'Should find Circle struct');
        
        const centerField = circleStruct!.fields.find(f => f.name === 'center');
        assert.ok(centerField, 'Should find center field');
        console.log('center field type:', centerField!.dataType);
        
        // The question: How do we know which Point definition is used?
        // Answer: Struct resolution should prioritize based on scope/imports
    });
});
