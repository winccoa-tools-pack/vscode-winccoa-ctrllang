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
	ExtensionOutputChannel.info('WinCC OA CTRL Language Support is now active!');
	ExtensionOutputChannel.info('Extension Path: ' + context.extensionPath);

	// TODO: CtrlppCheck feature will be completed in a future release
	// // Initialize CtrlppCheck Service
	// ctrlppCheckService = new CtrlppCheckService(extensionOutput);
	// context.subscriptions.push(ctrlppCheckService);
	// ExtensionOutputChannel.info('CtrlppCheck Service initialized');

	// Initialize Astyle Formatter Service
	astyleFormatterService = new AstyleFormatterService(extensionOutput);
	context.subscriptions.push(astyleFormatterService);
	ExtensionOutputChannel.info('Astyle Formatter Service initialized');

	// Initialize WinCC OA Syntax Check Service
	syntaxCheckService = new WinccoaSyntaxCheckService(extensionOutput);
	context.subscriptions.push(syntaxCheckService);
	ExtensionOutputChannel.info('WinCC OA Syntax Check Service initialized');

	// Start the Language Server
	ExtensionOutputChannel.info('Starting Language Server...');
	startLanguageServer(context);

	// Setup on save handlers
	context.subscriptions.push(
		vscode.workspace.onDidSaveTextDocument(async (document) => {
			if (document.languageId !== 'ctrl' && document.languageId !== 'ctrlpp') {
				return;
			}

			// Run Astyle formatter first (if enabled)
			const astyleConfig = vscode.workspace.getConfiguration('winccoa.astyleFormatter');
			const astyleRunOnSave = astyleConfig.get<boolean>('runOnSave', true);
			
			if (astyleRunOnSave) {
				ExtensionOutputChannel.info(`Running Astyle formatter on save: ${document.fileName}`);
				await astyleFormatterService.formatDocument(document);
			}

			// Then run WinCC OA Syntax Check (if enabled)
			const syntaxCheckConfig = vscode.workspace.getConfiguration('winccoa.syntaxCheck');
			const syntaxCheckOnSave = syntaxCheckConfig.get<boolean>('executeOnSave', true);
			
			if (syntaxCheckOnSave) {
				ExtensionOutputChannel.info(`Running WinCC OA Syntax Check on save: ${document.fileName}`);
				await syntaxCheckService.checkFile(document);
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
				ExtensionOutputChannel.info('Configuration changed, clearing project paths cache');
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

			ExtensionOutputChannel.info(`Manual format: ${editor.document.fileName}`);
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

			ExtensionOutputChannel.info(`Manual syntax check: ${editor.document.fileName}`);
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
				ExtensionOutputChannel.info(`Requesting documentation for: ${functionName}`);
				const docUrl = await client.sendRequest('workspace/executeCommand', params);
				if (docUrl && typeof docUrl === 'string') {
					ExtensionOutputChannel.success(`Opening documentation: ${docUrl}`);
					vscode.env.openExternal(vscode.Uri.parse(docUrl));
				} else {
					ExtensionOutputChannel.warn(`No documentation found for '${functionName}'`);
					vscode.window.showInformationMessage(`No documentation found for '${functionName}'`);
				}
			} catch (error) {
				ExtensionOutputChannel.error(`Error getting documentation: ${error}`);
				vscode.window.showErrorMessage(`Error getting documentation: ${error}`);
			}
		})
	);
}

export function deactivate(): Thenable<void> | undefined {
	ExtensionOutputChannel.info('WinCC OA CTRL Language Support is deactivating...');
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
	
	ExtensionOutputChannel.debug(`Server module path: ${serverModule}`);
	
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
	ExtensionOutputChannel.info('Starting Language Server client...');
	client.start();
	
	ExtensionOutputChannel.success('WinCC OA Language Server started! 🚀');
}

