import * as vscode from 'vscode';
import * as cp from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { ProjectPathResolver } from './projectPathResolver';

export class AstyleFormatterService {
    private outputChannel: vscode.OutputChannel;

    constructor(outputChannel: vscode.OutputChannel) {
        this.outputChannel = outputChannel;
    }

    public async formatDocument(document: vscode.TextDocument): Promise<boolean> {
        const config = vscode.workspace.getConfiguration('winccoa.astyleFormatter');
        
        // Check if formatter is enabled
        if (!config.get<boolean>('enabled', true)) {
            return false;
        }

        // Only format .ctl and .ctrlpp files
        if (document.languageId !== 'ctrl' && document.languageId !== 'ctrlpp') {
            return false;
        }

        const filePath = document.uri.fsPath;
        this.outputChannel.appendLine(`Astyle: Formatting file ${filePath}`);

        try {
            const { astylePath, configPath } = await this.resolveAstylePaths();
            
            if (!astylePath || !configPath) {
                this.outputChannel.appendLine('Astyle: Could not resolve astyle binary or config path');
                return false;
            }

            await this.runAstyle(astylePath, configPath, filePath);
            this.outputChannel.appendLine(`Astyle: Successfully formatted ${filePath}`);
            return true;

        } catch (error) {
            this.outputChannel.appendLine(`Astyle: Error formatting file: ${error}`);
            return false;
        }
    }

    private async resolveAstylePaths(): Promise<{ astylePath: string | null; configPath: string | null }> {
        const resolver = ProjectPathResolver.getInstance();
        const projectPaths = await resolver.getProjectPaths();

        if (!projectPaths || !projectPaths.installPath) {
            this.outputChannel.appendLine('Astyle: WinCC OA installation path not found');
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
            this.outputChannel.appendLine(`Astyle: Binary not found at: ${astylePath}`);
            vscode.window.showWarningMessage(`Astyle binary not found at: ${astylePath}`);
            return { astylePath: null, configPath: null };
        }

        if (!fs.existsSync(configPath)) {
            this.outputChannel.appendLine(`Astyle: Config file not found at: ${configPath}`);
            vscode.window.showWarningMessage(`Astyle config not found at: ${configPath}`);
            return { astylePath: null, configPath: null };
        }

        this.outputChannel.appendLine(`Astyle: Using binary: ${astylePath}`);
        this.outputChannel.appendLine(`Astyle: Using config: ${configPath}`);

        return { astylePath, configPath };
    }

    private async runAstyle(astylePath: string, configPath: string, filePath: string): Promise<void> {
        const args = [
            '--suffix=none',
            `--options=${configPath}`,
            filePath
        ];

        this.outputChannel.appendLine(`Astyle: Running: ${astylePath} ${args.join(' ')}`);

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
                    this.outputChannel.appendLine(`Astyle stdout: ${stdout}`);
                }
                if (stderr) {
                    this.outputChannel.appendLine(`Astyle stderr: ${stderr}`);
                }

                if (code === 0) {
                    resolve();
                } else {
                    this.outputChannel.appendLine(`Astyle: Process exited with code ${code}`);
                    reject(new Error(`Astyle exited with code ${code}`));
                }
            });

            process.on('error', (error) => {
                this.outputChannel.appendLine(`Astyle: Failed to start process: ${error.message}`);
                reject(error);
            });
        });
    }

    public dispose(): void {
        // Nothing to dispose currently
    }
}
