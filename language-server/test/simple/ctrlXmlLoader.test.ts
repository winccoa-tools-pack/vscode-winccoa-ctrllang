/**
 * ctrlXmlLoader Unit Tests
 *
 * Tests the discovery, loading, and management of ctrl.xml definition files.
 * Uses mock Connection to verify logging without requiring an LSP server.
 */

import * as assert from 'assert';
import * as path from 'path';
import { CtrlXmlLoader } from '../../src/ctrlXmlLoader';

// ---------------------------------------------------------------------------
// Mock LSP Connection (minimal — only needs console.log)
// ---------------------------------------------------------------------------

function createMockConnection(): { connection: any; logs: string[] } {
    const logs: string[] = [];
    const connection = {
        console: {
            log: (msg: string) => logs.push(msg),
            warn: (msg: string) => logs.push(`WARN: ${msg}`),
            error: (msg: string) => logs.push(`ERROR: ${msg}`),
        },
    };
    return { connection, logs };
}

// ---------------------------------------------------------------------------
// Path helpers
// ---------------------------------------------------------------------------

const FIXTURES_DIR = path.join(__dirname, './fixtures');

// ================================
// CtrlXmlLoader — Loading ctrl.xml
// ================================

suite('CtrlXmlLoader — Load from fixtures', () => {
    let loader: CtrlXmlLoader;
    let logs: string[];

    setup(() => {
        const mock = createMockConnection();
        loader = new CtrlXmlLoader(mock.connection);
        logs = mock.logs;
    });

    test('getData() returns null before any load', () => {
        assert.strictEqual(loader.getData(), null);
    });

    test('loads a single XML file from a simulated install path', async () => {
        // Our fixture dir acts as a fake OA install path that has
        // data/DevTools/Base/ctrl.xml. We need to set up the path so the
        // standard relative path matches. Instead, use additionalPaths.
        const data = await loader.loadDefinitions(
            null,
            [path.join(FIXTURES_DIR, 'ctrl-test.xml')]
        );

        assert.ok(data, 'Should return data');
        assert.ok(data.functions.size > 0, 'Should have functions');
        assert.ok(data.constants.size > 0, 'Should have constants');
    });

    test('loaded data is cached in getData()', async () => {
        await loader.loadDefinitions(
            null,
            [path.join(FIXTURES_DIR, 'ctrl-test.xml')]
        );

        const cached = loader.getData();
        assert.ok(cached, 'getData() should return the loaded data');
        assert.ok(cached.functions.size > 0);
    });

    test('loads multiple XML files and merges them', async () => {
        const data = await loader.loadDefinitions(
            null,
            [
                path.join(FIXTURES_DIR, 'ctrl-test.xml'),
                path.join(FIXTURES_DIR, 'ctrl-addon.xml'),
            ]
        );

        assert.ok(data, 'Should return merged data');
        // addonHelper is only in ctrl-addon.xml
        assert.ok(data.functions.has('addonHelper'), 'Should have addonHelper from addon');
        // dpGet is only in ctrl-test.xml
        assert.ok(data.functions.has('dpGet'), 'Should have dpGet from primary');
    });

    test('primary file wins for duplicate symbols', async () => {
        const data = await loader.loadDefinitions(
            null,
            [
                path.join(FIXTURES_DIR, 'ctrl-test.xml'),
                path.join(FIXTURES_DIR, 'ctrl-addon.xml'),
            ]
        );

        assert.ok(data);
        // abs is in both — ctrl-test.xml (first = higher priority) returns int
        const abs = data.functions.get('abs');
        assert.ok(abs);
        assert.strictEqual(abs.returnType, 'int', 'First file wins for abs');
    });

    test('reports duplicate warnings', async () => {
        const data = await loader.loadDefinitions(
            null,
            [
                path.join(FIXTURES_DIR, 'ctrl-test.xml'),
                path.join(FIXTURES_DIR, 'ctrl-addon.xml'),
            ]
        );

        assert.ok(data);
        assert.ok(data.duplicates.length > 0, 'Should have duplicate warnings');
        const absDup = data.duplicates.find(d => d.symbolName === 'abs');
        assert.ok(absDup, 'Should warn about duplicate abs');
    });

    test('logs loading statistics', async () => {
        await loader.loadDefinitions(
            null,
            [path.join(FIXTURES_DIR, 'ctrl-test.xml')]
        );

        const statLog = logs.find(l => l.includes('Loaded') && l.includes('functions'));
        assert.ok(statLog, 'Should log statistics');
    });
});

// ================================
// CtrlXmlLoader — Missing files
// ================================

suite('CtrlXmlLoader — Missing & invalid files', () => {
    let loader: CtrlXmlLoader;
    let logs: string[];

    setup(() => {
        const mock = createMockConnection();
        loader = new CtrlXmlLoader(mock.connection);
        logs = mock.logs;
    });

    test('returns null when no files can be loaded', async () => {
        const data = await loader.loadDefinitions(null, []);
        assert.strictEqual(data, null);
    });

    test('skips non-existent additional files', async () => {
        const data = await loader.loadDefinitions(
            null,
            ['/non/existent/file.xml']
        );

        assert.strictEqual(data, null, 'No valid files = null');
        const warnLog = logs.find(l => l.includes('not found'));
        assert.ok(warnLog, 'Should log warning about missing file');
    });

    test('skips non-existent install path gracefully', async () => {
        const data = await loader.loadDefinitions(
            '/fake/oa/install',
            []
        );

        assert.strictEqual(data, null);
        const warnLog = logs.find(l => l.includes('ctrl.xml not found'));
        assert.ok(warnLog, 'Should log warning about missing ctrl.xml');
    });

    test('handles relative paths without workspace root', async () => {
        const data = await loader.loadDefinitions(
            null,
            ['./relative/path.xml']
        );

        assert.strictEqual(data, null);
        const warnLog = logs.find(l => l.includes('no workspace root'));
        assert.ok(warnLog, 'Should warn about missing workspace root');
    });

    test('resolves relative paths with workspace root', async () => {
        // Use the test fixtures directory as workspace root
        const fixturesParent = path.join(FIXTURES_DIR, '..');
        const data = await loader.loadDefinitions(
            null,
            ['./fixtures/ctrl-test.xml'],
            fixturesParent
        );

        assert.ok(data, 'Should resolve relative path');
        assert.ok(data.functions.size > 0);
    });
});

// ================================
// CtrlXmlLoader — clear and reload
// ================================

suite('CtrlXmlLoader — Clear & Reload', () => {
    let loader: CtrlXmlLoader;

    setup(() => {
        const mock = createMockConnection();
        loader = new CtrlXmlLoader(mock.connection);
    });

    test('clear() removes all loaded data', async () => {
        await loader.loadDefinitions(
            null,
            [path.join(FIXTURES_DIR, 'ctrl-test.xml')]
        );
        assert.ok(loader.getData());

        loader.clear();
        assert.strictEqual(loader.getData(), null);
    });

    test('reloadWithSettings uses cached install path', async () => {
        // First load with a "fake" install path (won't have ctrl.xml but that's OK)
        // and one additional file
        await loader.loadDefinitions(
            null,
            [path.join(FIXTURES_DIR, 'ctrl-test.xml')]
        );

        // Reload with different additional files
        const data = await loader.reloadWithSettings(
            [path.join(FIXTURES_DIR, 'ctrl-addon.xml')]
        );

        assert.ok(data, 'Should return reloaded data');
        // Now only addon file should be loaded (no install path → no ctrl.xml)
        assert.ok(data.functions.has('addonHelper'));
    });
});
