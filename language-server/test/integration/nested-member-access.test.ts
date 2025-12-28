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
    
    test('resolves complete member access chain (circle.center.x)', () => {
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
  circle.center.x = 50;
}
`;
        const symbols = SymbolTable.parseFile(code);
        
        // Simulate the chain resolution that server.ts does:
        // Chain: ["circle", "center", "x"]
        
        // Step 1: Resolve "circle" to get its type
        const circleVar = SymbolTable.resolveSymbol('circle', { line: 15, character: 3 }, symbols);
        assert.ok(circleVar, 'Should resolve circle variable');
        assert.strictEqual((circleVar as any).dataType, 'Circle', 'circle should be of type Circle');
        
        // Step 2: Resolve "center" in Circle type
        const centerField = SymbolTable.resolveMemberByType('Circle', 'center', symbols);
        assert.ok(centerField, 'Should resolve center field in Circle');
        assert.strictEqual((centerField as any).dataType, 'Point', 'center should be of type Point');
        
        // Step 3: Resolve "x" in Point type
        const xField = SymbolTable.resolveMemberByType('Point', 'x', symbols);
        assert.ok(xField, 'Should resolve x field in Point');
        assert.strictEqual(xField.name, 'x', 'Field should be named x');
        assert.strictEqual((xField as any).dataType, 'int', 'x should be of type int');
        assert.strictEqual(xField.location.line, 4, 'x should be defined at line 4');
        
        console.log('Complete chain resolution successful: circle.center.x -> Point.x at line', xField.location.line);
    });
});
