/**
 * ctrlXmlLoader.ts — Discovery, loading, and management of ctrl.xml definition files.
 *
 * Coordinates:
 * 1. Finding ctrl.xml in the WinCC OA installation directory
 * 2. Loading user-configured additional XML definition files
 * 3. Parsing all sources and merging them with priority order
 * 4. Reporting statistics and duplicate warnings
 *
 * Used by the Language Server — receives the OA install path via custom
 * LSP notification from the extension (which manages OA version resolution).
 */

import * as fs from 'fs';
import * as path from 'path';
import { Connection } from 'vscode-languageserver/node';
import {
    parseCtrlXml,
    mergeCtrlXmlSources,
    CtrlXmlData,
} from './ctrlXmlParser';

/** Standard relative path to ctrl.xml within an OA installation */
const CTRL_XML_REL_PATH = path.join('data', 'DevTools', 'Base', 'ctrl.xml');

export class CtrlXmlLoader {
    private connection: Connection;
    private currentData: CtrlXmlData | null = null;
    private currentInstallPath: string | null = null;

    constructor(connection: Connection) {
        this.connection = connection;
    }

    /**
     * Get the currently loaded definition data.
     * Returns null if nothing has been loaded yet.
     */
    public getData(): CtrlXmlData | null {
        return this.currentData;
    }

    /**
     * Load definitions from the OA installation and additional XML files.
     *
     * @param oaInstallPath - WinCC OA installation directory (e.g., "C:/Siemens/Automation/WinCC_OA/3.20")
     * @param additionalPaths - User-configured additional XML definition files
     * @param workspaceRoot - Workspace root for resolving relative paths (optional)
     */
    public async loadDefinitions(
        oaInstallPath: string | null,
        additionalPaths: string[],
        workspaceRoot?: string
    ): Promise<CtrlXmlData | null> {
        this.connection.console.log('[CtrlXmlLoader] ─── Loading definitions ───');

        const sources: CtrlXmlData[] = [];

        // Priority 1: Official ctrl.xml from OA installation
        if (oaInstallPath) {
            this.currentInstallPath = oaInstallPath;
            const ctrlXmlPath = path.join(oaInstallPath, CTRL_XML_REL_PATH);
            const data = this.loadXmlFile(ctrlXmlPath);
            if (data) {
                sources.push(data);
                this.connection.console.log(
                    `[CtrlXmlLoader] ✓ Loaded ctrl.xml: ${data.functions.size} functions, ${data.constants.size} constants`
                );
            } else {
                this.connection.console.log(
                    `[CtrlXmlLoader] ⚠ ctrl.xml not found at: ${ctrlXmlPath}`
                );
            }
        } else {
            this.connection.console.log(
                '[CtrlXmlLoader] No OA install path provided — skipping ctrl.xml'
            );
        }

        // Priority 2: User-configured additional XML files
        for (const rawPath of additionalPaths) {
            const resolvedPath = this.resolvePath(rawPath, workspaceRoot);
            if (!resolvedPath) continue;

            const data = this.loadXmlFile(resolvedPath);
            if (data) {
                sources.push(data);
                this.connection.console.log(
                    `[CtrlXmlLoader] ✓ Loaded additional: ${path.basename(resolvedPath)} — ${data.functions.size} functions, ${data.constants.size} constants`
                );
            }
        }

        if (sources.length === 0) {
            this.connection.console.log(
                '[CtrlXmlLoader] No XML definition files loaded — using bundled builtins only'
            );
            this.currentData = null;
            return null;
        }

        // Merge all sources (index 0 = highest priority)
        const merged = mergeCtrlXmlSources(sources);
        this.currentData = merged;

        // Report statistics
        this.connection.console.log(
            `[CtrlXmlLoader] ═══ Loaded ${merged.functions.size} functions, ` +
            `${merged.constants.size} constants from ${merged.sourceFiles.length} file(s)`
        );

        // Report duplicates
        if (merged.duplicates.length > 0) {
            this.connection.console.log(
                `[CtrlXmlLoader] ⚠ ${merged.duplicates.length} duplicate definition(s) detected:`
            );
            for (const dup of merged.duplicates) {
                this.connection.console.log(
                    `[CtrlXmlLoader]   '${dup.symbolName}' (${dup.type}) in [${dup.files.join(', ')}] — using ${dup.resolvedFrom}`
                );
            }
        }

        return merged;
    }

    /**
     * Reload definitions with the same install path and new additional paths.
     * Called when settings change.
     */
    public async reloadWithSettings(
        additionalPaths: string[],
        workspaceRoot?: string
    ): Promise<CtrlXmlData | null> {
        return this.loadDefinitions(this.currentInstallPath, additionalPaths, workspaceRoot);
    }

    /**
     * Clear all loaded data (e.g., when OA version is cleared).
     */
    public clear(): void {
        this.currentData = null;
        this.currentInstallPath = null;
        this.connection.console.log('[CtrlXmlLoader] Definitions cleared');
    }

    // ── Private helpers ─────────────────────────────────────────

    /**
     * Load and parse a single XML file.
     * Returns null if file doesn't exist or can't be parsed.
     */
    private loadXmlFile(filePath: string): CtrlXmlData | null {
        if (!fs.existsSync(filePath)) {
            return null;
        }

        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            return parseCtrlXml(content, filePath);
        } catch (err) {
            const error = err as Error;
            this.connection.console.log(
                `[CtrlXmlLoader] ✗ Error parsing ${filePath}: ${error.message}`
            );
            return null;
        }
    }

    /**
     * Resolve a user-provided path that may be relative.
     * Relative paths are resolved against the workspace root.
     */
    private resolvePath(rawPath: string, workspaceRoot?: string): string | null {
        if (!rawPath || rawPath.trim().length === 0) {
            return null;
        }

        const trimmed = rawPath.trim();

        // Absolute path
        if (path.isAbsolute(trimmed)) {
            if (!fs.existsSync(trimmed)) {
                this.connection.console.log(
                    `[CtrlXmlLoader] ⚠ Additional XML not found: ${trimmed}`
                );
                return null;
            }
            return trimmed;
        }

        // Relative path — needs workspace root
        if (!workspaceRoot) {
            this.connection.console.log(
                `[CtrlXmlLoader] ⚠ Cannot resolve relative path '${trimmed}' — no workspace root`
            );
            return null;
        }

        const resolved = path.resolve(workspaceRoot, trimmed);
        if (!fs.existsSync(resolved)) {
            this.connection.console.log(
                `[CtrlXmlLoader] ⚠ Additional XML not found: ${resolved} (from '${trimmed}')`
            );
            return null;
        }

        return resolved;
    }
}
