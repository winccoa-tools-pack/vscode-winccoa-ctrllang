import * as vscode from 'vscode';
import * as path from 'path';
import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind
} from 'vscode-languageclient/node';
import { ExtensionOutputChannel } from './extensionOutput';
import { ProjectPathResolver } from './services/projectPathResolver';
// TODO: CtrlppCheck feature will be completed in a future release
// import { CtrlppCheckService } from './services/ctrlppCheckService';
import { AstyleFormatterService } from './services/astyleFormatterService';
import { WinccoaSyntaxCheckService } from './services/winccoaSyntaxCheckService';

let client: LanguageClient;
// TODO: CtrlppCheck feature will be completed in a future release
// let ctrlppCheckService: CtrlppCheckService;
let astyleFormatterService: AstyleFormatterService;
let syntaxCheckService: WinccoaSyntaxCheckService;

export function activate(context: vscode.ExtensionContext) {
	// Initialize Extension Output Channel
	const extensionOutput = ExtensionOutputChannel.initialize();
	context.subscriptions.push(extensionOutput);
	
	// Log activation
	ExtensionOutputChannel.info('Extension', '═══════════════════════════════════════════════════════');
	ExtensionOutputChannel.info('Extension', '  WinCC OA CTRL Language Support - Starting...');
	ExtensionOutputChannel.info('Extension', '═══════════════════════════════════════════════════════');
	ExtensionOutputChannel.debug('Extension', `Extension Path: ${context.extensionPath}`);
	ExtensionOutputChannel.debug('Extension', `VS Code Version: ${vscode.version}`);
	
	// Perform startup diagnostics
	performStartupDiagnostics(context);
	
	// Setup Core extension integration if in automatic mode
	setupCoreExtensionIntegration(context);
	
	// Watch for configuration changes
	context.subscriptions.push(
		vscode.workspace.onDidChangeConfiguration((e) => {
			if (e.affectsConfiguration('winccoa.ctrlLang.logLevel')) {
				ExtensionOutputChannel.updateLogLevel();
			}
			if (e.affectsConfiguration('winccoa.ctrlLang.pathSource')) {
				// Clear cache and re-setup Core integration when mode changes
				ProjectPathResolver.getInstance()['cachedPaths'] = null;
				setupCoreExtensionIntegration(context);
			}
		})
	);

	// TODO: CtrlppCheck feature will be completed in a future release
	// // Initialize CtrlppCheck Service
	// ctrlppCheckService = new CtrlppCheckService(extensionOutput);
	// context.subscriptions.push(ctrlppCheckService);
	// ExtensionOutputChannel.info('CtrlppCheck Service initialized');

	// Initialize Astyle Formatter Service
	ExtensionOutputChannel.trace('Extension', 'Initializing Astyle Formatter Service...');
	astyleFormatterService = new AstyleFormatterService(extensionOutput);
	context.subscriptions.push(astyleFormatterService);
	ExtensionOutputChannel.info('Services', 'Astyle Formatter Service initialized');

	// Initialize WinCC OA Syntax Check Service
	ExtensionOutputChannel.trace('Extension', 'Initializing WinCC OA Syntax Check Service...');
	syntaxCheckService = new WinccoaSyntaxCheckService(extensionOutput);
	context.subscriptions.push(syntaxCheckService);
	ExtensionOutputChannel.info('Services', 'WinCC OA Syntax Check Service initialized');

	// Start the Language Server
	ExtensionOutputChannel.info('LanguageServer', 'Starting Language Server...');
	startLanguageServer(context);

	// Watch for newly created .ctl files
	context.subscriptions.push(
		vscode.workspace.onDidCreateFiles(async (event) => {
			// Check if auto-suggest is enabled
			const config = vscode.workspace.getConfiguration('winccoa.templates');
			const autoSuggest = config.get<boolean>('autoSuggest', true);
			
			if (!autoSuggest) {
				return;
			}
			
			for (const file of event.files) {
				if (file.fsPath.match(/\.(ctl|ctrl|ctlpp|ctrlpp)$/)) {
					// Check if file is empty or very small (likely new)
					const document = await vscode.workspace.openTextDocument(file);
					if (document.getText().trim().length < 100) {
						// Ask user if they want to insert a template
						const isTest = file.fsPath.includes('/tests/') || file.fsPath.includes('Test');
						const templateType = isTest ? 'Test' : 'Script';
						const templateFile = isTest ? 'test-template.ctl' : 'script-template.ctl';
						
						const choice = await vscode.window.showInformationMessage(
							`Insert ${templateType} template?`,
							'Yes',
							'No'
						);
						
						if (choice === 'Yes') {
							// Open the file in editor
							const editor = await vscode.window.showTextDocument(document);
							// Insert template
							await insertTemplate(context, templateFile, templateType);
						}
					}
				}
			}
		})
	);

	// Setup on save handlers
	context.subscriptions.push(
		vscode.workspace.onDidSaveTextDocument(async (document) => {
			if (document.languageId !== 'ctrl' && document.languageId !== 'ctrlpp') {
				ExtensionOutputChannel.trace('SaveHandler', `Ignoring non-ctrl file: ${document.fileName}`);
				return;
			}

			ExtensionOutputChannel.debug('SaveHandler', `File saved: ${document.fileName}`);

			// Run Astyle formatter first (if enabled)
			const astyleConfig = vscode.workspace.getConfiguration('winccoa.astyleFormatter');
			const astyleRunOnSave = astyleConfig.get<boolean>('runOnSave', true);
			
			if (astyleRunOnSave) {
				ExtensionOutputChannel.info('Formatter', `Running Astyle formatter: ${path.basename(document.fileName)}`);
				await astyleFormatterService.formatDocument(document);
			} else {
				ExtensionOutputChannel.trace('Formatter', 'Astyle formatter disabled (runOnSave=false)');
			}

			// Then run WinCC OA Syntax Check (if enabled)
			const syntaxCheckConfig = vscode.workspace.getConfiguration('winccoa.syntaxCheck');
			const syntaxCheckOnSave = syntaxCheckConfig.get<boolean>('executeOnSave', true);
			
			if (syntaxCheckOnSave) {
				ExtensionOutputChannel.info('SyntaxCheck', `Running WinCC OA Syntax Check: ${path.basename(document.fileName)}`);
				await syntaxCheckService.checkFile(document);
			} else {
				ExtensionOutputChannel.trace('SyntaxCheck', 'WinCC OA Syntax Check disabled (executeOnSave=false)');
			}

			// TODO: CtrlppCheck feature will be completed in a future release
			// // Finally run CtrlppCheck (if enabled)
			// const ctrlppCheckConfig = vscode.workspace.getConfiguration('winccoa.ctrlppCheck');
			// const ctrlppCheckRunOnSave = ctrlppCheckConfig.get<boolean>('runOnSave', true);
			// 
			// if (ctrlppCheckRunOnSave) {
			// 	ExtensionOutputChannel.info(`Running CtrlppCheck on save: ${document.fileName}`);
			// 	await ctrlppCheckService.checkFile(document);
			// }
		})
	);

	// TODO: CtrlppCheck feature will be completed in a future release
	// // Setup CtrlppCheck on open
	// context.subscriptions.push(
	// 	vscode.workspace.onDidOpenTextDocument(async (document) => {
	// 		if (document.languageId === 'ctrl' || document.languageId === 'ctrlpp') {
	// 			ExtensionOutputChannel.info(`Running CtrlppCheck on open: ${document.fileName}`);
	// 			await ctrlppCheckService.checkFile(document);
	// 		}
	// 	})
	// );

	// TODO: CtrlppCheck feature will be completed in a future release
	// // Check already open documents
	// vscode.workspace.textDocuments.forEach(async (document) => {
	// 	if (document.languageId === 'ctrl' || document.languageId === 'ctrlpp') {
	// 		ExtensionOutputChannel.info(`Running CtrlppCheck on already open: ${document.fileName}`);
	// 		await ctrlppCheckService.checkFile(document);
	// 	}
	// });

	// TODO: CtrlppCheck feature will be completed in a future release
	// // Clear diagnostics when file is closed
	// context.subscriptions.push(
	// 	vscode.workspace.onDidCloseTextDocument((document) => {
	// 		if (document.languageId === 'ctrl' || document.languageId === 'ctrlpp') {
	// 			ctrlppCheckService.clearDiagnostics(document.uri);
	// 		}
	// 	})
	// );

	// Watch for configuration changes
	context.subscriptions.push(
		vscode.workspace.onDidChangeConfiguration((e) => {
			if (e.affectsConfiguration('winccoa.ctrlLang')) {
				ExtensionOutputChannel.info('Configuration', 'Configuration changed, clearing project paths cache');
				ExtensionOutputChannel.debug('Configuration', `Affected sections: winccoa.ctrlLang`);
				ProjectPathResolver.getInstance().clearCache();
			}
			
			// TODO: CtrlppCheck feature will be completed in a future release
			// if (e.affectsConfiguration('winccoa.ctrlppCheck')) {
			// 	ExtensionOutputChannel.info('CtrlppCheck configuration changed, re-checking open files');
			// 	// Re-check all open ctrl files
			// 	vscode.workspace.textDocuments.forEach(async (document) => {
			// 		if (document.languageId === 'ctrl' || document.languageId === 'ctrlpp') {
			// 			await ctrlppCheckService.checkFile(document);
			// 		}
			// 	});
			// }
		})
	);

	// TODO: CtrlppCheck feature will be completed in a future release
	// // Register manual check command
	// context.subscriptions.push(
	// 	vscode.commands.registerCommand('winccoa.runCtrlppCheck', async () => {
	// 		const editor = vscode.window.activeTextEditor;
	// 		if (!editor) {
	// 			vscode.window.showErrorMessage('No active editor');
	// 			return;
	// 		}
	// 		
	// 		if (editor.document.languageId !== 'ctrl' && editor.document.languageId !== 'ctrlpp') {
	// 			vscode.window.showErrorMessage('Current file is not a Ctrl or Ctrl++ file');
	// 			return;
	// 		}
	//
	// 		ExtensionOutputChannel.info(`Manual CtrlppCheck run: ${editor.document.fileName}`);
	// 		await ctrlppCheckService.checkFile(editor.document);
	// 		vscode.window.showInformationMessage('CtrlppCheck analysis complete');
	// 	})
	// );

	// Register manual format command
	context.subscriptions.push(
		vscode.commands.registerCommand('winccoa.formatDocument', async () => {
			const editor = vscode.window.activeTextEditor;
			if (!editor) {
				vscode.window.showErrorMessage('No active editor');
				return;
			}
			
			if (editor.document.languageId !== 'ctrl' && editor.document.languageId !== 'ctrlpp') {
				vscode.window.showErrorMessage('Current file is not a Ctrl or Ctrl++ file');
				return;
			}

			ExtensionOutputChannel.info('Command', `Manual format: ${path.basename(editor.document.fileName)}`);
			const success = await astyleFormatterService.formatDocument(editor.document);
			if (success) {
				vscode.window.showInformationMessage('File formatted successfully');
			} else {
				vscode.window.showWarningMessage('Formatting failed or disabled');
			}
		})
	);

	// Register manual syntax check command
	context.subscriptions.push(
		vscode.commands.registerCommand('winccoa.runSyntaxCheck', async () => {
			const editor = vscode.window.activeTextEditor;
			if (!editor) {
				vscode.window.showErrorMessage('No active editor');
				return;
			}
			
			if (editor.document.languageId !== 'ctrl' && editor.document.languageId !== 'ctrlpp') {
				vscode.window.showErrorMessage('Current file is not a Ctrl or Ctrl++ file');
				return;
			}

			ExtensionOutputChannel.info('Command', `Manual syntax check: ${path.basename(editor.document.fileName)}`);
			await syntaxCheckService.checkFile(editor.document);
			vscode.window.showInformationMessage('Syntax check complete');
		})
	);

	// Register template insertion commands
	context.subscriptions.push(
		vscode.commands.registerCommand('winccoa.insertTestTemplate', async () => {
			await insertTemplate(context, 'test-template.ctl', 'Test');
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('winccoa.insertScriptTemplate', async () => {
			await insertTemplate(context, 'script-template.ctl', 'Script');
		})
	);

	// Register Open Documentation command
	context.subscriptions.push(
		vscode.commands.registerCommand('winccoa.openDocumentation', async () => {
			const editor = vscode.window.activeTextEditor;
			if (!editor) {
				vscode.window.showErrorMessage('No active editor');
				return;
			}

			// Get the word under the cursor
			const document = editor.document;
			const position = editor.selection.active;
			const wordRange = document.getWordRangeAtPosition(position, /[a-zA-Z0-9_]+/);
			
			if (!wordRange) {
				vscode.window.showInformationMessage('No function name found at cursor position');
				return;
			}

			const functionName = document.getText(wordRange);
			
			// Request documentation URL from language server
			const params = {
				command: 'getDocUrl',
				arguments: [functionName]
			};
			
			try {
			ExtensionOutputChannel.info('Documentation', `Requesting documentation for: ${functionName}`);
			const docUrl = await client.sendRequest('workspace/executeCommand', params);
			if (docUrl && typeof docUrl === 'string') {
				ExtensionOutputChannel.success('Documentation', `Opening documentation: ${docUrl}`);
				vscode.env.openExternal(vscode.Uri.parse(docUrl));
			} else {
				ExtensionOutputChannel.warn('Documentation', `No documentation found for '${functionName}'`);
				vscode.window.showInformationMessage(`No documentation found for '${functionName}'`);
			}
		} catch (error) {
			const err = error as Error;
			ExtensionOutputChannel.error('Documentation', `Error getting documentation: ${err.message}`, err);
				vscode.window.showErrorMessage(`Error getting documentation: ${error}`);
			}
		})
	);
}

export function deactivate(): Thenable<void> | undefined {
	ExtensionOutputChannel.info('Extension', 'WinCC OA CTRL Language Support is deactivating...');
	if (!client) {
		return undefined;
	}
	return client.stop();
}

function startLanguageServer(context: vscode.ExtensionContext) {
	// The server is implemented in node
	const serverModule = context.asAbsolutePath(
		path.join('dist', 'language-server', 'server.js')
	);
	
	ExtensionOutputChannel.debug('LanguageServer', `Server module path: ${serverModule}`);
	
	// If the extension is launched in debug mode then the debug server options are used
	// Otherwise the run options are used
	const serverOptions: ServerOptions = {
		run: { module: serverModule, transport: TransportKind.ipc },
		debug: {
			module: serverModule,
			transport: TransportKind.ipc,
			options: { execArgv: ['--nolazy', '--inspect=6009'] }
		}
	};

	// Options to control the language client
	const clientOptions: LanguageClientOptions = {
		// Register the server for WinCC OA control files
		documentSelector: [
			{ scheme: 'file', language: 'ctrl' },
			{ scheme: 'file', pattern: '**/*.ctl' },
			{ scheme: 'file', pattern: '**/*.ctrl' }
		],
		synchronize: {
			// Notify the server about file changes to '.ctl and .ctrl files contained in the workspace
			fileEvents: vscode.workspace.createFileSystemWatcher('**/*.{ctl,ctrl}')
		},
		outputChannel: ExtensionOutputChannel.initialize()
	};

	// Create the language client and start the client.
	client = new LanguageClient(
		'winccoaLanguageServer',
		'WinCC OA Language Server',
		serverOptions,
		clientOptions
	);

	// Start the client. This will also launch the server
	ExtensionOutputChannel.info('LanguageServer', 'Starting Language Server client...');
	client.start();
	
	ExtensionOutputChannel.success('LanguageServer', 'WinCC OA Language Server started! 🚀');
}

async function performStartupDiagnostics(context: vscode.ExtensionContext) {
	ExtensionOutputChannel.info('Diagnostics', '');
	ExtensionOutputChannel.info('Diagnostics', '📊 Extension Startup Diagnostics');
	ExtensionOutputChannel.info('Diagnostics', '─────────────────────────────────────────────────────');

	// 1. Check Workspace
	const workspaceFolders = vscode.workspace.workspaceFolders;
	if (!workspaceFolders || workspaceFolders.length === 0) {
		ExtensionOutputChannel.warn('Diagnostics', '⚠️  No workspace folder opened');
		ExtensionOutputChannel.info('Diagnostics', '   → Open a folder containing WinCC OA project');
		vscode.window.showWarningMessage('WinCC OA: No workspace folder opened. Please open a folder containing a WinCC OA project.');
	} else {
		ExtensionOutputChannel.info('Diagnostics', `✓ Workspace folders: ${workspaceFolders.length}`);
		workspaceFolders.forEach((folder, idx) => {
			ExtensionOutputChannel.debug('Diagnostics', `  [${idx + 1}] ${folder.uri.fsPath}`);
		});
	}

	// 2. Check Project Detection
	ExtensionOutputChannel.info('Diagnostics', '');
	ExtensionOutputChannel.info('Diagnostics', '🔍 WinCC OA Project Detection');
	const config = vscode.workspace.getConfiguration('winccoa.ctrlLang');
	const pathSource = config.get<string>('pathSource', 'workspace');
	ExtensionOutputChannel.info('Diagnostics', `   Path Source Mode: ${pathSource}`);

	try {
		const projectPaths = await ProjectPathResolver.getInstance().getProjectPaths();
		if (projectPaths) {
			ExtensionOutputChannel.success('Diagnostics', '✓ WinCC OA Project detected');
			ExtensionOutputChannel.info('Diagnostics', `   Project Path: ${projectPaths.projectPath}`);
			ExtensionOutputChannel.info('Diagnostics', `   Install Path: ${projectPaths.installPath}`);
			ExtensionOutputChannel.info('Diagnostics', `   Subprojects: ${projectPaths.subProjects.length}`);
			ExtensionOutputChannel.info('Diagnostics', `   Scripts Paths: ${projectPaths.scriptsPaths.length}`);
			ExtensionOutputChannel.trace('Diagnostics', '   Full project paths', projectPaths);
		} else {
			ExtensionOutputChannel.warn('Diagnostics', '⚠️  No WinCC OA Project detected');
			if (pathSource === 'workspace') {
				ExtensionOutputChannel.info('Diagnostics', '   → No config/config file found in workspace');
				ExtensionOutputChannel.info('Diagnostics', '   → Open a WinCC OA project folder or configure manually');
				vscode.window.showWarningMessage(
					'WinCC OA: No project detected. Open a folder with config/config or set manual paths in settings.',
					'Open Settings'
				).then(selection => {
					if (selection === 'Open Settings') {
						vscode.commands.executeCommand('workbench.action.openSettings', 'winccoa.ctrlLang');
					}
				});
			} else {
				ExtensionOutputChannel.warn('Diagnostics', '   → Manual mode: Check your path configuration');
				ExtensionOutputChannel.info('Diagnostics', '   → Verify winccoa.ctrlLang.projectPath setting');
			}
		}
	} catch (error) {
		const err = error as Error;
		ExtensionOutputChannel.error('Diagnostics', `Error detecting project: ${err.message}`, err);
	}

	// 3. Check Feature Status
	ExtensionOutputChannel.info('Diagnostics', '');
	ExtensionOutputChannel.info('Diagnostics', '⚙️  Feature Status');
	
	const formatterConfig = vscode.workspace.getConfiguration('winccoa.astyleFormatter');
	const formatterEnabled = formatterConfig.get<boolean>('enabled', false);
	const formatterOnSave = formatterConfig.get<boolean>('runOnSave', false);
	
	const syntaxCheckConfig = vscode.workspace.getConfiguration('winccoa.syntaxCheck');
	const syntaxCheckEnabled = syntaxCheckConfig.get<boolean>('enabled', false);
	const syntaxCheckOnSave = syntaxCheckConfig.get<boolean>('executeOnSave', false);
	
	const logLevel = config.get<string>('logLevel', 'INFO');

	ExtensionOutputChannel.info('Diagnostics', `   Astyle Formatter: ${formatterEnabled ? '✓ Enabled' : '✗ Disabled'}`);
	if (formatterEnabled) {
		ExtensionOutputChannel.info('Diagnostics', `      Format on Save: ${formatterOnSave ? 'Yes' : 'No'}`);
	}
	
	ExtensionOutputChannel.info('Diagnostics', `   Syntax Check: ${syntaxCheckEnabled ? '✓ Enabled' : '✗ Disabled'}`);
	if (syntaxCheckEnabled) {
		ExtensionOutputChannel.info('Diagnostics', `      Check on Save: ${syntaxCheckOnSave ? 'Yes' : 'No'}`);
	}
	
	ExtensionOutputChannel.info('Diagnostics', `   Log Level: ${logLevel}`);

	// 4. Available Features (always active)
	ExtensionOutputChannel.info('Diagnostics', '');
	ExtensionOutputChannel.info('Diagnostics', '✨ Always Active Features');
	ExtensionOutputChannel.info('Diagnostics', '   ✓ Syntax Highlighting');
	ExtensionOutputChannel.info('Diagnostics', '   ✓ IntelliSense (983 built-in functions)');
	ExtensionOutputChannel.info('Diagnostics', '   ✓ Goto Definition (F12)');
	ExtensionOutputChannel.info('Diagnostics', '   ✓ Find References');
	ExtensionOutputChannel.info('Diagnostics', '   ✓ Hover Documentation');
	ExtensionOutputChannel.info('Diagnostics', '   ✓ Function Signatures');

	// 5. Summary
	ExtensionOutputChannel.info('Diagnostics', '');
	ExtensionOutputChannel.info('Diagnostics', '─────────────────────────────────────────────────────');
	ExtensionOutputChannel.success('Diagnostics', '✓ Startup diagnostics complete');
	ExtensionOutputChannel.info('Diagnostics', '═══════════════════════════════════════════════════════');
	ExtensionOutputChannel.info('Diagnostics', '');
}

/**
 * Insert a template at the beginning of the current file
 * @param context Extension context
 * @param templateFileName Template file name in resources/templates/
 * @param templateType Type name for logging (e.g., 'Test', 'Script')
 */
async function insertTemplate(context: vscode.ExtensionContext, templateFileName: string, templateType: string) {
	const editor = vscode.window.activeTextEditor;
	if (!editor) {
		vscode.window.showErrorMessage('No active editor');
		return;
	}

	if (editor.document.languageId !== 'ctrl' && editor.document.languageId !== 'ctrlpp') {
		vscode.window.showErrorMessage('Template insertion only works in .ctl files');
		return;
	}

	try {
		// Read template file
		const templatePath = path.join(context.extensionPath, 'resources', 'templates', templateFileName);
		const fs = require('fs');
		const os = require('os');
		let templateContent = fs.readFileSync(templatePath, 'utf-8');

		// Get file information
		const fileName = path.basename(editor.document.fileName);
		const className = fileName.replace(/\.(ctl|ctrl|ctlpp|ctrlpp)$/, '');
		const author = os.userInfo().username;

		// Calculate relative path from workspace/project root
		const workspaceFolder = vscode.workspace.getWorkspaceFolder(editor.document.uri);
		let relPath = fileName;
		if (workspaceFolder) {
			relPath = path.relative(workspaceFolder.uri.fsPath, editor.document.uri.fsPath);
			// Convert to forward slashes for consistency
			relPath = relPath.replace(/\\/g, '/');
		}

		// For test templates: derive library path
		let origLibRelPath = relPath;
		let origLibRelPathWithoutExtension = relPath.replace(/\.(ctl|ctrl|ctlpp|ctrlpp)$/, '');
		let origLibName = className;

		if (templateType === 'Test') {
			// Assume tests are in scripts/tests/ and libs are in scripts/libs/
			// Convert scripts/tests/MyTest.ctl -> scripts/libs/MyLib.ctl
			if (relPath.includes('scripts/tests/')) {
				origLibRelPath = relPath.replace('scripts/tests/', 'scripts/libs/');
				origLibRelPathWithoutExtension = origLibRelPath.replace(/\.(ctl|ctrl|ctlpp|ctrlpp)$/, '');
			} else {
				// Fallback: use class name without extension
				origLibRelPathWithoutExtension = className;
			}
		}

		// Replace placeholders
		templateContent = templateContent
			.replace(/\$relPath/g, relPath)
			.replace(/\$copyright/g, '$copyright')
			.replace(/\$author/g, author)
			.replace(/\$className/g, className)
			.replace(/\$origLibRelPath/g, origLibRelPath)
			.replace(/\$origLibRelPathWithoutExtension/g, origLibRelPathWithoutExtension)
			.replace(/\$origLibName/g, origLibName);

		// Insert at the beginning of the document
		await editor.edit((editBuilder) => {
			const firstLine = editor.document.lineAt(0);
			editBuilder.insert(firstLine.range.start, templateContent + '\n\n');
		});

		ExtensionOutputChannel.info('Template', `${templateType} template inserted: ${fileName}`);
		vscode.window.showInformationMessage(`${templateType} template inserted successfully`);
	} catch (error) {
		ExtensionOutputChannel.error('Template', `Failed to insert template: ${error}`);
		vscode.window.showErrorMessage(`Failed to insert template: ${error}`);
	}
}

async function setupCoreExtensionIntegration(context: vscode.ExtensionContext) {
	const config = vscode.workspace.getConfiguration('winccoa.ctrlLang');
	const pathSource = config.get<string>('pathSource', 'workspace');

	if (pathSource !== 'automatic') {
		ExtensionOutputChannel.debug('CoreIntegration', 'Not in automatic mode - Core extension integration disabled');
		return;
	}

	const coreExtension = vscode.extensions.getExtension('winccoa-tools-pack.winccoa-core');
	
	if (!coreExtension) {
		ExtensionOutputChannel.warn('CoreIntegration', 'WinCC OA Core extension not found - automatic mode unavailable');
		return;
	}

	if (!coreExtension.isActive) {
		ExtensionOutputChannel.debug('CoreIntegration', 'Activating Core extension...');
		await coreExtension.activate();
	}

	const coreApi = coreExtension.exports;
	
	// Subscribe to project changes
	coreApi.onDidChangeProject((project: any) => {
		if (project) {
			ExtensionOutputChannel.info('CoreIntegration', `Project changed: ${project.name} → Clearing path cache`);
			// Clear cached paths to force re-resolution
			ProjectPathResolver.getInstance()['cachedPaths'] = null;
		} else {
			ExtensionOutputChannel.info('CoreIntegration', 'No project selected');
		}
	});

	const currentProject = coreApi.getCurrentProject();
	if (currentProject) {
		ExtensionOutputChannel.info('CoreIntegration', `Current project: ${currentProject.name}`);
		ExtensionOutputChannel.debug('CoreIntegration', `  Project path: ${currentProject.projectDir}`);
		ExtensionOutputChannel.debug('CoreIntegration', `  Install path: ${currentProject.oaInstallPath}`);
	} else {
		ExtensionOutputChannel.debug('CoreIntegration', 'No project currently selected');
	}
}
