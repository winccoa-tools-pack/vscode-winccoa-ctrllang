/**
 * Language Model Tools for GitHub Copilot
 *
 * Provides CTL language analysis tools for AI assistants.
 * Tools for syntax checking, symbol information, and code navigation.
 */

import * as vscode from 'vscode';

/**
 * Language Model Tools Service
 *
 * Registers CTL-specific tools for GitHub Copilot autonomous access.
 */
export class LanguageModelToolsService {
    private disposables: vscode.Disposable[] = [];

    /**
     * Register all Language Model Tools
     */
    register(context: vscode.ExtensionContext): void {
        console.log('[LanguageModelTools] Registering CTL Language Tools...');

        // Tool 1: Syntax Check
        this.disposables.push(vscode.lm.registerTool('ctl_syntax_check', new SyntaxCheckTool()));

        // Tool 2: Get Diagnostics
        this.disposables.push(
            vscode.lm.registerTool('ctl_get_diagnostics', new GetDiagnosticsTool()),
        );

        // Tool 3: Get Symbol Info
        this.disposables.push(
            vscode.lm.registerTool('ctl_get_symbol_info', new GetSymbolInfoTool()),
        );

        // Tool 4: Find References
        this.disposables.push(
            vscode.lm.registerTool('ctl_find_references', new FindReferencesTool()),
        );

        // Tool 5: Goto Definition
        this.disposables.push(
            vscode.lm.registerTool('ctl_goto_definition', new GotoDefinitionTool()),
        );

        // Tool 6: Get Documentation Link
        this.disposables.push(
            vscode.lm.registerTool(
                'ctl_get_documentation_link',
                new GetDocumentationLinkTool(context),
            ),
        );

        // Add to context subscriptions
        context.subscriptions.push(...this.disposables);

        console.log('[LanguageModelTools] ✅ Registered 6 CTL Language Tools');
    }

    /**
     * Dispose all registered tools
     */
    dispose(): void {
        this.disposables.forEach((d) => d.dispose());
        this.disposables = [];
    }
}

/**
 * Tool 1: Syntax Check
 *
 * Checks CTL code for syntax errors.
 */
class SyntaxCheckTool implements vscode.LanguageModelTool<SyntaxCheckInput> {
    async invoke(
        options: vscode.LanguageModelToolInvocationOptions<SyntaxCheckInput>,
        _token: vscode.CancellationToken,
    ): Promise<vscode.LanguageModelToolResult> {
        try {
            const input = options.input;
            console.log(`[SyntaxCheckTool] Checking syntax for: ${input.file}`);

            const uri = vscode.Uri.file(input.file);
            const diagnostics = vscode.languages.getDiagnostics(uri);

            const syntaxErrors = diagnostics.filter(
                (d) => d.severity === vscode.DiagnosticSeverity.Error,
            );

            if (syntaxErrors.length === 0) {
                return new vscode.LanguageModelToolResult([
                    new vscode.LanguageModelTextPart(
                        JSON.stringify(
                            {
                                success: true,
                                file: input.file,
                                errors: [],
                                message: 'No syntax errors found',
                            },
                            null,
                            2,
                        ),
                    ),
                ]);
            }

            const errors = syntaxErrors.map((d) => ({
                line: d.range.start.line + 1, // 1-based
                column: d.range.start.character + 1,
                message: d.message,
                severity: 'error',
                code: d.code?.toString(),
            }));

            return new vscode.LanguageModelToolResult([
                new vscode.LanguageModelTextPart(
                    JSON.stringify(
                        {
                            success: false,
                            file: input.file,
                            errors,
                            message: `Found ${errors.length} syntax error(s)`,
                        },
                        null,
                        2,
                    ),
                ),
            ]);
        } catch (error: any) {
            console.error('[SyntaxCheckTool] Error:', error);
            return new vscode.LanguageModelToolResult([
                new vscode.LanguageModelTextPart(
                    JSON.stringify(
                        {
                            success: false,
                            error: error.message,
                        },
                        null,
                        2,
                    ),
                ),
            ]);
        }
    }
}

interface SyntaxCheckInput {
    file: string; // Absolute file path
}

/**
 * Tool 2: Get Diagnostics
 *
 * Gets all diagnostics (errors, warnings, info) for a CTL file.
 */
class GetDiagnosticsTool implements vscode.LanguageModelTool<GetDiagnosticsInput> {
    async invoke(
        options: vscode.LanguageModelToolInvocationOptions<GetDiagnosticsInput>,
        _token: vscode.CancellationToken,
    ): Promise<vscode.LanguageModelToolResult> {
        try {
            const input = options.input;
            console.log(`[GetDiagnosticsTool] Getting diagnostics for: ${input.file}`);

            const uri = vscode.Uri.file(input.file);
            const diagnostics = vscode.languages.getDiagnostics(uri);

            const result = diagnostics.map((d) => ({
                line: d.range.start.line + 1,
                column: d.range.start.character + 1,
                endLine: d.range.end.line + 1,
                endColumn: d.range.end.character + 1,
                message: d.message,
                severity: this.getSeverityString(d.severity),
                code: d.code?.toString(),
                source: d.source,
            }));

            return new vscode.LanguageModelToolResult([
                new vscode.LanguageModelTextPart(
                    JSON.stringify(
                        {
                            success: true,
                            file: input.file,
                            diagnostics: result,
                            count: result.length,
                        },
                        null,
                        2,
                    ),
                ),
            ]);
        } catch (error: any) {
            console.error('[GetDiagnosticsTool] Error:', error);
            return new vscode.LanguageModelToolResult([
                new vscode.LanguageModelTextPart(
                    JSON.stringify(
                        {
                            success: false,
                            error: error.message,
                        },
                        null,
                        2,
                    ),
                ),
            ]);
        }
    }

    private getSeverityString(severity: vscode.DiagnosticSeverity): string {
        switch (severity) {
            case vscode.DiagnosticSeverity.Error:
                return 'error';
            case vscode.DiagnosticSeverity.Warning:
                return 'warning';
            case vscode.DiagnosticSeverity.Information:
                return 'info';
            case vscode.DiagnosticSeverity.Hint:
                return 'hint';
            default:
                return 'unknown';
        }
    }
}

interface GetDiagnosticsInput {
    file: string;
}

/**
 * Tool 3: Get Symbol Info
 *
 * Gets information about a symbol at a specific position.
 */
class GetSymbolInfoTool implements vscode.LanguageModelTool<GetSymbolInfoInput> {
    async invoke(
        options: vscode.LanguageModelToolInvocationOptions<GetSymbolInfoInput>,
        token: vscode.CancellationToken,
    ): Promise<vscode.LanguageModelToolResult> {
        try {
            const input = options.input;
            console.log(
                `[GetSymbolInfoTool] Getting symbol info at ${input.file}:${input.line}:${input.column}`,
            );

            const uri = vscode.Uri.file(input.file);
            const document = await vscode.workspace.openTextDocument(uri);
            const position = new vscode.Position(input.line - 1, input.column - 1); // 0-based

            // Get hover information
            const hovers = await vscode.commands.executeCommand<vscode.Hover[]>(
                'vscode.executeHoverProvider',
                uri,
                position,
            );

            if (!hovers || hovers.length === 0) {
                return new vscode.LanguageModelToolResult([
                    new vscode.LanguageModelTextPart(
                        JSON.stringify(
                            {
                                success: false,
                                message: 'No symbol information found at this position',
                            },
                            null,
                            2,
                        ),
                    ),
                ]);
            }

            const hover = hovers[0];
            const content = hover.contents
                .map((c) => {
                    if (typeof c === 'string') {
                        return c;
                    } else if ('value' in c) {
                        return c.value;
                    }
                    return '';
                })
                .join('\n');

            return new vscode.LanguageModelToolResult([
                new vscode.LanguageModelTextPart(
                    JSON.stringify(
                        {
                            success: true,
                            file: input.file,
                            line: input.line,
                            column: input.column,
                            content,
                        },
                        null,
                        2,
                    ),
                ),
            ]);
        } catch (error: any) {
            console.error('[GetSymbolInfoTool] Error:', error);
            return new vscode.LanguageModelToolResult([
                new vscode.LanguageModelTextPart(
                    JSON.stringify(
                        {
                            success: false,
                            error: error.message,
                        },
                        null,
                        2,
                    ),
                ),
            ]);
        }
    }
}

interface GetSymbolInfoInput {
    file: string;
    line: number; // 1-based
    column: number; // 1-based
}

/**
 * Tool 4: Find References
 *
 * Finds all references to a symbol.
 */
class FindReferencesTool implements vscode.LanguageModelTool<FindReferencesInput> {
    async invoke(
        options: vscode.LanguageModelToolInvocationOptions<FindReferencesInput>,
        token: vscode.CancellationToken,
    ): Promise<vscode.LanguageModelToolResult> {
        try {
            const input = options.input;
            console.log(
                `[FindReferencesTool] Finding references at ${input.file}:${input.line}:${input.column}`,
            );

            const uri = vscode.Uri.file(input.file);
            const position = new vscode.Position(input.line - 1, input.column - 1);

            const locations = await vscode.commands.executeCommand<vscode.Location[]>(
                'vscode.executeReferenceProvider',
                uri,
                position,
            );

            if (!locations || locations.length === 0) {
                return new vscode.LanguageModelToolResult([
                    new vscode.LanguageModelTextPart(
                        JSON.stringify(
                            {
                                success: true,
                                references: [],
                                count: 0,
                            },
                            null,
                            2,
                        ),
                    ),
                ]);
            }

            const references = locations.map((loc) => ({
                file: loc.uri.fsPath,
                line: loc.range.start.line + 1,
                column: loc.range.start.character + 1,
                endLine: loc.range.end.line + 1,
                endColumn: loc.range.end.character + 1,
            }));

            return new vscode.LanguageModelToolResult([
                new vscode.LanguageModelTextPart(
                    JSON.stringify(
                        {
                            success: true,
                            references,
                            count: references.length,
                        },
                        null,
                        2,
                    ),
                ),
            ]);
        } catch (error: any) {
            console.error('[FindReferencesTool] Error:', error);
            return new vscode.LanguageModelToolResult([
                new vscode.LanguageModelTextPart(
                    JSON.stringify(
                        {
                            success: false,
                            error: error.message,
                        },
                        null,
                        2,
                    ),
                ),
            ]);
        }
    }
}

interface FindReferencesInput {
    file: string;
    line: number;
    column: number;
}

/**
 * Tool 5: Goto Definition
 *
 * Gets the definition location of a symbol.
 */
class GotoDefinitionTool implements vscode.LanguageModelTool<GotoDefinitionInput> {
    async invoke(
        options: vscode.LanguageModelToolInvocationOptions<GotoDefinitionInput>,
        token: vscode.CancellationToken,
    ): Promise<vscode.LanguageModelToolResult> {
        try {
            const input = options.input;
            console.log(
                `[GotoDefinitionTool] Finding definition at ${input.file}:${input.line}:${input.column}`,
            );

            const uri = vscode.Uri.file(input.file);
            const position = new vscode.Position(input.line - 1, input.column - 1);

            const locations = await vscode.commands.executeCommand<vscode.Location[]>(
                'vscode.executeDefinitionProvider',
                uri,
                position,
            );

            if (!locations || locations.length === 0) {
                return new vscode.LanguageModelToolResult([
                    new vscode.LanguageModelTextPart(
                        JSON.stringify(
                            {
                                success: false,
                                message: 'No definition found',
                            },
                            null,
                            2,
                        ),
                    ),
                ]);
            }

            const definitions = locations.map((loc) => ({
                file: loc.uri.fsPath,
                line: loc.range.start.line + 1,
                column: loc.range.start.character + 1,
                endLine: loc.range.end.line + 1,
                endColumn: loc.range.end.character + 1,
            }));

            return new vscode.LanguageModelToolResult([
                new vscode.LanguageModelTextPart(
                    JSON.stringify(
                        {
                            success: true,
                            definitions,
                            count: definitions.length,
                        },
                        null,
                        2,
                    ),
                ),
            ]);
        } catch (error: any) {
            console.error('[GotoDefinitionTool] Error:', error);
            return new vscode.LanguageModelToolResult([
                new vscode.LanguageModelTextPart(
                    JSON.stringify(
                        {
                            success: false,
                            error: error.message,
                        },
                        null,
                        2,
                    ),
                ),
            ]);
        }
    }
}

interface GotoDefinitionInput {
    file: string;
    line: number;
    column: number;
}

/**
 * Tool 6: Get Documentation Link
 *
 * Searches the WinCC OA documentation database for a function/method and returns the documentation URL.
 */
class GetDocumentationLinkTool implements vscode.LanguageModelTool<GetDocumentationLinkInput> {
    private docsData: any[] | null = null;
    private docsPath: string;

    constructor(private context: vscode.ExtensionContext) {
        // Path to winccoa-docs-crawled.json
        this.docsPath = vscode.Uri.joinPath(
            context.extensionUri,
            'resources',
            'winccoa-docs-crawled.json',
        ).fsPath;
    }

    async invoke(
        options: vscode.LanguageModelToolInvocationOptions<GetDocumentationLinkInput>,
        _token: vscode.CancellationToken,
    ): Promise<vscode.LanguageModelToolResult> {
        try {
            const input = options.input;
            console.log(`[GetDocumentationLinkTool] Searching docs for: ${input.functionName}`);

            // Lazy load documentation data
            if (!this.docsData) {
                await this.loadDocsData();
            }

            if (!this.docsData) {
                return new vscode.LanguageModelToolResult([
                    new vscode.LanguageModelTextPart(
                        JSON.stringify(
                            {
                                success: false,
                                error: 'Documentation database not found',
                            },
                            null,
                            2,
                        ),
                    ),
                ]);
            }

            // Search for the function (case-insensitive)
            const searchTerm = input.functionName.toLowerCase().replace(/[()]/g, '');
            const matches = this.docsData.filter((doc) => {
                const docName = doc.name.toLowerCase();
                return docName === searchTerm || docName.startsWith(searchTerm);
            });

            if (matches.length === 0) {
                return new vscode.LanguageModelToolResult([
                    new vscode.LanguageModelTextPart(
                        JSON.stringify(
                            {
                                found: false,
                                message: `No documentation found for '${input.functionName}' in local database.`,
                                suggestion: `Search the web for: "WinCC OA ${input.functionName} documentation" or visit https://www.winccoa.com/documentation/WinCCOA/latest/en_US/`,
                            },
                            null,
                            2,
                        ),
                    ),
                ]);
            }

            // Return ONLY the link - nothing else
            const bestMatch = matches[0];
            const result = {
                found: true,
                functionName: bestMatch.name,
                documentationUrl: bestMatch.sourceUrl,
            };

            return new vscode.LanguageModelToolResult([
                new vscode.LanguageModelTextPart(JSON.stringify(result, null, 2)),
            ]);
        } catch (error: any) {
            console.error('[GetDocumentationLinkTool] Error:', error);
            return new vscode.LanguageModelToolResult([
                new vscode.LanguageModelTextPart(
                    JSON.stringify(
                        {
                            success: false,
                            error: error.message,
                        },
                        null,
                        2,
                    ),
                ),
            ]);
        }
    }

    private async loadDocsData(): Promise<void> {
        try {
            const fs = require('fs').promises;
            const content = await fs.readFile(this.docsPath, 'utf8');
            this.docsData = JSON.parse(content);
            console.log(
                `[GetDocumentationLinkTool] Loaded ${
                    this.docsData?.length || 0
                } documentation entries`,
            );
        } catch (error: any) {
            console.error(`[GetDocumentationLinkTool] Failed to load docs: ${error.message}`);
            this.docsData = null;
        }
    }
}

interface GetDocumentationLinkInput {
    functionName: string; // Name of the CTL function/method to look up (e.g., "dpGet", "dpConnect")
}
