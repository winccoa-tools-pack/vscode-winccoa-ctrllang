import * as vscode from 'vscode';
import { ExtensionOutputChannel } from '../extensionOutput';

// Imports from @winccoa-tools-pack/npm-winccoa-core
import { getProjectByProjectPath } from '@winccoa-tools-pack/npm-winccoa-core/utils/winccoa-project-environment';
import {
    getAvailableWinCCOAVersions,
    getWinCCOAInstallationPathByVersion,
} from '@winccoa-tools-pack/npm-winccoa-core/utils/winccoa-paths';

const SOURCE = 'OaVersion';

/**
 * Service for resolving and managing the active WinCC OA version.
 *
 * Provides:
 * - Auto-detection from the WinCC OA project a file belongs to
 * - Manual version selection via QuickPick / command
 * - Status bar indicator showing the active version
 * - Cache with invalidation on version change
 *
 * The resolved version is used to locate `ctrl.xml` and other
 * version-specific resources from the WinCC OA installation.
 */
export class OaVersionService implements vscode.Disposable {
    private static instance: OaVersionService;

    private selectedVersion: string | null = null;
    private resolvedInstallDir: string | null = null;

    private statusBarItem: vscode.StatusBarItem;
    private disposables: vscode.Disposable[] = [];

    private readonly _onDidChangeVersion = new vscode.EventEmitter<string | null>();
    /** Fired when the active OA version changes (user selection or auto-detect). */
    public readonly onDidChangeVersion: vscode.Event<string | null> =
        this._onDidChangeVersion.event;

    private constructor() {
        // Status bar: positioned next to the project selector (priority 99 = right side, close to language indicator)
        this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 99);
        this.statusBarItem.command = 'winccoa.selectOaVersion';
        this.statusBarItem.tooltip = 'Select WinCC OA Version';
        this.updateStatusBar();
        this.statusBarItem.show();

        this.disposables.push(this.statusBarItem, this._onDidChangeVersion);
    }

    public static getInstance(): OaVersionService {
        if (!OaVersionService.instance) {
            OaVersionService.instance = new OaVersionService();
        }
        return OaVersionService.instance;
    }

    // ── Public API ──────────────────────────────────────────────

    /**
     * Get the currently selected OA version. If none is selected yet, attempts
     * auto-detection from the given script path. Falls back to user picker.
     */
    public async getVersion(scriptPath?: string): Promise<string | null> {
        if (this.selectedVersion) {
            return this.selectedVersion;
        }

        // Try auto-detection from script path → project → version
        if (scriptPath) {
            const detected = await this.detectVersionFromProject(scriptPath);
            if (detected) {
                await this.setVersion(detected);
                return this.selectedVersion;
            }
        }

        // Try auto-detection from Core extension
        const coreVersion = this.getVersionFromCoreExtension();
        if (coreVersion) {
            await this.setVersion(coreVersion);
            return this.selectedVersion;
        }

        // No version could be detected — prompt the user
        return this.showVersionPicker();
    }

    /**
     * Get the OA installation directory for the current version.
     * Returns null if no version is selected or install dir not found.
     */
    public getInstallDir(): string | null {
        return this.resolvedInstallDir;
    }

    /**
     * Get the cached version without triggering detection.
     */
    public getSelectedVersion(): string | null {
        return this.selectedVersion;
    }

    /**
     * Set the OA version explicitly (from picker, command, or auto-detect).
     * Updates the status bar and fires the change event.
     */
    public async setVersion(version: string | null): Promise<void> {
        const previousVersion = this.selectedVersion;
        this.selectedVersion = version;
        this.resolvedInstallDir = null;

        if (version) {
            const installDir = getWinCCOAInstallationPathByVersion(version);
            if (installDir) {
                this.resolvedInstallDir = installDir;
                ExtensionOutputChannel.info(SOURCE, `Version set: ${version} → ${installDir}`);
            } else {
                ExtensionOutputChannel.warn(
                    SOURCE,
                    `Version ${version} selected but installation directory not found`,
                );
                vscode.window.showWarningMessage(
                    `WinCC OA ${version}: Installation directory not found.`,
                );
            }
        } else {
            ExtensionOutputChannel.info(SOURCE, 'Version cleared');
        }

        this.updateStatusBar();

        if (previousVersion !== version) {
            this._onDidChangeVersion.fire(version);
        }
    }

    /**
     * Show the QuickPick version selector. Callable from command palette or status bar click.
     * Returns the selected version or null if cancelled.
     */
    public async showVersionPicker(): Promise<string | null> {
        const versions = getAvailableWinCCOAVersions();

        if (versions.length === 0) {
            ExtensionOutputChannel.warn(SOURCE, 'No WinCC OA versions found on this system');
            vscode.window.showWarningMessage('No WinCC OA installations found on this system.');
            return null;
        }

        ExtensionOutputChannel.debug(SOURCE, `Available versions: ${versions.join(', ')}`);

        const items: vscode.QuickPickItem[] = versions.map((v: string) => {
            const installDir = getWinCCOAInstallationPathByVersion(v);
            return {
                label: `WinCC OA ${v}`,
                description: installDir ?? 'Installation not found',
                detail: v === this.selectedVersion ? '$(check) Currently selected' : undefined,
            };
        });

        const picked = await vscode.window.showQuickPick(items, {
            placeHolder: 'Select the WinCC OA version to use',
            title: 'WinCC OA Version',
        });

        if (!picked) {
            return this.selectedVersion; // Cancelled — keep current
        }

        // Extract version from label "WinCC OA 3.20" → "3.20"
        const version = picked.label.replace('WinCC OA ', '');
        await this.setVersion(version);
        return version;
    }

    // ── Private helpers ─────────────────────────────────────────

    /**
     * Detect OA version from the project that contains the given file path.
     */
    private async detectVersionFromProject(scriptPath: string): Promise<string | null> {
        try {
            const project = await getProjectByProjectPath(scriptPath);
            const version = project?.getVersion();
            if (version) {
                ExtensionOutputChannel.info(
                    SOURCE,
                    `Auto-detected version ${version} from project for ${scriptPath}`,
                );
                return version;
            }
        } catch (err) {
            const error = err as Error;
            ExtensionOutputChannel.debug(
                SOURCE,
                `Could not detect version from project: ${error.message}`,
            );
        }
        return null;
    }

    /**
     * Try to get the OA version from the Core extension (winccoa-project-admin).
     */
    private getVersionFromCoreExtension(): string | null {
        try {
            const coreExtension = vscode.extensions.getExtension(
                'RichardJanisch.winccoa-project-admin',
            );

            if (!coreExtension?.isActive) {
                return null;
            }

            const coreApi = coreExtension.exports;
            const currentProject = coreApi.getCurrentProject();

            if (!currentProject?.oaInstallPath) {
                return null;
            }

            // Derive version from install path (e.g., "C:\...\WinCC_OA\3.20" → "3.20")
            // or use the version if core exposes it
            if (currentProject.version) {
                ExtensionOutputChannel.debug(
                    SOURCE,
                    `Version from Core extension: ${currentProject.version}`,
                );
                return currentProject.version;
            }

            // Try to derive from install path as fallback
            const pathMatch = currentProject.oaInstallPath.match(/[\\/](\d+\.\d+)(?:[\\/]|$)/);
            if (pathMatch) {
                const version = pathMatch[1];
                ExtensionOutputChannel.debug(
                    SOURCE,
                    `Version derived from Core install path: ${version}`,
                );
                return version;
            }
        } catch (err) {
            const error = err as Error;
            ExtensionOutputChannel.debug(
                SOURCE,
                `Could not get version from Core extension: ${error.message}`,
            );
        }
        return null;
    }

    /**
     * Update the status bar item to reflect the current version state.
     */
    private updateStatusBar(): void {
        if (this.selectedVersion) {
            this.statusBarItem.text = `$(versions) WinCC OA ${this.selectedVersion}`;
            this.statusBarItem.backgroundColor = undefined;
            this.statusBarItem.color = undefined;
        } else {
            this.statusBarItem.text = '$(warning) WinCC OA: No Version';
            this.statusBarItem.backgroundColor = new vscode.ThemeColor(
                'statusBarItem.errorBackground',
            );
            this.statusBarItem.color = new vscode.ThemeColor('statusBarItem.errorForeground');
        }
    }

    // ── Disposal ────────────────────────────────────────────────

    public dispose(): void {
        for (const d of this.disposables) {
            d.dispose();
        }
        this.disposables = [];
    }
}
