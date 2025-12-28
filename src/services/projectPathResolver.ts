import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { ExtensionOutputChannel } from '../extensionOutput';

export interface ProjectPaths {
    projectPath: string;
    installPath: string;
    subProjects: string[];
    scriptsPaths: string[];  // All resolved scripts folders
}

export type PathSourceMode = 'workspace' | 'manual' | 'automatic';

export class ProjectPathResolver {
    private static instance: ProjectPathResolver;
    private cachedPaths: ProjectPaths | null = null;
    private coreActivationAttempted: boolean = false; // Track if we already tried to activate Core
    private noProjectWarningShown: boolean = false; // Track if we already showed "no project selected" warning

    public static getInstance(): ProjectPathResolver {
        if (!ProjectPathResolver.instance) {
            ProjectPathResolver.instance = new ProjectPathResolver();
        }
        return ProjectPathResolver.instance;
    }

    /**
     * Get project paths based on configuration
     */
    public async getProjectPaths(): Promise<ProjectPaths | null> {
        const config = vscode.workspace.getConfiguration('winccoa.ctrlLang');
        const mode = config.get<PathSourceMode>('pathSource', 'workspace');

        ExtensionOutputChannel.info('PathResolver', `Path resolution mode: ${mode}`);

        switch (mode) {
            case 'workspace':
                return await this.getPathsFromWorkspace();
            case 'manual':
                return this.getPathsFromConfig();
            case 'automatic':
                return this.getPathsFromCore();
            default:
                ExtensionOutputChannel.warn('PathResolver', `Unknown path source mode: ${mode}, falling back to workspace`);
                return await this.getPathsFromWorkspace();
        }
    }

    /**
     * Get paths from workspace (auto-detect WinCC OA project structure)
     * Searches all workspace folders for config/config file
     */
    private async getPathsFromWorkspace(): Promise<ProjectPaths | null> {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders || workspaceFolders.length === 0) {
            ExtensionOutputChannel.warn('PathResolver', 'No workspace folder found');
            return null;
        }

        ExtensionOutputChannel.info('PathResolver', `Searching for WinCC OA project in ${workspaceFolders.length} workspace folder(s)...`);
        ExtensionOutputChannel.trace('PathResolver', 'Workspace folders', workspaceFolders.map(f => f.uri.fsPath));

        // Try to find WinCC OA project in all workspace folders
        for (const folder of workspaceFolders) {
            const folderPath = folder.uri.fsPath;
            const configPath = path.join(folderPath, 'config', 'config');
            
            ExtensionOutputChannel.debug('PathResolver', `Checking folder: ${folderPath}`);
            ExtensionOutputChannel.trace('PathResolver', `  Looking for: ${configPath}`);

            try {
                if (fs.existsSync(configPath)) {
                    ExtensionOutputChannel.success('PathResolver', `✓ Found WinCC OA project at: ${folderPath}`);
                    ExtensionOutputChannel.info('PathResolver', `  Config file: ${configPath}`);
                    
                    const subProjects = this.parseSubProjectsFromConfig(configPath, folderPath);
                    const installPath = this.detectInstallPath(configPath);

                    const paths: ProjectPaths = {
                        projectPath: this.normalizePath(folderPath),
                        installPath: this.normalizePath(installPath),
                        subProjects: subProjects.map(p => this.normalizePath(p)),
                        scriptsPaths: this.buildScriptsPaths({
                            projectPath: this.normalizePath(folderPath),
                            installPath: this.normalizePath(installPath),
                            subProjects: subProjects.map(p => this.normalizePath(p)),
                            scriptsPaths: []
                        })
                    };

                    ExtensionOutputChannel.success('PathResolver', 'Project paths detected from workspace');
                    ExtensionOutputChannel.debug('PathResolver', `  Main project: ${paths.projectPath}`);
                    ExtensionOutputChannel.debug('PathResolver', `  Install path: ${paths.installPath}`);
                    ExtensionOutputChannel.debug('PathResolver', `  Subprojects: ${paths.subProjects.length}`);
                    ExtensionOutputChannel.info('PathResolver', `  Scripts paths: ${paths.scriptsPaths.length}`);
                    ExtensionOutputChannel.trace('PathResolver', 'Full paths object', paths);
                    
                    this.cachedPaths = paths;
                    return paths;
                } else {
                    ExtensionOutputChannel.debug('PathResolver', `  ✗ No config/config found in ${folderPath}`);
                }
            } catch (error) {
                const err = error as Error;
                ExtensionOutputChannel.error('PathResolver', `Error checking folder ${folderPath}: ${err.message}`, err);
            }
        }

        ExtensionOutputChannel.warn('PathResolver', 'No WinCC OA project (config/config) found in any workspace folder');
        return null;
    }

    /**
     * Get paths from manual configuration
     */
    private getPathsFromConfig(): ProjectPaths | null {
        const config = vscode.workspace.getConfiguration('winccoa.ctrlLang');
        
        ExtensionOutputChannel.trace('PathResolver', 'Reading manual configuration...');
        const projectPath = config.get<string>('projectPath', '');
        const installPath = config.get<string>('installPath', '');
        const subProjects = config.get<string[]>('subProjects', []);
        const additionalScriptsPaths = config.get<string[]>('additionalScriptsPaths', []);

        if (!projectPath) {
            ExtensionOutputChannel.warn('PathResolver', 'No project path configured');
            return null;
        }

        ExtensionOutputChannel.trace('PathResolver', 'Manual configuration', { projectPath, installPath, subProjects, additionalScriptsPaths });

        const paths: ProjectPaths = {
            projectPath: this.normalizePath(projectPath),
            installPath: this.normalizePath(installPath),
            subProjects: subProjects.map(p => this.normalizePath(p)),
            scriptsPaths: [
                ...this.buildScriptsPaths({
                    projectPath: this.normalizePath(projectPath),
                    installPath: this.normalizePath(installPath),
                    subProjects: subProjects.map(p => this.normalizePath(p)),
                    scriptsPaths: []
                }),
                ...additionalScriptsPaths.map(p => this.normalizePath(p))
            ]
        };

        ExtensionOutputChannel.success('PathResolver', 'Project paths loaded from configuration');
        this.cachedPaths = paths;
        return paths;
    }

    /**
     * Get paths from Core extension (automatic mode)
     */
    private getPathsFromCore(): ProjectPaths | null {
        const coreExtension = vscode.extensions.getExtension('winccoa-tools-pack.winccoa-core');
        
        if (!coreExtension) {
            ExtensionOutputChannel.error('PathResolver', 'WinCC OA Core extension not found');
            vscode.window.showErrorMessage(
                'WinCC OA Core extension is required for automatic mode. Please install it or switch to a different path source.',
            );
            return null;
        }

        if (!coreExtension.isActive) {
            // Only show warning after first activation attempt to avoid startup noise
            if (this.coreActivationAttempted) {
                ExtensionOutputChannel.warn('PathResolver', 'Core extension is not active yet');
            } else {
                ExtensionOutputChannel.debug('PathResolver', 'Core extension not yet active (first call during startup)');
                this.coreActivationAttempted = true;
            }
            return null;
        }

        const coreApi = coreExtension.exports;
        const currentProject = coreApi.getCurrentProject();

        if (!currentProject) {
            // Only show warning popup once per session to avoid startup noise
            if (!this.noProjectWarningShown) {
                ExtensionOutputChannel.debug('PathResolver', 'No project selected yet (first call during startup)');
                this.noProjectWarningShown = true;
            } else {
                ExtensionOutputChannel.warn('PathResolver', 'No WinCC OA project selected in Core extension');
                vscode.window.showWarningMessage(
                    'No WinCC OA project selected. Please select a project using the WinCC OA status bar.',
                );
            }
            return null;
        }

        // Normalize paths by removing trailing slashes
        const projectDir = currentProject.projectDir.replace(/[\/]+$/, '');
        const installPath = currentProject.oaInstallPath.replace(/[\/]+$/, '');
        
        // Parse subprojects from config if available
        const configPath = currentProject.configPath;
        const subProjects = configPath && fs.existsSync(configPath)
            ? this.parseSubProjectsFromConfig(configPath, projectDir)
            : [];

        const paths: ProjectPaths = {
            projectPath: this.normalizePath(projectDir),
            installPath: this.normalizePath(installPath),
            subProjects: subProjects.map(p => this.normalizePath(p)),
            scriptsPaths: this.buildScriptsPaths({
                projectPath: this.normalizePath(projectDir),
                installPath: this.normalizePath(installPath),
                subProjects: subProjects.map(p => this.normalizePath(p)),
                scriptsPaths: []
            })
        };

        ExtensionOutputChannel.success('PathResolver', 'Project paths loaded from Core extension');
        ExtensionOutputChannel.debug('PathResolver', `  Project: ${currentProject.name}`);
        ExtensionOutputChannel.debug('PathResolver', `  Project path: ${paths.projectPath}`);
        ExtensionOutputChannel.debug('PathResolver', `  Install path: ${paths.installPath}`);
        ExtensionOutputChannel.debug('PathResolver', `  Subprojects: ${paths.subProjects.length}`);
        
        this.cachedPaths = paths;
        return paths;
    }

    /**
     * Build all scripts paths based on project structure
     */
    private buildScriptsPaths(paths: ProjectPaths): string[] {
        const scriptsPaths: string[] = [];

        // 1. Main project scripts
        if (paths.projectPath) {
            scriptsPaths.push(
                path.join(paths.projectPath, 'scripts', 'libs'),
                path.join(paths.projectPath, 'scripts')
            );
        }

        // 2. Subprojects scripts
        for (const subProject of paths.subProjects) {
            scriptsPaths.push(
                path.join(subProject, 'scripts', 'libs'),
                path.join(subProject, 'scripts')
            );
        }

        // 3. Installation scripts
        if (paths.installPath) {
            scriptsPaths.push(
                path.join(paths.installPath, 'scripts', 'libs'),
                path.join(paths.installPath, 'scripts')
            );
        }

        return scriptsPaths;
    }

    /**
     * Parse subprojects from config file
     */
    private parseSubProjectsFromConfig(configPath: string, mainProjectPath: string): string[] {
        const subProjects: string[] = [];
        
        ExtensionOutputChannel.trace('PathResolver', `Parsing config: ${configPath}`);
        
        if (!fs.existsSync(configPath)) {
            return subProjects;
        }
        
        try {
            const configContent = fs.readFileSync(configPath, 'utf-8');
            const lines = configContent.split('\n');
            
            const normalizedMainPath = path.normalize(mainProjectPath).toLowerCase();
            
            for (const line of lines) {
                const trimmed = line.trim();
                
                // Skip comments and empty lines
                if (!trimmed || trimmed.startsWith('#')) continue;
                
                // Match proj_path = "..." or proj_path = '...'
                const match = trimmed.match(/^proj_path\s*=\s*["']([^"']+)["']/);
                if (match) {
                    let projPath = match[1];
                    
                    // Normalize for comparison
                    const normalizedPath = path.normalize(projPath).toLowerCase();
                    
                    // Skip if it's the main project
                    if (normalizedPath === normalizedMainPath) {
                        continue;
                    }
                    
                    ExtensionOutputChannel.debug('PathResolver', `Found subproject: ${projPath}`);
                    subProjects.push(projPath);
                }
            }
            
            ExtensionOutputChannel.debug('PathResolver', `Found ${subProjects.length} subprojects`);
        } catch (err) {
            const error = err as Error;
            ExtensionOutputChannel.error('PathResolver', `Error parsing config: ${error.message}`, error);
        }
        
        return subProjects;
    }

    /**
     * Try to detect WinCC OA installation path from config file
     */
    private detectInstallPath(configPath: string): string {
        try {
            const configContent = fs.readFileSync(configPath, 'utf-8');
            const lines = configContent.split('\n');
            
            for (const line of lines) {
                const trimmed = line.trim();
                
                // Look for pvss_path or similar
                const match = trimmed.match(/^(?:pvss_path|winccoa_path|install_path)\s*=\s*["']([^"']+)["']/);
                if (match) {
                    ExtensionOutputChannel.debug('PathResolver', `Detected install path: ${match[1]}`);
                    return match[1];
                }
            }
        } catch (err) {
            const error = err as Error;
            ExtensionOutputChannel.trace('PathResolver', `Could not detect install path: ${error.message}`);
        }

        // Default fallback paths
        const defaultPaths = os.platform() === 'win32'
            ? ['C:\\Siemens\\Automation\\WinCC_OA\\3.19', 'C:\\Siemens\\Automation\\WinCC_OA\\3.18']
            : ['/opt/WinCC_OA/3.19', '/opt/WinCC_OA/3.18'];

        for (const defaultPath of defaultPaths) {
            if (fs.existsSync(defaultPath)) {
                ExtensionOutputChannel.debug('PathResolver', `Using default install path: ${defaultPath}`);
                return defaultPath;
            }
        }

        return '';
    }

    /**
     * Normalize path for cross-platform compatibility
     */
    private normalizePath(p: string): string {
        if (!p) return '';
        
        // Resolve environment variables
        p = p.replace(/\$\{(\w+)\}/g, (_, varName) => process.env[varName] || '');
        
        // Expand ~ to home directory
        if (p.startsWith('~')) {
            p = path.join(os.homedir(), p.slice(1));
        }
        
        // Normalize path separators
        return path.normalize(p);
    }

    /**
     * Clear cached paths (useful when configuration changes)
     */
    public clearCache(): void {
        this.cachedPaths = null;
        ExtensionOutputChannel.debug('PathResolver', 'Project paths cache cleared');
    }

    /**
     * Get cached paths without fetching
     */
    public getCachedPaths(): ProjectPaths | null {
        return this.cachedPaths;
    }
}
