import fs from 'node:fs';
import path from 'node:path';

const projectRoot = path.resolve(import.meta.dirname, '../..');

// Copy language-server test fixtures
const lsFixturesSrc = path.join(projectRoot, 'language-server', 'test', 'simple', 'fixtures');
const lsFixturesDest = path.join(projectRoot, 'dist', 'language-server', 'test', 'simple', 'fixtures');

if (fs.existsSync(lsFixturesSrc)) {
    fs.mkdirSync(lsFixturesDest, { recursive: true });
    for (const file of fs.readdirSync(lsFixturesSrc).filter(f => f.endsWith('.ctl'))) {
        fs.copyFileSync(path.join(lsFixturesSrc, file), path.join(lsFixturesDest, file));
    }
    console.log(`Copied LS fixtures: ${lsFixturesSrc} -> ${lsFixturesDest}`);
}

// Copy test-workspace scripts
const twSrc = path.join(projectRoot, 'test-workspace', 'scripts');
const twDest = path.join(projectRoot, 'dist', 'test-workspace', 'scripts');

if (fs.existsSync(twSrc)) {
    fs.mkdirSync(twDest, { recursive: true });
    fs.cpSync(twSrc, twDest, { recursive: true });
    console.log(`Copied test-workspace scripts: ${twSrc} -> ${twDest}`);
}
