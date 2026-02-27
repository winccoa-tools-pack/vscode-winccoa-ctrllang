/**
 * ctrlXmlParser Unit Tests
 *
 * Tests the runtime parser for ctrl.xml (cppcheck XML config format v2).
 * Covers: constants, functions, aliases, flags, parameters, merge, duplicates.
 */

import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import {
    parseCtrlXml,
    mergeCtrlXmlSources,
    CtrlXmlData,
    CtrlXmlFunction,
    CtrlXmlConstant,
} from '../../src/ctrlXmlParser';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const FIXTURES_DIR = path.join(__dirname, './fixtures');

function loadFixture(filename: string): string {
    return fs.readFileSync(path.join(FIXTURES_DIR, filename), 'utf-8');
}

function parseFixture(filename: string): CtrlXmlData {
    const content = loadFixture(filename);
    return parseCtrlXml(content, filename);
}

// ================================
// parseCtrlXml — Constants
// ================================

suite('ctrlXmlParser — Constants', () => {
    let data: CtrlXmlData;

    suiteSetup(() => {
        data = parseFixture('ctrl-test.xml');
    });

    test('parses all constants', () => {
        assert.strictEqual(data.constants.size, 6);
    });

    test('parses simple boolean constant (no type → int)', () => {
        const c = data.constants.get('FALSE');
        assert.ok(c, 'FALSE should exist');
        assert.strictEqual(c.name, 'FALSE');
        assert.strictEqual(c.value, 'false');
        assert.strictEqual(c.type, 'int');
        assert.strictEqual(c.sourceFile, 'ctrl-test.xml');
    });

    test('parses float constant', () => {
        const c = data.constants.get('M_PI');
        assert.ok(c, 'M_PI should exist');
        assert.strictEqual(c.value, '3.1415926535898');
        assert.strictEqual(c.type, 'float');
    });

    test('parses string constant', () => {
        const c = data.constants.get('PROJ');
        assert.ok(c, 'PROJ should exist');
        assert.strictEqual(c.value, 'myProject');
        assert.strictEqual(c.type, 'string');
    });

    test('parses bool constant', () => {
        const c = data.constants.get('SOME_FLAG');
        assert.ok(c, 'SOME_FLAG should exist');
        assert.strictEqual(c.value, '1');
        assert.strictEqual(c.type, 'bool');
    });

    test('parses int constant (default type)', () => {
        const c = data.constants.get('DPEL_INT');
        assert.ok(c, 'DPEL_INT should exist');
        assert.strictEqual(c.value, '21');
        assert.strictEqual(c.type, 'int');
    });

    test('tracks source file', () => {
        for (const [, c] of data.constants) {
            assert.strictEqual(c.sourceFile, 'ctrl-test.xml');
        }
    });
});

// ================================
// parseCtrlXml — Functions: Basic
// ================================

suite('ctrlXmlParser — Functions (Basic)', () => {
    let data: CtrlXmlData;

    suiteSetup(() => {
        data = parseFixture('ctrl-test.xml');
    });

    test('parses all functions (including alias entries)', () => {
        // Functions from fixture: breakExitLoop, abs, dpGet, dpSet, dpSetWait,
        // oldFunction, strlen, exit, dpCopy, initialize = 10 entries
        // (dpSet and dpSetWait point to same object)
        assert.ok(data.functions.size >= 10, `Expected ≥10 entries, got ${data.functions.size}`);
    });

    test('parses simple function (no args, no return)', () => {
        const fn = data.functions.get('initialize');
        assert.ok(fn, 'initialize should exist');
        assert.strictEqual(fn.name, 'initialize');
        assert.strictEqual(fn.returnType, '');
        assert.strictEqual(fn.parameters.length, 0);
        assert.strictEqual(fn.deprecated, false);
        assert.strictEqual(fn.isConst, false);
        assert.strictEqual(fn.useRetval, false);
        assert.strictEqual(fn.noReturn, false);
    });

    test('parses function with return type and args', () => {
        const fn = data.functions.get('abs');
        assert.ok(fn, 'abs should exist');
        assert.strictEqual(fn.returnType, 'int');
        assert.strictEqual(fn.parameters.length, 1);
        assert.strictEqual(fn.parameters[0].name, 'value');
        assert.strictEqual(fn.parameters[0].type, 'int');
        assert.strictEqual(fn.parameters[0].direction, 'in');
        assert.strictEqual(fn.useRetval, true);
    });

    test('parses function with out-parameter and not-uninit', () => {
        const fn = data.functions.get('dpGet');
        assert.ok(fn, 'dpGet should exist');
        assert.strictEqual(fn.returnType, 'int');
        assert.strictEqual(fn.parameters.length, 2);

        // First arg: string, not-uninit
        assert.strictEqual(fn.parameters[0].name, 'dpName');
        assert.strictEqual(fn.parameters[0].type, 'string');
        assert.strictEqual(fn.parameters[0].direction, 'in');
        assert.strictEqual(fn.parameters[0].notUninit, true);

        // Second arg: out direction, no type = anytype
        assert.strictEqual(fn.parameters[1].name, 'value');
        assert.strictEqual(fn.parameters[1].type, 'anytype');
        assert.strictEqual(fn.parameters[1].direction, 'out');
    });

    test('parses function with optional parameter (default)', () => {
        const fn = data.functions.get('dpCopy');
        assert.ok(fn, 'dpCopy should exist');
        assert.strictEqual(fn.parameters.length, 4);

        // Arg 4: has default
        const arg4 = fn.parameters[3];
        assert.strictEqual(arg4.name, 'recursive');
        assert.strictEqual(arg4.optional, true);

        // Arg 3: out direction
        const arg3 = fn.parameters[2];
        assert.strictEqual(arg3.name, 'errorMsg');
        assert.strictEqual(arg3.direction, 'out');
        assert.strictEqual(arg3.optional, false);
    });

    test('tracks source file on functions', () => {
        for (const [, fn] of data.functions) {
            assert.strictEqual(fn.sourceFile, 'ctrl-test.xml');
        }
    });
});

// ================================
// parseCtrlXml — Functions: Aliases
// ================================

suite('ctrlXmlParser — Function Aliases', () => {
    let data: CtrlXmlData;

    suiteSetup(() => {
        data = parseFixture('ctrl-test.xml');
    });

    test('comma-separated names create alias entries in map', () => {
        const dpSet = data.functions.get('dpSet');
        const dpSetWait = data.functions.get('dpSetWait');
        assert.ok(dpSet, 'dpSet should exist');
        assert.ok(dpSetWait, 'dpSetWait should exist');
    });

    test('aliases point to same function object', () => {
        const dpSet = data.functions.get('dpSet');
        const dpSetWait = data.functions.get('dpSetWait');
        assert.strictEqual(dpSet, dpSetWait, 'Both entries should be the same object');
    });

    test('primary name is the first in the comma list', () => {
        const dpSet = data.functions.get('dpSet');
        assert.ok(dpSet);
        assert.strictEqual(dpSet.name, 'dpSet');
    });

    test('aliases array contains all names', () => {
        const dpSet = data.functions.get('dpSet');
        assert.ok(dpSet);
        assert.deepStrictEqual(dpSet.aliases, ['dpSet', 'dpSetWait']);
    });
});

// ================================
// parseCtrlXml — Functions: Variadic
// ================================

suite('ctrlXmlParser — Variadic Parameters', () => {
    let data: CtrlXmlData;

    suiteSetup(() => {
        data = parseFixture('ctrl-test.xml');
    });

    test('variadic parameter is detected', () => {
        const fn = data.functions.get('dpSet');
        assert.ok(fn, 'dpSet should exist');
        const variadic = fn.parameters.find((p) => p.variadic);
        assert.ok(variadic, 'Should have a variadic parameter');
        assert.strictEqual(variadic.nr, 'variadic');
    });

    test('variadic parameter is sorted after positional args', () => {
        const fn = data.functions.get('dpSet');
        assert.ok(fn);
        assert.strictEqual(fn.parameters.length, 2);
        assert.strictEqual(fn.parameters[0].variadic, false);
        assert.strictEqual(fn.parameters[1].variadic, true);
    });
});

// ================================
// parseCtrlXml — Functions: Flags
// ================================

suite('ctrlXmlParser — Function Flags', () => {
    let data: CtrlXmlData;

    suiteSetup(() => {
        data = parseFixture('ctrl-test.xml');
    });

    test('deprecated function with reason', () => {
        const fn = data.functions.get('oldFunction');
        assert.ok(fn, 'oldFunction should exist');
        assert.strictEqual(fn.deprecated, true);
        assert.strictEqual(fn.deprecationReason, 'Obsolescent');
        assert.strictEqual(fn.deprecationSeverity, 'style');
    });

    test('const function', () => {
        const fn = data.functions.get('strlen');
        assert.ok(fn, 'strlen should exist');
        assert.strictEqual(fn.isConst, true);
    });

    test('use-retval flag', () => {
        const fn = data.functions.get('strlen');
        assert.ok(fn);
        assert.strictEqual(fn.useRetval, true);
    });

    test('leak-ignore flag', () => {
        const fn = data.functions.get('strlen');
        assert.ok(fn);
        assert.strictEqual(fn.leakIgnore, true);
    });

    test('noreturn function', () => {
        const fn = data.functions.get('exit');
        assert.ok(fn, 'exit should exist');
        assert.strictEqual(fn.noReturn, true);
    });

    test('noreturn=false is not flagged', () => {
        const fn = data.functions.get('breakExitLoop');
        assert.ok(fn, 'breakExitLoop should exist');
        assert.strictEqual(fn.noReturn, false);
    });

    test('exit has optional parameter', () => {
        const fn = data.functions.get('exit');
        assert.ok(fn);
        assert.strictEqual(fn.parameters.length, 1);
        assert.strictEqual(fn.parameters[0].optional, true);
        assert.strictEqual(fn.parameters[0].name, 'exitCode');
        assert.strictEqual(fn.parameters[0].type, 'int');
    });
});

// ================================
// parseCtrlXml — Error Handling
// ================================

suite('ctrlXmlParser — Error Handling', () => {
    test('throws on missing <def> root element', () => {
        assert.throws(
            () => parseCtrlXml('<root><item/></root>', 'bad.xml'),
            /missing <def> root element/
        );
    });

    test('handles empty <def> element', () => {
        const data = parseCtrlXml('<def format="2"></def>', 'empty.xml');
        assert.strictEqual(data.functions.size, 0);
        assert.strictEqual(data.constants.size, 0);
    });

    test('handles empty XML with only def and no children', () => {
        const data = parseCtrlXml('<?xml version="1.0"?><def format="2"/>', 'minimal.xml');
        assert.strictEqual(data.functions.size, 0);
        assert.strictEqual(data.constants.size, 0);
    });

    test('skips defines without name attribute', () => {
        const xml = '<def format="2"><define value="123"/></def>';
        const data = parseCtrlXml(xml, 'test.xml');
        assert.strictEqual(data.constants.size, 0);
    });

    test('skips functions without name attribute', () => {
        const xml = '<def format="2"><function><arg nr="1"/></function></def>';
        const data = parseCtrlXml(xml, 'test.xml');
        assert.strictEqual(data.functions.size, 0);
    });
});

// ================================
// mergeCtrlXmlSources
// ================================

suite('ctrlXmlParser — Merge Sources', () => {
    let primary: CtrlXmlData;
    let secondary: CtrlXmlData;

    suiteSetup(() => {
        primary = parseFixture('ctrl-test.xml');
        secondary = parseFixture('ctrl-addon.xml');
    });

    test('merged data contains all unique functions', () => {
        const merged = mergeCtrlXmlSources([primary, secondary]);
        assert.ok(merged.functions.has('abs'), 'abs from primary');
        assert.ok(merged.functions.has('dpGet'), 'dpGet from primary');
        assert.ok(merged.functions.has('addonHelper'), 'addonHelper from secondary');
    });

    test('merged data contains all unique constants', () => {
        const merged = mergeCtrlXmlSources([primary, secondary]);
        assert.ok(merged.constants.has('FALSE'), 'FALSE from primary');
        assert.ok(merged.constants.has('ADDON_CONST'), 'ADDON_CONST from secondary');
    });

    test('primary wins for duplicate functions', () => {
        const merged = mergeCtrlXmlSources([primary, secondary]);
        const abs = merged.functions.get('abs');
        assert.ok(abs);
        assert.strictEqual(abs.returnType, 'int', 'Primary abs returns int');
        assert.strictEqual(abs.sourceFile, 'ctrl-test.xml');
    });

    test('primary wins for duplicate constants', () => {
        const merged = mergeCtrlXmlSources([primary, secondary]);
        const dpelInt = merged.constants.get('DPEL_INT');
        assert.ok(dpelInt);
        assert.strictEqual(dpelInt.value, '21', 'Primary DPEL_INT = 21');
        assert.strictEqual(dpelInt.sourceFile, 'ctrl-test.xml');
    });

    test('duplicate warnings are generated for functions', () => {
        const merged = mergeCtrlXmlSources([primary, secondary]);
        const fnDupes = merged.duplicates.filter(
            (d) => d.type === 'function' && d.symbolName === 'abs'
        );
        assert.strictEqual(fnDupes.length, 1, 'Should have 1 duplicate warning for abs');
        assert.strictEqual(fnDupes[0].resolvedFrom, 'ctrl-test.xml');
        assert.ok(fnDupes[0].files.includes('ctrl-addon.xml'));
    });

    test('duplicate warnings are generated for constants', () => {
        const merged = mergeCtrlXmlSources([primary, secondary]);
        const constDupes = merged.duplicates.filter(
            (d) => d.type === 'constant' && d.symbolName === 'DPEL_INT'
        );
        assert.strictEqual(constDupes.length, 1, 'Should have 1 duplicate warning for DPEL_INT');
        assert.strictEqual(constDupes[0].resolvedFrom, 'ctrl-test.xml');
    });

    test('all source files are tracked', () => {
        const merged = mergeCtrlXmlSources([primary, secondary]);
        assert.ok(merged.sourceFiles.includes('ctrl-test.xml'));
        assert.ok(merged.sourceFiles.includes('ctrl-addon.xml'));
    });

    test('merging empty sources produces empty result', () => {
        const merged = mergeCtrlXmlSources([]);
        assert.strictEqual(merged.functions.size, 0);
        assert.strictEqual(merged.constants.size, 0);
        assert.strictEqual(merged.duplicates.length, 0);
    });

    test('reversed priority changes which source wins', () => {
        const merged = mergeCtrlXmlSources([secondary, primary]);
        const abs = merged.functions.get('abs');
        assert.ok(abs);
        // Now secondary is higher priority
        assert.strictEqual(abs.returnType, 'float', 'Secondary abs returns float');
        assert.strictEqual(abs.sourceFile, 'ctrl-addon.xml');
    });
});

// ================================
// parseCtrlXml — sourceFiles field
// ================================

suite('ctrlXmlParser — Source Tracking', () => {
    test('single parse tracks one source file', () => {
        const data = parseFixture('ctrl-test.xml');
        assert.deepStrictEqual(data.sourceFiles, ['ctrl-test.xml']);
    });

    test('duplicates array is empty for single source', () => {
        const data = parseFixture('ctrl-test.xml');
        assert.strictEqual(data.duplicates.length, 0);
    });
});
