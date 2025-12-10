import * as fs from 'fs';
import * as path from 'path';

export interface ProjectInfo {
    projectPath: string;
    projectName: string;
    configPath: string;
    logPath: string;
    installPath: string;
    version: string;
    subProjects: string[];
}

/**
 * Resolve #uses statement to file path
 * 
 * Search order:
 * 1. ${projectPath}/scripts/libs/
 * 2. ${projectPath}/scripts/
 * 3. ${subProject}/scripts/libs/ (for each subproject)
 * 4. ${subProject}/scripts/
 * 5. ${installPath}/scripts/libs/
 * 6. ${installPath}/scripts/
 * 
 * @param usesPath - The path from #uses statement (e.g., "myModule" or "subfolder/myModule")
 * @param projectInfo - Project information from API
 * @returns Absolute file path if found, null otherwise
 */
export function resolveUsesPath(usesPath: string, projectInfo: ProjectInfo | null): string | null {
    if (!projectInfo) {
        console.log('[usesResolver] No project info provided');
        return null;
    }

    // Add .ctl extension if not present
    let fileName = usesPath;
    if (!fileName.endsWith('.ctl')) {
        fileName += '.ctl';
    }

    // Normalize path separators for the current platform
    fileName = fileName.replace(/\//g, path.sep).replace(/\\/g, path.sep);
    
    console.log(`[usesResolver] Resolving: "${usesPath}" -> fileName: "${fileName}"`);

    // Ensure paths start with / on Unix or drive letter on Windows
    const ensureAbsolute = (p: string) => {
        if (!p) return p;
        // Unix: must start with /
        if (path.sep === '/' && !p.startsWith('/')) {
            return '/' + p;
        }
        return p;
    };

    const projPath = ensureAbsolute(projectInfo.projectPath);
    const instPath = ensureAbsolute(projectInfo.installPath);

    console.log(`[usesResolver] Normalized projectPath: "${projPath}"`);
    console.log(`[usesResolver] Normalized installPath: "${instPath}"`);

    // Search locations in priority order
    const searchPaths: string[] = [
        // 1. Main project libs
        path.join(projPath, 'scripts', 'libs', fileName),
        // 2. Main project scripts
        path.join(projPath, 'scripts', fileName),
    ];

    // 3. & 4. Subproject libs and scripts
    if (projectInfo.subProjects && projectInfo.subProjects.length > 0) {
        for (const subProject of projectInfo.subProjects) {
            const subPath = ensureAbsolute(subProject);
            searchPaths.push(
                path.join(subPath, 'scripts', 'libs', fileName),
                path.join(subPath, 'scripts', fileName)
            );
        }
    }

    // 5. & 6. Installation libs and scripts
    if (instPath) {
        searchPaths.push(
            path.join(instPath, 'scripts', 'libs', fileName),
            path.join(instPath, 'scripts', fileName)
        );
    }

    console.log(`[usesResolver] Search paths (${searchPaths.length}):`);
    searchPaths.forEach((p, i) => console.log(`  ${i + 1}. ${p}`));

    // Find first existing file
    for (const filePath of searchPaths) {
        try {
            if (fs.existsSync(filePath)) {
                console.log(`[usesResolver] ✓ Found: ${filePath}`);
                return filePath;
            } else {
                console.log(`[usesResolver] ✗ Not found: ${filePath}`);
            }
        } catch (err) {
            console.log(`[usesResolver] ✗ Error checking: ${filePath} - ${err}`);
        }
    }

    console.log(`[usesResolver] No file found for: "${usesPath}"`);
    return null;
}

/**
 * Extract the library path from a #uses statement line
 * 
 * Matches patterns like:
 * - #uses "moduleName"
 * - #uses "subfolder/moduleName"
 * - #uses "moduleName.ctl"
 * 
 * @param line - Line containing #uses statement
 * @returns Library path without quotes, or null if not a #uses statement
 */
export function extractUsesPath(line: string): string | null {
    const match = line.match(/#uses\s+["']([^"']+)["']/);
    return match ? match[1] : null;
}

/**
 * Check if cursor position is within a #uses statement and extract the library path
 * 
 * @param documentText - Full document text
 * @param offset - Cursor offset in the document
 * @returns Object with path and range if cursor is in #uses statement, null otherwise
 */
export function getUsesAtPosition(
    documentText: string,
    offset: number
): { path: string; range: { start: number; end: number } } | null {
    console.log(`[usesResolver] getUsesAtPosition called, offset: ${offset}`);
    
    // Find the line containing the cursor
    let lineStart = offset;
    while (lineStart > 0 && documentText[lineStart - 1] !== '\n') {
        lineStart--;
    }

    let lineEnd = offset;
    while (lineEnd < documentText.length && documentText[lineEnd] !== '\n') {
        lineEnd++;
    }

    const line = documentText.substring(lineStart, lineEnd);
    console.log(`[usesResolver] Line text: "${line}"`);
    
    const usesPath = extractUsesPath(line);
    console.log(`[usesResolver] Extracted path: ${usesPath}`);

    if (!usesPath) {
        return null;
    }

    // Check if cursor is within the #uses statement
    const usesMatch = line.match(/#uses\s+["']([^"']+)["']/);
    if (usesMatch && usesMatch.index !== undefined) {
        const matchStart = lineStart + usesMatch.index;
        const matchEnd = matchStart + usesMatch[0].length;

        console.log(`[usesResolver] Match range: ${matchStart}-${matchEnd}, cursor at: ${offset}`);

        if (offset >= matchStart && offset <= matchEnd) {
            return {
                path: usesPath,
                range: { start: matchStart, end: matchEnd }
            };
        }
    }

    console.log(`[usesResolver] Cursor not in #uses statement range`);
    return null;
}
