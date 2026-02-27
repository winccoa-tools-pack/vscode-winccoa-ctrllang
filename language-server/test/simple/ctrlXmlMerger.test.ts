/**
 * Unit tests for ctrlXmlMerger — merges ctrl.xml data with bundled builtins.
 */

import { strict as assert } from 'assert';
import { mergeXmlWithBuiltins, mergeXmlConstants, getMergeStats } from '../../src/ctrlXmlMerger';
import {
    BUILTIN_FUNCTIONS,
    FunctionSignature,
    ConstantInfo,
    setActiveFunctions,
    resetActiveFunctions,
    getBuiltinFunction,
    getAllBuiltinFunctions,
    isBuiltinFunction,
    getActiveFunctionCount,
    setActiveConstants,
    resetActiveConstants,
    getBuiltinConstant,
    getAllBuiltinConstants,
    isBuiltinConstant,
    getActiveConstantCount,
} from '../../src/builtins';
import { CtrlXmlData, CtrlXmlFunction, CtrlXmlConstant } from '../../src/ctrlXmlParser';

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------

function makeXmlFunction(overrides: Partial<CtrlXmlFunction> & { name: string }): CtrlXmlFunction {
    return {
        aliases: [],
        returnType: 'void',
        parameters: [],
        deprecated: false,
        isConst: false,
        useRetval: false,
        noReturn: false,
        leakIgnore: false,
        sourceFile: 'test.xml',
        ...overrides,
    };
}

function makeXmlData(
    fns: CtrlXmlFunction[],
    consts?: CtrlXmlConstant[]
): CtrlXmlData {
    const functions = new Map<string, CtrlXmlFunction>();
    for (const fn of fns) {
        functions.set(fn.name, fn);
        for (const alias of fn.aliases) {
            if (alias !== fn.name) functions.set(alias, fn);
        }
    }
    const constants = new Map<string, CtrlXmlConstant>();
    for (const c of consts ?? []) {
        constants.set(c.name, c);
    }
    return { functions, constants, duplicates: [], sourceFiles: ['test.xml'] };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

suite('ctrlXmlMerger — mergeXmlWithBuiltins', () => {
    test('function in both XML and bundled gets XML signature + bundled description', () => {
        // 'abs' exists in BUILTIN_FUNCTIONS
        const absBundled = BUILTIN_FUNCTIONS.get('abs');
        assert.ok(absBundled, 'abs should exist in bundled builtins');

        const xmlAbs = makeXmlFunction({
            name: 'abs',
            returnType: 'float',
            parameters: [{ nr: '1', name: 'value', type: 'float', optional: false, variadic: false, direction: 'in', notUninit: false }],
            isConst: true,
            sourceFile: 'ctrl.xml',
        });

        const merged = mergeXmlWithBuiltins(makeXmlData([xmlAbs]));
        const result = merged.get('abs');
        assert.ok(result);

        // Should use XML signature
        assert.equal(result.returnType, 'float');
        assert.equal(result.parameters[0].type, 'float');
        assert.equal(result.isConst, true);
        assert.equal(result.sourceFile, 'ctrl.xml');

        // Should keep bundled description/docUrl
        assert.equal(result.description, absBundled!.description);
        assert.equal(result.docUrl, absBundled!.docUrl);
    });

    test('function only in XML gets entry without description', () => {
        const xmlOnly = makeXmlFunction({
            name: 'myCustomXmlFunction_test',
            returnType: 'int',
            parameters: [],
        });

        const merged = mergeXmlWithBuiltins(makeXmlData([xmlOnly]));
        const result = merged.get('myCustomXmlFunction_test');
        assert.ok(result);
        assert.equal(result.returnType, 'int');
        assert.equal(result.description, undefined);
        assert.equal(result.docUrl, undefined);
    });

    test('function only in bundled is kept as-is', () => {
        const emptyXml = makeXmlData([]);
        const merged = mergeXmlWithBuiltins(emptyXml);

        // All bundled functions should be present
        for (const [name, fn] of BUILTIN_FUNCTIONS) {
            const result = merged.get(name);
            assert.ok(result, `bundled function '${name}' should be in merged`);
            assert.equal(result.description, fn.description);
        }
    });

    test('merged map is larger than bundled when XML has extra functions', () => {
        const xmlExtra = makeXmlFunction({ name: 'xmlExtraFunction_test', returnType: 'void' });
        const merged = mergeXmlWithBuiltins(makeXmlData([xmlExtra]));
        assert.ok(merged.size >= BUILTIN_FUNCTIONS.size + 1);
    });

    test('aliases from XML are registered as separate entries', () => {
        const xmlFn = makeXmlFunction({
            name: 'dpGet',
            aliases: ['dpGet', 'dpGetAlias_test'],
            returnType: 'int',
        });

        const merged = mergeXmlWithBuiltins(makeXmlData([xmlFn]));
        assert.ok(merged.has('dpGet'));
        assert.ok(merged.has('dpGetAlias_test'));
    });

    test('out-direction parameters get byRef=true for backward compat', () => {
        const xmlFn = makeXmlFunction({
            name: 'testDirection_test',
            returnType: 'void',
            parameters: [{
                nr: '1', name: 'output', type: 'string',
                optional: false, variadic: false, direction: 'out', notUninit: false,
            }],
        });

        const merged = mergeXmlWithBuiltins(makeXmlData([xmlFn]));
        const result = merged.get('testDirection_test');
        assert.ok(result);
        assert.equal(result.parameters[0].direction, 'out');
        assert.equal(result.parameters[0].byRef, true);
    });

    test('deprecated XML function carries deprecation reason', () => {
        const xmlFn = makeXmlFunction({
            name: 'oldFunc_test',
            returnType: 'void',
            deprecated: true,
            deprecationReason: 'Use newFunc instead',
        });

        const merged = mergeXmlWithBuiltins(makeXmlData([xmlFn]));
        const result = merged.get('oldFunc_test');
        assert.ok(result);
        assert.equal(result.deprecated, true);
        assert.equal(result.deprecationReason, 'Use newFunc instead');
    });

    test('empty XML produces same set as bundled builtins', () => {
        const merged = mergeXmlWithBuiltins(makeXmlData([]));
        assert.equal(merged.size, BUILTIN_FUNCTIONS.size);
    });
});

suite('ctrlXmlMerger — getMergeStats', () => {
    test('stats reflect the correct counts', () => {
        const xmlFns = [
            makeXmlFunction({ name: 'abs', returnType: 'float' }), // also in bundled
            makeXmlFunction({ name: 'uniqueXml_test', returnType: 'void' }), // only in XML
        ];
        const xmlData = makeXmlData(xmlFns);
        const merged = mergeXmlWithBuiltins(xmlData);
        const stats = getMergeStats(xmlData, merged);

        assert.equal(stats.enriched, 1, 'abs is both in XML and bundled');
        assert.equal(stats.xmlOnly, 1, 'uniqueXml_test is only in XML');
        assert.ok(stats.bundledOnly >= BUILTIN_FUNCTIONS.size - 1, 'remaining are bundled-only');
        assert.equal(stats.total, merged.size);
    });
});

suite('builtins — Active functions mechanism', () => {
    // Reset after each test to not affect other test suites
    teardown(() => {
        resetActiveFunctions();
    });

    test('default active functions are bundled builtins', () => {
        assert.ok(isBuiltinFunction('abs'));
        assert.equal(getBuiltinFunction('abs')?.name, 'abs');
        assert.equal(getActiveFunctionCount(), BUILTIN_FUNCTIONS.size);
    });

    test('setActiveFunctions replaces the active map', () => {
        const custom = new Map<string, FunctionSignature>();
        custom.set('testOnly', {
            name: 'testOnly',
            returnType: 'void',
            parameters: [],
        });

        setActiveFunctions(custom);
        assert.ok(isBuiltinFunction('testOnly'));
        assert.ok(!isBuiltinFunction('abs'));
        assert.equal(getActiveFunctionCount(), 1);
        assert.equal(getAllBuiltinFunctions().length, 1);
    });

    test('resetActiveFunctions restores bundled builtins', () => {
        const custom = new Map<string, FunctionSignature>();
        setActiveFunctions(custom);
        assert.equal(getActiveFunctionCount(), 0);

        resetActiveFunctions();
        assert.ok(isBuiltinFunction('abs'));
        assert.equal(getActiveFunctionCount(), BUILTIN_FUNCTIONS.size);
    });
});

suite('ctrlXmlMerger — mergeXmlConstants', () => {
    test('XML constants are included with value and type', () => {
        const xmlData = makeXmlData([], [
            { name: 'MY_CONST', value: '42', type: 'int', sourceFile: 'test.xml' },
        ]);
        const merged = mergeXmlConstants(xmlData);
        const c = merged.get('MY_CONST');
        assert.ok(c);
        assert.equal(c.value, '42');
        assert.equal(c.type, 'int');
        assert.equal(c.sourceFile, 'test.xml');
    });

    test('hardcoded constants from types.ts are included as fallback', () => {
        const xmlData = makeXmlData([]);
        const merged = mergeXmlConstants(xmlData);
        // BIN_REL_PATH is in the hardcoded CONSTANTS set
        assert.ok(merged.has('BIN_REL_PATH'));
        assert.equal(merged.get('BIN_REL_PATH')?.type, 'int');
    });

    test('XML constant wins over hardcoded for same name', () => {
        const xmlData = makeXmlData([], [
            { name: 'BIN_REL_PATH', value: '0', type: 'int', sourceFile: 'ctrl.xml' },
        ]);
        const merged = mergeXmlConstants(xmlData);
        const c = merged.get('BIN_REL_PATH');
        assert.ok(c);
        assert.equal(c.value, '0');
        assert.equal(c.sourceFile, 'ctrl.xml');
    });

    test('empty XML still includes all hardcoded constants', () => {
        const xmlData = makeXmlData([]);
        const merged = mergeXmlConstants(xmlData);
        assert.ok(merged.has('TRUE'));
        assert.ok(merged.has('FALSE'));
        assert.ok(merged.has('MAX_INT'));
        assert.ok(merged.has('PROJ_PATH'));
    });
});

suite('builtins — Active constants mechanism', () => {
    teardown(() => {
        resetActiveConstants();
    });

    test('default active constants are empty', () => {
        assert.equal(getActiveConstantCount(), 0);
        assert.ok(!isBuiltinConstant('BIN_REL_PATH'));
    });

    test('setActiveConstants makes constants available', () => {
        const constants = new Map<string, ConstantInfo>();
        constants.set('BIN_REL_PATH', { name: 'BIN_REL_PATH', value: '0', type: 'int' });
        constants.set('MAX_INT', { name: 'MAX_INT', value: '2147483647', type: 'int' });

        setActiveConstants(constants);
        assert.ok(isBuiltinConstant('BIN_REL_PATH'));
        assert.equal(getBuiltinConstant('BIN_REL_PATH')?.value, '0');
        assert.equal(getActiveConstantCount(), 2);
        assert.equal(getAllBuiltinConstants().length, 2);
    });

    test('resetActiveConstants clears all constants', () => {
        const constants = new Map<string, ConstantInfo>();
        constants.set('TEST', { name: 'TEST', type: 'int' });
        setActiveConstants(constants);
        assert.equal(getActiveConstantCount(), 1);

        resetActiveConstants();
        assert.equal(getActiveConstantCount(), 0);
    });
});
