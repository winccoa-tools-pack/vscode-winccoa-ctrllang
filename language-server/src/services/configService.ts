/**
 * Configuration Service for WinCC OA CTL Language Server
 * 
 * Handles:
 * - Project path detection (workspace, API, manual)
 * - SubProject parsing from config files
 * - Install path detection
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { Connection } from 'vscode-languageserver/node';
import { ProjectInfo } from '../usesResolver';

export interface ServerSettings {
    pathSource: 'api' | 'workspace' | 'manual';
    apiUrl: string;
    projectPath: string;
    installPath: string;
    subProjects: string[];
    additionalScriptsPaths: string[];
}

const defaultSettings: ServerSettings = {
    pathSource: 'workspace',
    apiUrl: 'http://localhost:3000/api/getProjectInfo',
    projectPath: '',
    installPath: '',
    subProjects: [],
    additionalScriptsPaths: []
};

export class ConfigService {
    private connection: Connection;
    private settings: ServerSettings = { ...defaultSettings };
    private projectInfo: ProjectInfo | null = null;
    
    constructor(connection: Connection) {
        this.connection = connection;
    }
    
    /**
     * Update settings from client
     */
    updateSettings(settings: Partial<ServerSettings>): void {
        this.settings = { ...this.settings, ...settings };
        // Invalidate cached project info when settings change
        this.projectInfo = null;
    }
    
    /**
     * Get current settings
     */
    getSettings(): ServerSettings {
        return this.settings;
    }
    
    /**
     * Get project info (cached)
     */
    async getProjectInfo(): Promise<ProjectInfo | null> {
        if (this.projectInfo) {
            return this.projectInfo;
        }
        
        this.connection.console.log(`[ConfigService] Mode: ${this.settings.pathSource}`);
        
        switch (this.settings.pathSource) {
            case 'api':
                this.projectInfo = await this.fetchFromApi();
                break;
            case 'workspace':
                this.projectInfo = await this.fetchFromWorkspace();
                break;
            case 'manual':
                this.projectInfo = this.fetchFromConfig();
                break;
            default:
                this.connection.console.log('[ConfigService] Unknown mode, falling back to workspace');
                this.projectInfo = await this.fetchFromWorkspace();
        }
        
        return this.projectInfo;
    }
    
    /**
     * Invalidate cached project info
     */
    invalidateProjectInfo(): void {
        this.projectInfo = null;
    }
    
    /**
     * Fetch project info from API endpoint
     */
    private async fetchFromApi(): Promise<ProjectInfo | null> {
        try {
            const http = await import('http');
            const https = await import('https');
            const apiUrl = this.settings.apiUrl;
            const protocol = apiUrl.startsWith('https') ? https : http;
            
            this.connection.console.log(`[ConfigService] Fetching from API: ${apiUrl}`);
            
            return new Promise((resolve) => {
                const req = protocol.get(apiUrl, (res) => {
                    let data = '';
                    res.on('data', chunk => data += chunk);
                    res.on('end', () => {
                        try {
                            const response = JSON.parse(data);
                            const info = response.projectInfo || response;
                            
                            let subProjectPaths: string[] = [];
                            if (info.subProjects && Array.isArray(info.subProjects)) {
                                subProjectPaths = info.subProjects.map((sp: any) => sp.path || sp);
                            }
                            
                            if (subProjectPaths.length === 0 && info.configPath) {
                                subProjectPaths = this.parseSubProjectsFromConfig(info.configPath, info.projectPath);
                            }
                            
                            resolve({
                                projectPath: info.projectPath || '',
                                projectName: info.projectName || '',
                                configPath: info.configPath || '',
                                logPath: info.logPath || '',
                                installPath: info.installPath || '',
                                version: info.version || '',
                                subProjects: subProjectPaths
                            });
                        } catch (err) {
                            this.connection.console.log('[ConfigService] Parse error: ' + err);
                            resolve(null);
                        }
                    });
                });
                
                req.on('error', (err) => {
                    this.connection.console.log('[ConfigService] HTTP error: ' + err);
                    resolve(null);
                });
                
                req.setTimeout(2000, () => {
                    this.connection.console.log('[ConfigService] Request timeout');
                    req.destroy();
                    resolve(null);
                });
            });
        } catch (err) {
            this.connection.console.log('[ConfigService] Exception: ' + err);
            return null;
        }
    }
    
    /**
     * Detect project from workspace folders
     */
    private async fetchFromWorkspace(): Promise<ProjectInfo | null> {
        try {
            const workspaceFolders = await this.connection.workspace.getWorkspaceFolders();
            if (!workspaceFolders || workspaceFolders.length === 0) {
                this.connection.console.log('[ConfigService] No workspace folders');
                return null;
            }
            
            for (const folder of workspaceFolders) {
                const folderPath = fileURLToPath(folder.uri);
                const configPath = path.join(folderPath, 'config', 'config');
                
                if (fs.existsSync(configPath)) {
                    this.connection.console.log(`[ConfigService] Found WinCC OA project at: ${folderPath}`);
                    
                    const subProjects = this.parseSubProjectsFromConfig(configPath, folderPath);
                    const installPath = this.detectInstallPath(configPath);
                    
                    return {
                        projectPath: folderPath,
                        projectName: path.basename(folderPath),
                        configPath: configPath,
                        logPath: path.join(folderPath, 'log'),
                        installPath: installPath,
                        version: '',
                        subProjects: subProjects
                    };
                }
            }
            
            this.connection.console.log('[ConfigService] No WinCC OA project found in workspace');
            return null;
        } catch (err) {
            this.connection.console.log('[ConfigService] Error: ' + err);
            return null;
        }
    }
    
    /**
     * Use manually configured paths
     */
    private fetchFromConfig(): ProjectInfo | null {
        const projectPath = this.settings.projectPath;
        
        if (!projectPath) {
            this.connection.console.log('[ConfigService] No project path configured');
            return null;
        }
        
        return {
            projectPath: projectPath,
            projectName: path.basename(projectPath),
            configPath: path.join(projectPath, 'config', 'config'),
            logPath: path.join(projectPath, 'log'),
            installPath: this.settings.installPath,
            version: '',
            subProjects: this.settings.subProjects
        };
    }
    
    /**
     * Parse subprojects from config file
     */
    private parseSubProjectsFromConfig(configPath: string, mainProjectPath: string): string[] {
        const subProjects: string[] = [];
        
        if (!fs.existsSync(configPath)) {
            return subProjects;
        }
        
        try {
            const configContent = fs.readFileSync(configPath, 'utf-8');
            const lines = configContent.split('\n');
            const normalizedMainPath = path.normalize(mainProjectPath).toLowerCase();
            
            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed || trimmed.startsWith('#')) continue;
                
                const match = trimmed.match(/^proj_path\s*=\s*["']([^"']+)["']/);
                if (match) {
                    const projPath = match[1];
                    const normalizedPath = path.normalize(projPath).toLowerCase();
                    
                    if (normalizedPath !== normalizedMainPath) {
                        subProjects.push(projPath);
                    }
                }
            }
        } catch (err) {
            this.connection.console.log('[ConfigService] Error parsing config: ' + err);
        }
        
        return subProjects;
    }
    
    /**
     * Detect WinCC OA install path from config or defaults
     */
    private detectInstallPath(configPath: string): string {
        try {
            const configContent = fs.readFileSync(configPath, 'utf-8');
            const lines = configContent.split('\n');
            
            for (const line of lines) {
                const match = line.trim().match(/^(?:pvss_path|winccoa_path|install_path)\s*=\s*["']([^"']+)["']/);
                if (match) {
                    return match[1];
                }
            }
        } catch (err) {
            // Ignore
        }
        
        // Platform-specific defaults
        const defaultPaths = process.platform === 'win32'
            ? ['C:\\Siemens\\Automation\\WinCC_OA\\3.19', 'C:\\Siemens\\Automation\\WinCC_OA\\3.18']
            : ['/opt/WinCC_OA/3.19', '/opt/WinCC_OA/3.18'];
        
        for (const defaultPath of defaultPaths) {
            if (fs.existsSync(defaultPath)) {
                return defaultPath;
            }
        }
        
        return '';
    }
}
