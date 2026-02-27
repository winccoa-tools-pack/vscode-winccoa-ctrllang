import * as vscode from 'vscode';
import * as cp from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { XMLParser } from 'fast-xml-parser';

interface CtrlppCheckError {
    id: string;
    severity: string;
    msg: string;
    location?: {
        file: string;
        line: string;
    };
    symbol?: string;
}

interface CtrlppCheckResult {
    results?: {
        errors?: {
            error?: CtrlppCheckError | CtrlppCheckError[];
        };
    };
}

export class CtrlppCheckService {
    private diagnosticCollection: vscode.DiagnosticCollection;
    private outputChannel: vscode.OutputChannel;
    private xmlParser: XMLParser;

    constructor(outputChannel: vscode.OutputChannel) {
        this.diagnosticCollection = vscode.languages.createDiagnosticCollection('ctrlppcheck');
        this.outputChannel = outputChannel;
        this.xmlParser = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: '',
        });
    }

    public async checkFile(document: vscode.TextDocument): Promise<void> {
        const config = vscode.workspace.getConfiguration('winccoa.ctrlppCheck');

        // Check if CtrlppCheck is enabled
        if (!config.get<boolean>('enabled', true)) {
            return;
        }

        const binaryPath = config.get<string>('binaryPath', '');
        if (!binaryPath || binaryPath.trim() === '') {
            this.outputChannel.appendLine(
                'CtrlppCheck: Binary path not configured. Set "winccoa.ctrlppCheck.binaryPath" in settings.',
            );
            return;
        }

        // Check if binary exists
        if (!fs.existsSync(binaryPath)) {
            this.outputChannel.appendLine(`CtrlppCheck: Binary not found at: ${binaryPath}`);
            vscode.window.showErrorMessage(`CtrlppCheck binary not found at: ${binaryPath}`);
            return;
        }

        // Only check .ctl and .ctrlpp files
        if (document.languageId !== 'ctrl' && document.languageId !== 'ctrlpp') {
            return;
        }

        const filePath = document.uri.fsPath;
        this.outputChannel.appendLine(`CtrlppCheck: Checking file ${filePath}`);

        try {
            const diagnostics = await this.runCtrlppCheck(binaryPath, filePath, config);
            this.diagnosticCollection.set(document.uri, diagnostics);
        } catch (error) {
            this.outputChannel.appendLine(`CtrlppCheck: Error checking file: ${error}`);
        }
    }

    private async runCtrlppCheck(
        binaryPath: string,
        filePath: string,
        config: vscode.WorkspaceConfiguration,
    ): Promise<vscode.Diagnostic[]> {
        const projectName = config.get<string>('projectName', 'DevEnv');
        const additionalArgs = config.get<string[]>('additionalArgs', []);

        // Create temporary file for XML output
        const tempDir = os.tmpdir();
        const outputFile = path.join(tempDir, `ctrlppcheck_${Date.now()}.xml`);

        const args = [
            `--winccoa-projectName=${projectName}`,
            '--xml',
            `--output-file=${outputFile}`,
            ...additionalArgs,
            filePath,
        ];

        this.outputChannel.appendLine(`CtrlppCheck: Running: ${binaryPath} ${args.join(' ')}`);

        return new Promise((resolve, reject) => {
            const process = cp.spawn(binaryPath, args);
            let stdout = '';
            let stderr = '';

            process.stdout.on('data', (data) => {
                stdout += data.toString();
            });

            process.stderr.on('data', (data) => {
                stderr += data.toString();
            });

            process.on('close', (code) => {
                this.outputChannel.appendLine(`CtrlppCheck: Process exited with code ${code}`);

                if (stdout) {
                    this.outputChannel.appendLine(`CtrlppCheck stdout: ${stdout}`);
                }
                if (stderr) {
                    this.outputChannel.appendLine(`CtrlppCheck stderr: ${stderr}`);
                }

                try {
                    this.outputChannel.appendLine(`CtrlppCheck: XML output file: ${outputFile}`);
                    const diagnostics = this.parseXmlOutput(outputFile, filePath);

                    // Keep temp file for debugging - comment out cleanup
                    // try {
                    //     fs.unlinkSync(outputFile);
                    // } catch (err) {
                    //     // Ignore cleanup errors
                    // }

                    resolve(diagnostics);
                } catch (error) {
                    this.outputChannel.appendLine(`CtrlppCheck: Error parsing output: ${error}`);
                    reject(error);
                }
            });

            process.on('error', (error) => {
                this.outputChannel.appendLine(
                    `CtrlppCheck: Failed to start process: ${error.message}`,
                );
                reject(error);
            });
        });
    }

    private parseXmlOutput(xmlFilePath: string, checkedFilePath: string): vscode.Diagnostic[] {
        if (!fs.existsSync(xmlFilePath)) {
            this.outputChannel.appendLine(`CtrlppCheck: XML output file not found: ${xmlFilePath}`);
            return [];
        }

        const xmlContent = fs.readFileSync(xmlFilePath, 'utf-8');
        this.outputChannel.appendLine(
            `CtrlppCheck: Parsing XML output (${xmlContent.length} bytes)`,
        );

        if (!xmlContent || xmlContent.trim() === '') {
            this.outputChannel.appendLine('CtrlppCheck: XML output is empty');
            return [];
        }

        try {
            const result: CtrlppCheckResult = this.xmlParser.parse(xmlContent);
            const diagnostics: vscode.Diagnostic[] = [];

            if (!result.results || !result.results.errors || !result.results.errors.error) {
                this.outputChannel.appendLine('CtrlppCheck: No errors found in XML');
                return [];
            }

            // Handle both single error and array of errors
            const errors = Array.isArray(result.results.errors.error)
                ? result.results.errors.error
                : [result.results.errors.error];

            for (const error of errors) {
                const diagnostic = this.createDiagnostic(error, checkedFilePath);
                if (diagnostic) {
                    diagnostics.push(diagnostic);
                }
            }

            this.outputChannel.appendLine(`CtrlppCheck: Found ${diagnostics.length} diagnostic(s)`);
            return diagnostics;
        } catch (error) {
            this.outputChannel.appendLine(`CtrlppCheck: XML parsing error: ${error}`);
            return [];
        }
    }

    private createDiagnostic(error: CtrlppCheckError, _filePath: string): vscode.Diagnostic | null {
        // Determine line number
        let line = 0;
        if (error.location && error.location.line) {
            line = parseInt(error.location.line, 10) - 1; // VS Code uses 0-based line numbers
            if (isNaN(line) || line < 0) {
                line = 0;
            }
        }

        // Create range (entire line)
        const range = new vscode.Range(line, 0, line, Number.MAX_SAFE_INTEGER);

        // Determine severity
        let severity = vscode.DiagnosticSeverity.Warning;
        if (error.severity) {
            switch (error.severity.toLowerCase()) {
                case 'error':
                    severity = vscode.DiagnosticSeverity.Error;
                    break;
                case 'warning':
                    severity = vscode.DiagnosticSeverity.Warning;
                    break;
                case 'information':
                case 'info':
                    severity = vscode.DiagnosticSeverity.Information;
                    break;
                case 'hint':
                    severity = vscode.DiagnosticSeverity.Hint;
                    break;
            }
        }

        // Build message
        let message = error.msg || 'CtrlppCheck issue';
        if (error.symbol) {
            message = `${message} (Symbol: ${error.symbol})`;
        }

        // Create diagnostic
        const diagnostic = new vscode.Diagnostic(range, message, severity);
        diagnostic.source = 'ctrlppcheck';
        diagnostic.code = error.id;

        return diagnostic;
    }

    public clearDiagnostics(uri?: vscode.Uri): void {
        if (uri) {
            this.diagnosticCollection.delete(uri);
        } else {
            this.diagnosticCollection.clear();
        }
    }

    public dispose(): void {
        this.diagnosticCollection.dispose();
    }
}
