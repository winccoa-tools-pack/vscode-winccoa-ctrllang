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

export type PathSourceMode = 'api' | 'workspace' | 'manual';

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
            case 'api':
                return await this.getPathsFromApi();
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
     * Mode 1: Get paths from WinCC OA Manager API
     */
    private async getPathsFromApi(): Promise<ProjectPaths | null> {
        const config = vscode.workspace.getConfiguration('winccoa.ctrlLang');
        const apiUrl = config.get<string>('apiUrl', 'http://localhost:3000/api/getProjectInfo');

        ExtensionOutputChannel.info(`Fetching project info from API: ${apiUrl}`);

        try {
            const http = await import('http');
            const https = await import('https');
            const protocol = apiUrl.startsWith('https') ? https : http;

            return new Promise((resolve) => {
                const req = protocol.get(apiUrl, (res) => {
                    let data = '';
                    res.on('data', chunk => data += chunk);
                    res.on('end', () => {
                        try {
                            ExtensionOutputChannel.debug(`API response: ${data}`);
                            const response = JSON.parse(data);
                            const info = response.projectInfo || response;

                            // Extract subProjects paths from array of objects {name, path}
                            let subProjectPaths: string[] = [];
                            if (info.subProjects && Array.isArray(info.subProjects)) {
                                subProjectPaths = info.subProjects.map((sp: any) => sp.path || sp);
                            }

                            // Fallback: If subProjects is empty but config file exists, parse it
                            if (subProjectPaths.length === 0 && info.configPath) {
                                ExtensionOutputChannel.info('SubProjects empty, parsing config file...');
                                subProjectPaths = this.parseSubProjectsFromConfig(info.configPath, info.projectPath);
                            }

                            const paths: ProjectPaths = {
                                projectPath: this.normalizePath(info.projectPath || ''),
                                installPath: this.normalizePath(info.installPath || ''),
                                subProjects: subProjectPaths.map(p => this.normalizePath(p)),
                                scriptsPaths: this.buildScriptsPaths({
                                    projectPath: this.normalizePath(info.projectPath || ''),
                                    installPath: this.normalizePath(info.installPath || ''),
                                    subProjects: subProjectPaths.map(p => this.normalizePath(p)),
                                    scriptsPaths: []
                                })
                            };

                            ExtensionOutputChannel.success('Project paths loaded from API');
                            this.cachedPaths = paths;
                            resolve(paths);
                        } catch (err) {
                            ExtensionOutputChannel.error(`Failed to parse API response: ${err}`);
                            resolve(null);
                        }
                    });
                });

                req.on('error', (err) => {
                    ExtensionOutputChannel.error(`API request failed: ${err}`);
                    resolve(null);
                });

                req.setTimeout(5000, () => {
                    ExtensionOutputChannel.warn('API request timeout');
                    req.destroy();
                    resolve(null);
                });
            });
        } catch (err) {
            ExtensionOutputChannel.error(`API error: ${err}`);
            return null;
        }
    }

    /**
     * Mode 2: Get paths from workspace (auto-detect WinCC OA project structure)
     */
    private async getPathsFromWorkspace(): Promise<ProjectPaths | null> {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders || workspaceFolders.length === 0) {
            ExtensionOutputChannel.warn('No workspace folder found');
            return null;
        }

        // Try to find WinCC OA project in workspace
        for (const folder of workspaceFolders) {
            const folderPath = folder.uri.fsPath;
            const configPath = path.join(folderPath, 'config', 'config');
            
            ExtensionOutputChannel.debug(`Checking for config: ${configPath}`);

            if (fs.existsSync(configPath)) {
                ExtensionOutputChannel.info(`Found WinCC OA project at: ${folderPath}`);
                
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
                this.cachedPaths = paths;
                return paths;
            }
        }

        ExtensionOutputChannel.warn('No WinCC OA project found in workspace');
        return null;
    }

    /**
     * Mode 3: Get paths from manual configuration
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
