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
	ExtensionOutputChannel.info('Extension', 'WinCC OA CTRL Language Support is now active!');
	ExtensionOutputChannel.debug('Extension', `Extension Path: ${context.extensionPath}`);
	ExtensionOutputChannel.debug('Extension', `VS Code Version: ${vscode.version}`);
	
	// Watch for configuration changes
	context.subscriptions.push(
		vscode.workspace.onDidChangeConfiguration((e) => {
			if (e.affectsConfiguration('winccoa.ctrlLang.logLevel')) {
				ExtensionOutputChannel.updateLogLevel();
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
	ExtensionOutputChannel.trace('LanguageServer', 'Client configuration', clientOptions);
	client.start();
	
	ExtensionOutputChannel.success('LanguageServer', 'WinCC OA Language Server started! 🚀');
}

