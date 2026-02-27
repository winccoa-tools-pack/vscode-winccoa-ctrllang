/**
 * Enum Hover and Goto-Definition Tests
 * 
 * Tests hover information and navigation for enum types and members.
 */

import * as assert from 'assert';
import * as path from 'path';
import * as fs from 'fs';
import { pathToFileURL } from 'url';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { Position } from 'vscode-languageserver';
import { SymbolTable, SymbolKind } from '../../src/symbolTable';
import { getSymbolAtPosition } from '../../src/symbolFinder';
import { HoverService } from '../../src/services/hoverService';
import { DefinitionService } from '../../src/services/definitionService';
import { SymbolCache } from '../../src/core/symbolCache';

// Cross-platform default URI (file:///C:/Users/.../test.ctl on Windows, file:///tmp/test.ctl on Linux)
const defaultTestUri = pathToFileURL(path.resolve(__dirname, 'test.ctl')).toString();

// Helper to create TextDocument from content
function createDocumentFromContent(content: string, uri: string = defaultTestUri): TextDocument {
    return TextDocument.create(uri, 'ctl', 1, content);
}

suite('Enum Hover and Goto-Definition Tests', () => {
    
    let symbolCache: SymbolCache;
    let hoverService: HoverService;
    let definitionService: DefinitionService;
    
    setup(() => {
        symbolCache = new SymbolCache();
        hoverService = new HoverService(symbolCache, async () => null);
        definitionService = new DefinitionService(symbolCache, async () => null);
    });
    
    test('Hover: Enum type shows all members', async () => {
        const content = `
enum Color {
    RED,
    GREEN,
    BLUE
};

Color myColor;
`;
        
        const doc = createDocumentFromContent(content);
        const symbols = SymbolTable.parseFile(content);
        
        // Parse enums
        assert.ok(symbols.enums, 'Should have enums');
        assert.strictEqual(symbols.enums.length, 1, 'Should have 1 enum');
        
        const enumSymbol = symbols.enums[0];
        assert.strictEqual(enumSymbol.name, 'Color');
        assert.strictEqual(enumSymbol.members.length, 3);
        assert.strictEqual(enumSymbol.members[0].name, 'RED');
        assert.strictEqual(enumSymbol.members[0].value, 0);
        assert.strictEqual(enumSymbol.members[1].name, 'GREEN');
        assert.strictEqual(enumSymbol.members[1].value, 1);
        assert.strictEqual(enumSymbol.members[2].name, 'BLUE');
        assert.strictEqual(enumSymbol.members[2].value, 2);
    });
    
    test('Hover: Enum type name in variable declaration', async () => {
        const content = `
enum LogLevel {
    DEBUG,
    INFO,
    WARNING,
    FATAL
};

LogLevel level;
`;
        
        const doc = createDocumentFromContent(content);
        
        // Position on "LogLevel" in variable declaration (line 8, col 0)
        const position = Position.create(8, 0);
        const hover = await hoverService.handle(doc, position);
        
        assert.ok(hover, 'Should provide hover information');
        assert.ok(hover.contents, 'Should have contents');
        
        const hoverText = typeof hover.contents === 'string' 
            ? hover.contents 
            : 'value' in hover.contents 
                ? hover.contents.value 
                : '';
        
        assert.ok(hoverText.includes('enum LogLevel'), 'Should show enum keyword');
        assert.ok(hoverText.includes('DEBUG'), 'Should show DEBUG member');
        assert.ok(hoverText.includes('INFO'), 'Should show INFO member');
        assert.ok(hoverText.includes('WARNING'), 'Should show WARNING member');
        assert.ok(hoverText.includes('FATAL'), 'Should show FATAL member');
    });
    
    test('Hover: Enum member with :: operator', async () => {
        const content = `
enum Color {
    RED,
    GREEN,
    BLUE
};

Color c = Color::RED;
`;
        
        const doc = createDocumentFromContent(content);
        
        // Position on "RED" in Color::RED (line 7, col 17)
        const position = Position.create(7, 17);
        const hover = await hoverService.handle(doc, position);
        
        assert.ok(hover, 'Should provide hover information');
        assert.ok(hover.contents, 'Should have contents');
        
        const hoverText = typeof hover.contents === 'string' 
            ? hover.contents 
            : 'value' in hover.contents 
                ? hover.contents.value 
                : '';
        
        assert.ok(hoverText.includes('Color::RED'), 'Should show Color::RED');
        assert.ok(hoverText.includes('0') || hoverText.includes('= 0'), 'Should show value 0');
    });
    
    test('Hover: Enum member with explicit value', async () => {
        const content = `
enum Priority {
    UNDEFINED = -1,
    LOW = 1,
    MEDIUM = 5,
    HIGH = 10
};

Priority p = Priority::HIGH;
`;
        
        const doc = createDocumentFromContent(content);
        
        // Position on "HIGH" in Priority::HIGH (line 8, col 23)
        const position = Position.create(8, 23);
        const hover = await hoverService.handle(doc, position);
        
        assert.ok(hover, 'Should provide hover information');
        assert.ok(hover.contents, 'Should have contents');
        
        const hoverText = typeof hover.contents === 'string' 
            ? hover.contents 
            : 'value' in hover.contents 
                ? hover.contents.value 
                : '';
        
        assert.ok(hoverText.includes('Priority::HIGH'), 'Should show Priority::HIGH');
        assert.ok(hoverText.includes('10') || hoverText.includes('= 10'), 'Should show value 10');
    });
    
    test('Goto-Definition: Enum type name navigates to enum', async () => {
        const content = `
enum Color {
    RED,
    GREEN,
    BLUE
};

Color myColor;
`;
        
        const doc = createDocumentFromContent(content);
        
        // Position on "Color" in variable declaration (line 7, col 0)
        const position = Position.create(7, 0);
        const definition = await definitionService.handle(doc, position);
        
        assert.ok(definition, 'Should provide definition');
        
        // Check if it's an array or single location
        const locations = Array.isArray(definition) ? definition : [definition];
        assert.strictEqual(locations.length, 1, 'Should have 1 definition');
        
        const location = locations[0];
        assert.ok(location.range, 'Should have range');
        assert.strictEqual(location.range.start.line, 1, 'Should point to line 1 (enum Color)');
    });
    
    test('Goto-Definition: Enum member navigates to enum declaration', async () => {
        const content = `
enum LogLevel {
    DEBUG,
    INFO,
    WARNING,
    FATAL
};

LogLevel level = LogLevel::INFO;
`;
        
        const doc = createDocumentFromContent(content);
        
        // Position on "INFO" in LogLevel::INFO (line 8, col 27)
        const position = Position.create(8, 27);
        const definition = await definitionService.handle(doc, position);
        
        assert.ok(definition, 'Should provide definition');
        
        const locations = Array.isArray(definition) ? definition : [definition];
        assert.strictEqual(locations.length, 1, 'Should have 1 definition');
        
        const location = locations[0];
        assert.ok(location.range, 'Should have range');
        assert.strictEqual(location.range.start.line, 1, 'Should point to line 1 (enum LogLevel)');
    });
    
    test('Symbol Finder: Detect :: operator for enum member', () => {
        const content = `
enum Color {
    RED,
    GREEN,
    BLUE
};

Color c = Color::RED;
`;
        
        const doc = createDocumentFromContent(content);
        
        // Position on "RED" after :: (line 7, col 17)
        const offset = doc.offsetAt(Position.create(7, 17));
        const symbolInfo = getSymbolAtPosition(content, offset);
        
        assert.ok(symbolInfo, 'Should find symbol');
        assert.strictEqual(symbolInfo.name, 'RED', 'Should identify member name');
        assert.ok(symbolInfo.enumAccess, 'Should detect enum access');
        assert.strictEqual(symbolInfo.enumAccess.enumName, 'Color', 'Should identify enum name');
        assert.ok(symbolInfo.memberAccessChain, 'Should have member access chain');
        assert.deepStrictEqual(symbolInfo.memberAccessChain, ['Color', 'RED'], 'Should have correct chain');
    });
    
    test('Symbol Finder: Detect enum type name', () => {
        const content = `
enum Priority {
    LOW,
    HIGH
};

Priority p;
`;
        
        const doc = createDocumentFromContent(content);
        
        // Position on "Priority" in variable declaration (line 6, col 0)
        const offset = doc.offsetAt(Position.create(6, 0));
        const symbolInfo = getSymbolAtPosition(content, offset);
        
        assert.ok(symbolInfo, 'Should find symbol');
        assert.strictEqual(symbolInfo.name, 'Priority', 'Should identify enum type name');
    });
    
    test('Hover: Enum in switch case', async () => {
        const content = `
enum Color {
    RED,
    GREEN,
    BLUE
};

void testSwitch(Color c) {
    switch (c) {
        case Color::RED:
            break;
        case Color::GREEN:
            break;
    }
}
`;
        
        const doc = createDocumentFromContent(content);
        
        // Position on "RED" in case Color::RED
        const position = Position.create(9, 20);
        const hover = await hoverService.handle(doc, position);
        
        assert.ok(hover, 'Should provide hover information');
        assert.ok(hover.contents, 'Should have contents');
        
        const hoverText = typeof hover.contents === 'string' 
            ? hover.contents 
            : 'value' in hover.contents 
                ? hover.contents.value 
                : '';
        
        assert.ok(hoverText.includes('Color::RED'), 'Should show Color::RED');
        assert.ok(hoverText.includes('0') || hoverText.includes('= 0'), 'Should show value');
    });
    
    test('Hover: Global enum', async () => {
        const content = `
global enum Status {
    IDLE,
    RUNNING,
    STOPPED
};

Status s = Status::RUNNING;
`;
        
        const doc = createDocumentFromContent(content);
        const symbols = SymbolTable.parseFile(content);
        
        assert.ok(symbols.enums, 'Should have enums');
        assert.strictEqual(symbols.enums.length, 1);
        
        const enumSymbol = symbols.enums[0];
        assert.strictEqual(enumSymbol.name, 'Status');
        assert.strictEqual(enumSymbol.isGlobal, true, 'Should be marked as global');
        
        // Hover on "RUNNING"
        const position = Position.create(7, 21);
        const hover = await hoverService.handle(doc, position);
        
        assert.ok(hover, 'Should provide hover information');
    });
});
