import * as vscode from 'vscode';
import * as cp from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { ProjectPathResolver } from './projectPathResolver';
import { ExtensionOutputChannel } from '../extensionOutput';

export class AstyleFormatterService {
    private outputChannel: vscode.OutputChannel;

    constructor(outputChannel: vscode.OutputChannel) {
        this.outputChannel = outputChannel;
    }

    public async formatDocument(document: vscode.TextDocument): Promise<boolean> {
        const config = vscode.workspace.getConfiguration('winccoa.astyleFormatter');
        
        // Check if formatter is enabled
        if (!config.get<boolean>('enabled', true)) {
            ExtensionOutputChannel.trace('Formatter', 'Astyle formatter disabled in settings');
            return false;
        }

        // Only format .ctl and .ctrlpp files
        if (document.languageId !== 'ctrl' && document.languageId !== 'ctrlpp') {
            return false;
        }

        const filePath = document.uri.fsPath;
        ExtensionOutputChannel.debug('Formatter', `Formatting file: ${path.basename(filePath)}`);

        try {
            const { astylePath, configPath } = await this.resolveAstylePaths();
            
            if (!astylePath || !configPath) {
                ExtensionOutputChannel.error('Formatter', 'Could not resolve astyle binary or config path');
                return false;
            }

            await this.runAstyle(astylePath, configPath, filePath);
            ExtensionOutputChannel.debug('Formatter', `Successfully formatted: ${path.basename(filePath)}`);
            return true;

        } catch (error) {
            const err = error as Error;
            ExtensionOutputChannel.error('Formatter', `Error formatting file: ${err.message}`, err);
            return false;
        }
    }

    private async resolveAstylePaths(): Promise<{ astylePath: string | null; configPath: string | null }> {
        const config = vscode.workspace.getConfiguration('winccoa.astyleFormatter');
        const customBinaryPath = config.get<string>('binaryPath', '').trim();
        const customConfigPath = config.get<string>('configPath', '').trim();

        // Use custom paths if provided
        if (customBinaryPath && customConfigPath) {
            ExtensionOutputChannel.info('Formatter', 'Using custom astyle paths from settings');
            
            // Verify custom paths exist
            if (!fs.existsSync(customBinaryPath)) {
                ExtensionOutputChannel.error('Formatter', `Custom binary not found: ${customBinaryPath}`);
                vscode.window.showErrorMessage(`Astyle binary not found at: ${customBinaryPath}`);
                return { astylePath: null, configPath: null };
            }

            if (!fs.existsSync(customConfigPath)) {
                ExtensionOutputChannel.error('Formatter', `Custom config not found: ${customConfigPath}`);
                vscode.window.showErrorMessage(`Astyle config not found at: ${customConfigPath}`);
                return { astylePath: null, configPath: null };
            }

            ExtensionOutputChannel.debug('Formatter', `  Binary: ${customBinaryPath}`);
            ExtensionOutputChannel.debug('Formatter', `  Config: ${customConfigPath}`);
            
            return { astylePath: customBinaryPath, configPath: customConfigPath };
        }

        // Fall back to WinCC OA installation paths
        ExtensionOutputChannel.debug('Formatter', 'Using WinCC OA installation paths (default)');
        
        const resolver = ProjectPathResolver.getInstance();
        const projectPaths = await resolver.getProjectPaths();

        if (!projectPaths || !projectPaths.installPath) {
            ExtensionOutputChannel.warn('Formatter', 'WinCC OA installation path not found');
            return { astylePath: null, configPath: null };
        }

        const installPath = projectPaths.installPath;
        const isWindows = process.platform === 'win32';
        
        // Determine binary name based on platform
        const astyleBinary = isWindows ? 'astyle.exe' : 'astyle';
        const astylePath = path.join(installPath, 'bin', astyleBinary);
        const configPath = path.join(installPath, 'config', 'astyle.config');

        // Verify paths exist
        if (!fs.existsSync(astylePath)) {
            ExtensionOutputChannel.error('Formatter', `Binary not found: ${astylePath}`);
            vscode.window.showWarningMessage(`Astyle binary not found at: ${astylePath}`);
            return { astylePath: null, configPath: null };
        }

        if (!fs.existsSync(configPath)) {
            ExtensionOutputChannel.error('Formatter', `Config file not found: ${configPath}`);
            vscode.window.showWarningMessage(`Astyle config not found at: ${configPath}`);
            return { astylePath: null, configPath: null };
        }

        ExtensionOutputChannel.trace('Formatter', `Using binary: ${astylePath}`);
        ExtensionOutputChannel.trace('Formatter', `Using config: ${configPath}`);

        return { astylePath, configPath };
    }

    private async runAstyle(astylePath: string, configPath: string, filePath: string): Promise<void> {
        const args = [
            '--suffix=none',
            `--options=${configPath}`,
            filePath
        ];

        ExtensionOutputChannel.trace('Formatter', `Command: ${astylePath} ${args.join(' ')}`);

        return new Promise((resolve, reject) => {
            const process = cp.spawn(astylePath, args);
            let stdout = '';
            let stderr = '';

            process.stdout.on('data', (data) => {
                stdout += data.toString();
            });

            process.stderr.on('data', (data) => {
                stderr += data.toString();
            });

            process.on('close', (code) => {
                if (stdout) {
                    ExtensionOutputChannel.trace('Formatter', `Output: ${stdout.trim()}`);
                }
                if (stderr) {
                    ExtensionOutputChannel.warn('Formatter', `Stderr: ${stderr.trim()}`);
                }

                if (code === 0) {
                    resolve();
                } else {
                    ExtensionOutputChannel.error('Formatter', `Process exited with code ${code}`);
                    reject(new Error(`Astyle exited with code ${code}`));
                }
            });

            process.on('error', (error) => {
                ExtensionOutputChannel.error('Formatter', `Failed to start process: ${error.message}`, error);
                reject(error);
            });
        });
    }

    public dispose(): void {
        // Nothing to dispose currently
    }
}
