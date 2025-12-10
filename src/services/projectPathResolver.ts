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

export type PathSourceMode = 'workspace' | 'manual';

export class ProjectPathResolver {
    private static instance: ProjectPathResolver;
    private cachedPaths: ProjectPaths | null = null;

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

        ExtensionOutputChannel.info(`Path resolution mode: ${mode}`);

        switch (mode) {
            case 'workspace':
                return await this.getPathsFromWorkspace();
            case 'manual':
                return this.getPathsFromConfig();
            default:
                ExtensionOutputChannel.warn(`Unknown path source mode: ${mode}, falling back to workspace`);
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
            ExtensionOutputChannel.warn('No workspace folder found');
            return null;
        }

        ExtensionOutputChannel.info(`Searching for WinCC OA project in ${workspaceFolders.length} workspace folder(s)...`);

        // Try to find WinCC OA project in all workspace folders
        for (const folder of workspaceFolders) {
            const folderPath = folder.uri.fsPath;
            const configPath = path.join(folderPath, 'config', 'config');
            
            ExtensionOutputChannel.debug(`Checking folder: ${folderPath}`);
            ExtensionOutputChannel.debug(`  Looking for: ${configPath}`);

            try {
                if (fs.existsSync(configPath)) {
                    ExtensionOutputChannel.success(`✓ Found WinCC OA project at: ${folderPath}`);
                    ExtensionOutputChannel.info(`  Config file: ${configPath}`);
                    
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

                    ExtensionOutputChannel.success('Project paths detected from workspace');
                    ExtensionOutputChannel.info(`  Main project: ${paths.projectPath}`);
                    ExtensionOutputChannel.info(`  Install path: ${paths.installPath}`);
                    ExtensionOutputChannel.info(`  Subprojects: ${paths.subProjects.length}`);
                    ExtensionOutputChannel.info(`  Scripts paths: ${paths.scriptsPaths.length}`);
                    
                    this.cachedPaths = paths;
                    return paths;
                } else {
                    ExtensionOutputChannel.debug(`  ✗ No config/config found in ${folderPath}`);
                }
            } catch (error) {
                ExtensionOutputChannel.error(`Error checking folder ${folderPath}: ${error}`);
            }
        }

        ExtensionOutputChannel.warn('No WinCC OA project (config/config) found in any workspace folder');
        return null;
    }

    /**
     * Get paths from manual configuration
     */
    private getPathsFromConfig(): ProjectPaths | null {
        const config = vscode.workspace.getConfiguration('winccoa.ctrlLang');
        
        const projectPath = config.get<string>('projectPath', '');
        const installPath = config.get<string>('installPath', '');
        const subProjects = config.get<string[]>('subProjects', []);
        const additionalScriptsPaths = config.get<string[]>('additionalScriptsPaths', []);

        if (!projectPath) {
            ExtensionOutputChannel.warn('No project path configured');
            return null;
        }

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

        ExtensionOutputChannel.success('Project paths loaded from configuration');
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
        
        ExtensionOutputChannel.debug(`Parsing config: ${configPath}`);
        
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
                    
                    ExtensionOutputChannel.debug(`Found subproject: ${projPath}`);
                    subProjects.push(projPath);
                }
            }
            
            ExtensionOutputChannel.info(`Found ${subProjects.length} subprojects`);
        } catch (err) {
            ExtensionOutputChannel.error(`Error parsing config: ${err}`);
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
                    ExtensionOutputChannel.info(`Detected install path: ${match[1]}`);
                    return match[1];
                }
            }
        } catch (err) {
            ExtensionOutputChannel.debug(`Could not detect install path: ${err}`);
        }

        // Default fallback paths
        const defaultPaths = os.platform() === 'win32'
            ? ['C:\\Siemens\\Automation\\WinCC_OA\\3.19', 'C:\\Siemens\\Automation\\WinCC_OA\\3.18']
            : ['/opt/WinCC_OA/3.19', '/opt/WinCC_OA/3.18'];

        for (const defaultPath of defaultPaths) {
            if (fs.existsSync(defaultPath)) {
                ExtensionOutputChannel.info(`Using default install path: ${defaultPath}`);
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
        ExtensionOutputChannel.info('Project paths cache cleared');
    }

    /**
     * Get cached paths without fetching
     */
    public getCachedPaths(): ProjectPaths | null {
        return this.cachedPaths;
    }
}
