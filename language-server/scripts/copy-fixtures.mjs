/**
 * Copy test fixtures to the dist directory for the language-server tests.
 * Cross-platform (Windows + Linux) unlike bash-style cp/mkdir.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

/** Copy all files matching given extensions from src to dest */
function copyFiles(srcDir, destDir, extensions) {
    if (!fs.existsSync(srcDir)) {
        console.warn(`  Skipping (not found): ${srcDir}`);
        return;
    }
    fs.mkdirSync(destDir, { recursive: true });
    const files = fs.readdirSync(srcDir);
    let count = 0;
    for (const file of files) {
        if (extensions.some((ext) => file.endsWith(ext))) {
            fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
            count++;
        }
    }
    console.log(`  Copied ${count} file(s): ${srcDir} -> ${destDir}`);
}

/** Recursively copy a directory */
function copyDir(srcDir, destDir) {
    if (!fs.existsSync(srcDir)) {
        console.warn(`  Skipping (not found): ${srcDir}`);
        return;
    }
    fs.cpSync(srcDir, destDir, { recursive: true });
    console.log(`  Copied dir: ${srcDir} -> ${destDir}`);
}

console.log('Copying language-server test fixtures...');

// 1. Simple test fixtures (.ctl + .xml)
copyFiles(
    path.join(projectRoot, 'test', 'simple', 'fixtures'),
    path.join(projectRoot, '..', 'dist', 'language-server', 'test', 'simple', 'fixtures'),
    ['.ctl', '.xml']
);

// 2. Test workspace scripts
copyDir(
    path.join(projectRoot, '..', 'test-workspace', 'scripts'),
    path.join(projectRoot, '..', 'dist', 'test-workspace', 'scripts')
);

console.log('Done.');
