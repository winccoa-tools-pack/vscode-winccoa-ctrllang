import {
    createConnection,
    TextDocuments,
    ProposedFeatures,
    InitializeParams,
    DidChangeConfigurationNotification,
    CompletionItem,
    CompletionItemKind,
    TextDocumentPositionParams,
    ReferenceParams,
    TextDocumentSyncKind,
    InitializeResult,
    Hover,
    MarkupKind,
    Definition,
    Location
} from 'vscode-languageserver/node';

import { TextDocument } from 'vscode-languageserver-textdocument';
import { getBuiltinFunction, getAllBuiltinFunctions } from './builtins';
import { resolveUsesPath, getUsesAtPosition, ProjectInfo } from './usesResolver';
import { 
    findFunctionDefinitions, 
    findGlobalVariables, 
    getSymbolAtPosition,
    isFunctionCall
} from './symbolFinder';
import { SymbolTable, SymbolKind, SymbolReference, BaseSymbol } from './symbolTable';
import * as fs from 'fs';
import * as path from 'path';
import { pathToFileURL, fileURLToPath } from 'url';

const connection = createConnection(ProposedFeatures.all);
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

// Cache for project info
let projectInfo: ProjectInfo | null = null;

// Configuration settings
interface ServerSettings {
    pathSource: 'api' | 'workspace' | 'manual';
    apiUrl: string;
    projectPath: string;
    installPath: string;
    subProjects: string[];
    additionalScriptsPaths: string[];
}

let globalSettings: ServerSettings = {
    pathSource: 'workspace',
    apiUrl: 'http://localhost:3000/api/getProjectInfo',
    projectPath: '',
    installPath: '',
    subProjects: [],
    additionalScriptsPaths: []
};

function parseSubProjectsFromConfig(configPath: string, mainProjectPath: string): string[] {
    const subProjects: string[] = [];
    
    connection.console.log('[parseSubProjectsFromConfig] Reading config: ' + configPath);
    connection.console.log('[parseSubProjectsFromConfig] Main project: ' + mainProjectPath);
    
    if (!fs.existsSync(configPath)) {
        connection.console.log('[parseSubProjectsFromConfig] Config file not found');
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
                
                connection.console.log('[parseSubProjectsFromConfig] Found subproject: ' + projPath);
                subProjects.push(projPath);
            }
        }
        
        connection.console.log(`[parseSubProjectsFromConfig] Found ${subProjects.length} subprojects`);
    } catch (err) {
        connection.console.log('[parseSubProjectsFromConfig] Error: ' + err);
    }
    
    return subProjects;
}

async function fetchProjectInfo(): Promise<ProjectInfo | null> {
    if (projectInfo) return projectInfo;
    
    connection.console.log(`[fetchProjectInfo] Mode: ${globalSettings.pathSource}`);
    
    switch (globalSettings.pathSource) {
        case 'api':
            return await fetchFromApi();
        case 'workspace':
            return await fetchFromWorkspace();
        case 'manual':
            return await fetchFromConfig();
        default:
            connection.console.log('[fetchProjectInfo] Unknown mode, falling back to workspace');
            return await fetchFromWorkspace();
    }
}

async function fetchFromApi(): Promise<ProjectInfo | null> {
    try {
        const http = await import('http');
        const https = await import('https');
        const apiUrl = globalSettings.apiUrl;
        const protocol = apiUrl.startsWith('https') ? https : http;
        
        connection.console.log(`[fetchFromApi] Fetching from: ${apiUrl}`);
        
        return new Promise((resolve) => {
            const req = protocol.get(apiUrl, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    try {
                        connection.console.log('[fetchProjectInfo] Raw API response: ' + data);
                        const response = JSON.parse(data);
                        
                        // API returns {success: true, projectInfo: {...}}
                        const info = response.projectInfo || response;
                        
                        connection.console.log('[fetchProjectInfo] Parsed projectPath: ' + info.projectPath);
                        connection.console.log('[fetchProjectInfo] Parsed installPath: ' + info.installPath);
                        
                        // Extract subProjects paths from array of objects {name, path}
                        let subProjectPaths: string[] = [];
                        if (info.subProjects && Array.isArray(info.subProjects)) {
                            subProjectPaths = info.subProjects.map((sp: any) => sp.path || sp);
                        }
                        
                        // Fallback: If subProjects is empty but config file exists, parse it
                        if (subProjectPaths.length === 0 && info.configPath) {
                            connection.console.log('[fetchProjectInfo] SubProjects empty, parsing config file...');
                            subProjectPaths = parseSubProjectsFromConfig(info.configPath, info.projectPath);
                        }
                        
                        projectInfo = {
                            projectPath: info.projectPath || '',
                            projectName: info.projectName || '',
                            configPath: info.configPath || '',
                            logPath: info.logPath || '',
                            installPath: info.installPath || '',
                            version: info.version || '',
                            subProjects: subProjectPaths
                        };
                        connection.console.log('[fetchProjectInfo] Final projectInfo: ' + JSON.stringify(projectInfo));
                        resolve(projectInfo);
                    } catch (err) {
                        connection.console.log('[fetchProjectInfo] Parse error: ' + err);
                        resolve(null);
                    }
                });
            });
            req.on('error', (err) => {
                connection.console.log('[fetchProjectInfo] HTTP error: ' + err);
                resolve(null);
            });
            req.setTimeout(2000, () => {
                connection.console.log('[fetchProjectInfo] Request timeout');
                req.destroy();
                resolve(null);
            });
        });
    } catch (err) {
        connection.console.log('[fetchFromApi] Exception: ' + err);
        return null;
    }
}

async function fetchFromWorkspace(): Promise<ProjectInfo | null> {
    try {
        const workspaceFolders = await connection.workspace.getWorkspaceFolders();
        if (!workspaceFolders || workspaceFolders.length === 0) {
            connection.console.log('[fetchFromWorkspace] No workspace folders');
            return null;
        }

        for (const folder of workspaceFolders) {
            const folderPath = fileURLToPath(folder.uri);
            const configPath = path.join(folderPath, 'config', 'config');
            
            connection.console.log(`[fetchFromWorkspace] Checking: ${configPath}`);

            if (fs.existsSync(configPath)) {
                connection.console.log(`[fetchFromWorkspace] Found WinCC OA project at: ${folderPath}`);
                
                const subProjects = parseSubProjectsFromConfig(configPath, folderPath);
                const installPath = detectInstallPath(configPath);

                projectInfo = {
                    projectPath: folderPath,
                    projectName: path.basename(folderPath),
                    configPath: configPath,
                    logPath: path.join(folderPath, 'log'),
                    installPath: installPath,
                    version: '',
                    subProjects: subProjects
                };

                connection.console.log('[fetchFromWorkspace] Project info: ' + JSON.stringify(projectInfo));
                return projectInfo;
            }
        }

        connection.console.log('[fetchFromWorkspace] No WinCC OA project found in workspace');
        connection.window.showWarningMessage(
            'WinCC OA Language Server: No project detected. ' +
            'Please open a folder containing a WinCC OA project with config/config file, ' +
            'or configure project paths manually in settings.'
        );
        return null;
    } catch (err) {
        connection.console.log('[fetchFromWorkspace] Error: ' + err);
        return null;
    }
}

function fetchFromConfig(): ProjectInfo | null {
    const projectPath = globalSettings.projectPath;
    
    if (!projectPath) {
        connection.console.log('[fetchFromConfig] No project path configured');
        return null;
    }

    projectInfo = {
        projectPath: projectPath,
        projectName: path.basename(projectPath),
        configPath: path.join(projectPath, 'config', 'config'),
        logPath: path.join(projectPath, 'log'),
        installPath: globalSettings.installPath,
        version: '',
        subProjects: globalSettings.subProjects
    };

    connection.console.log('[fetchFromConfig] Project info: ' + JSON.stringify(projectInfo));
    return projectInfo;
}

function detectInstallPath(configPath: string): string {
    try {
        const configContent = fs.readFileSync(configPath, 'utf-8');
        const lines = configContent.split('\n');
        
        for (const line of lines) {
            const trimmed = line.trim();
            const match = trimmed.match(/^(?:pvss_path|winccoa_path|install_path)\s*=\s*["']([^"']+)["']/);
            if (match) {
                connection.console.log(`[detectInstallPath] Found: ${match[1]}`);
                return match[1];
            }
        }
    } catch (err) {
        connection.console.log(`[detectInstallPath] Error: ${err}`);
    }

    // Platform-specific defaults
    const defaultPaths = process.platform === 'win32'
        ? ['C:\\Siemens\\Automation\\WinCC_OA\\3.19', 'C:\\Siemens\\Automation\\WinCC_OA\\3.18']
        : ['/opt/WinCC_OA/3.19', '/opt/WinCC_OA/3.18'];

    for (const defaultPath of defaultPaths) {
        if (fs.existsSync(defaultPath)) {
            connection.console.log(`[detectInstallPath] Using default: ${defaultPath}`);
            return defaultPath;
        }
    }

    return '';
}

let hasConfigCapability = false;
let hasWorkspaceCapability = false;

connection.onInitialize((params: InitializeParams) => {
    const caps = params.capabilities;
    hasConfigCapability = !!(caps.workspace?.configuration);
    hasWorkspaceCapability = !!(caps.workspace?.workspaceFolders);

    const result: InitializeResult = {
        capabilities: {
            textDocumentSync: TextDocumentSyncKind.Incremental,
            completionProvider: { resolveProvider: true },
            hoverProvider: true,
            definitionProvider: true,
            referencesProvider: true,
            executeCommandProvider: {
                commands: ['getDocUrl']
            }
        }
    };
    
    if (hasWorkspaceCapability) {
        result.capabilities.workspace = { workspaceFolders: { supported: true } };
    }
    return result;
});

connection.onInitialized(async () => {
    if (hasConfigCapability) {
        connection.client.register(DidChangeConfigurationNotification.type, undefined);
        
        // Load initial configuration
        try {
            const settings = await connection.workspace.getConfiguration('winccoa.ctrlLang');
            globalSettings = {
                pathSource: settings.pathSource || 'workspace',
                apiUrl: settings.apiUrl || 'http://localhost:3000/api/getProjectInfo',
                projectPath: settings.projectPath || '',
                installPath: settings.installPath || '',
                subProjects: settings.subProjects || [],
                additionalScriptsPaths: settings.additionalScriptsPaths || []
            };
            connection.console.log(`[Init] Loaded settings - pathSource: ${globalSettings.pathSource}`);
        } catch (err) {
            connection.console.log('[Init] Error loading settings: ' + err);
        }
    }
    connection.console.log('WinCC OA Language Server initialized!');
});

const docSettings: Map<string, Thenable<any>> = new Map();

connection.onDidChangeConfiguration(async () => {
    if (hasConfigCapability) {
        docSettings.clear();
        
        // Update global settings
        try {
            const settings = await connection.workspace.getConfiguration('winccoa.ctrlLang');
            globalSettings = {
                pathSource: settings.pathSource || 'workspace',
                apiUrl: settings.apiUrl || 'http://localhost:3000/api/getProjectInfo',
                projectPath: settings.projectPath || '',
                installPath: settings.installPath || '',
                subProjects: settings.subProjects || [],
                additionalScriptsPaths: settings.additionalScriptsPaths || []
            };
            
            // Clear project info cache to force re-fetch
            projectInfo = null;
            connection.console.log(`[Config] Settings updated - pathSource: ${globalSettings.pathSource}`);
        } catch (err) {
            connection.console.log('[Config] Error updating settings: ' + err);
        }
    }
});

documents.onDidClose(e => docSettings.delete(e.document.uri));

connection.onCompletion((): CompletionItem[] => {
    return getAllBuiltinFunctions().map((fn, idx) => {
        const paramList = fn.parameters.map(p => {
            let s = p.byRef ? '&' : '';
            s += `${p.type} ${p.name}`;
            if (p.optional) s = `[${s}]`;
            if (p.variadic) s = `...${s}`;
            return s;
        }).join(', ');

        return {
            label: fn.name,
            kind: CompletionItemKind.Function,
            detail: `${fn.returnType} ${fn.name}(${paramList})`,
            documentation: fn.description || '',
            insertText: fn.name,
            data: idx
        };
    });
});

connection.onCompletionResolve((item: CompletionItem) => item);

connection.onHover((params: TextDocumentPositionParams): Hover | null => {
    const doc = documents.get(params.textDocument.uri);
    if (!doc) return null;

    const txt = doc.getText();
    const offset = doc.offsetAt(params.position);
    
    connection.console.log(`[Hover] Request at position line ${params.position.line}, char ${params.position.character}, offset ${offset}`);
    
    // Try user-defined symbols first (variables, classes, members) using Symbol Table
    try {
        const symbols = SymbolTable.parseFile(txt);
        const symbolInfo = getSymbolAtPosition(txt, offset);
        
        connection.console.log(`[Hover] Symbol at position: ${symbolInfo ? symbolInfo.name : 'null'}, memberAccess: ${symbolInfo?.memberAccess ? symbolInfo.memberAccess.objectName + '.' + symbolInfo.name : 'none'}`);
        
        if (!symbolInfo) return null;
        
        let resolved: BaseSymbol | null = null;
        
        // Check if this is member access (e.g., manager.createDevice, myStruct.id)
        if (symbolInfo.memberAccess) {
            const objectName = symbolInfo.memberAccess.objectName;
            
            // Resolve the object to get its type
            const objSymbol = SymbolTable.resolveSymbol(objectName, params.position, symbols);
            
            if (objSymbol && 'dataType' in objSymbol) {
                const typeName = objSymbol.dataType;
                
                // Check if it's a class
                const classSymbol = symbols.classes.find(c => c.name === typeName);
                
                if (classSymbol) {
                    // Find the method or member in the class
                    const method = classSymbol.methods.find(m => m.name === symbolInfo.name);
                    const member = classSymbol.members.find(m => m.name === symbolInfo.name);
                    
                    resolved = method || member || null;
                } else {
                    // Check if it's a struct
                    const structSymbol = symbols.structs.find(s => s.name === typeName);
                    
                    if (structSymbol) {
                        // Find the field in the struct
                        const field = structSymbol.fields.find(f => f.name === symbolInfo.name);
                        
                        if (field) {
                            resolved = field;
                        }
                    }
                }
            }
        } else {
            // Normal symbol resolution
            resolved = SymbolTable.resolveSymbol(symbolInfo.name, params.position, symbols);
            connection.console.log(`[Hover] Normal resolution for '${symbolInfo.name}': ${resolved ? resolved.kind + ' ' + resolved.name : 'null'}`);
        }
        
        if (resolved) {
            connection.console.log(`[Hover] Resolved symbol: ${resolved.kind} ${resolved.name}`);
            let hoverText = '';
            
            // Format based on symbol type
            if ('dataType' in resolved) {
                // Variables (local, global, member, struct fields) - show "type name"
                hoverText = `\`\`\`ctrl\n${resolved.dataType} ${resolved.name}\n\`\`\``;
            } else if (resolved.kind === SymbolKind.Class) {
                // Class definition
                hoverText = `\`\`\`ctrl\nclass ${resolved.name}\n\`\`\``;
            } else if (resolved.kind === SymbolKind.Struct) {
                // Struct definition
                hoverText = `\`\`\`ctrl\nstruct ${resolved.name}\n\`\`\``;
            } else if (resolved.kind === SymbolKind.Method && 'returnType' in resolved) {
                // Method - show signature with parameters
                const method = resolved as any;  // MethodSymbol
                const params = method.parameters || [];
                const paramList = params.map((p: any) => `${p.dataType} ${p.name}`).join(', ');
                hoverText = `\`\`\`ctrl\n${method.returnType} ${method.name}(${paramList})\n\`\`\``;
            } else if (resolved.kind === SymbolKind.Function && 'returnType' in resolved) {
                // Global function - show signature with parameters
                const func = resolved as any;  // FunctionSymbol
                const params = func.parameters || [];
                const paramList = params.map((p: any) => `${p.dataType} ${p.name}`).join(', ');
                hoverText = `\`\`\`ctrl\n${func.returnType} ${func.name}(${paramList})\n\`\`\``;
            }
            
            if (hoverText) {
                connection.console.log(`[Hover] Returning hover text: ${hoverText.substring(0, 50)}...`);
                return { contents: { kind: MarkupKind.Markdown, value: hoverText } };
            } else {
                connection.console.log(`[Hover] No hover text generated for symbol ${resolved.kind} ${resolved.name}`);
            }
        } else {
            connection.console.log(`[Hover] Symbol not resolved, falling back to builtins`);
        }
    } catch (error) {
        // Fall through to builtin functions if symbol table fails
        connection.console.error(`[Hover] Symbol Table error: ${error}`);
    }
    
    // Fallback: Check builtin functions using old word extraction
    const pos = doc.offsetAt(params.position);
    let start = pos, end = pos;
    while (start > 0 && /[a-zA-Z0-9_]/.test(txt[start - 1])) start--;
    while (end < txt.length && /[a-zA-Z0-9_]/.test(txt[end])) end++;
    
    const word = txt.substring(start, end);
    if (!word) return null;
    
    // Fallback: Check builtin functions
    const fn = getBuiltinFunction(word);
    if (!fn) return null;

    const paramList = fn.parameters.map(p => {
        let s = p.byRef ? '&' : '';
        s += `${p.type} ${p.name}`;
        if (p.optional) s = `[${s}]`;
        if (p.variadic) s = `...${s}`;
        return s;
    }).join(', ');
    
    const sig = `${fn.returnType} ${fn.name}(${paramList})`;
    let md = `**${fn.name}**\n\n\`\`\`ctrl\n${sig}\n\`\`\`\n\n`;
    
    if (fn.description) md += fn.description;
    if (fn.deprecated) md += '\n\n---\n\n⚠️ **Deprecated**';
    if (fn.docUrl) md += `\n\n---\n\n[📖 Documentation](${fn.docUrl})`;
    
    return { contents: { kind: MarkupKind.Markdown, value: md } };
});

connection.onExecuteCommand((params) => {
    if (params.command === 'getDocUrl' && params.arguments && params.arguments.length > 0) {
        const functionName = params.arguments[0] as string;
        const fn = getBuiltinFunction(functionName);
        return fn?.docUrl || null;
    }
    return null;
});

connection.onDefinition(async (params: TextDocumentPositionParams): Promise<Definition | null> => {
    connection.console.log('[Definition] Request received');
    
    const doc = documents.get(params.textDocument.uri);
    if (!doc) {
        connection.console.log('[Definition] Document not found');
        return null;
    }

    const offset = doc.offsetAt(params.position);
    const docText = doc.getText();
    connection.console.log(`[Definition] Cursor offset: ${offset}, position: line ${params.position.line}, char ${params.position.character}`);
    
    // 1. Check for #uses statement (highest priority)
    const usesInfo = getUsesAtPosition(docText, offset);
    if (usesInfo) {
        connection.console.log(`[Definition] Found #uses: "${usesInfo.path}"`);
        return await handleUsesDefinition(usesInfo.path);
    }
    
    // 2. Get symbol at cursor position
    const symbolInfo = getSymbolAtPosition(docText, offset);
    if (!symbolInfo) {
        connection.console.log('[Definition] No symbol found at cursor position');
        return null;
    }
    
    connection.console.log(`[Definition] Found symbol: "${symbolInfo.name}" at line ${symbolInfo.line}`);
    
    // Check if this is a member access (e.g., manager.createDevice)
    if (symbolInfo.memberAccess) {
        connection.console.log(`[Definition] Detected member access: ${symbolInfo.memberAccess.objectName}.${symbolInfo.name}`);
        
        // Try to find the method using Symbol Table
        try {
            const symbols = SymbolTable.parseFile(docText);
            
            // First, resolve the object to get its type
            const objSymbol = SymbolTable.resolveSymbol(
                symbolInfo.memberAccess.objectName,
                { line: params.position.line, character: params.position.character },
                symbols
            );
            
            if (objSymbol && 'dataType' in objSymbol) {
                const className = objSymbol.dataType;
                connection.console.log(`[Definition] Object "${symbolInfo.memberAccess.objectName}" has type: ${className}`);
                
                // Find the class definition
                const classSymbol = symbols.classes.find(c => c.name === className);
                if (classSymbol) {
                    // Find the method in this class
                    const method = classSymbol.methods.find(m => m.name === symbolInfo.name);
                    if (method) {
                        connection.console.log(`[Definition] Found method "${symbolInfo.name}" in class "${className}" at line ${method.location.line}`);
                        const currentFilePath = fileURLToPath(doc.uri);
                        const uri = pathToFileURL(currentFilePath).href;
                        
                        return Location.create(uri, {
                            start: { line: method.location.line - 1, character: method.location.column },
                            end: { line: method.location.line - 1, character: method.location.column + method.name.length }
                        });
                    }
                }
            }
            
            connection.console.log('[Definition] Could not resolve member access through Symbol Table');
        } catch (error) {
            connection.console.log(`[Definition] Member access resolution error: ${error}`);
        }
    }
    
    // 3. Try NEW Symbol Table approach first (for classes, structs, members)
    try {
        const symbols = SymbolTable.parseFile(docText);
        const resolved = SymbolTable.resolveSymbol(
            symbolInfo.name, 
            { line: params.position.line, character: params.position.character },
            symbols
        );
        
        if (resolved) {
            connection.console.log(`[Definition] Symbol Table resolved: ${resolved.name} (${resolved.kind}) at line ${resolved.location.line}`);
            const currentFilePath = fileURLToPath(doc.uri);
            const uri = pathToFileURL(currentFilePath).href;
            
            return Location.create(uri, {
                start: { line: resolved.location.line - 1, character: resolved.location.column },
                end: { line: resolved.location.line - 1, character: resolved.location.column + resolved.name.length }
            });
        }
        
        connection.console.log('[Definition] Symbol Table did not resolve symbol, falling back to legacy finder');
    } catch (error) {
        connection.console.log(`[Definition] Symbol Table error: ${error}, falling back to legacy finder`);
    }
    
    // 4. Check if it's a function call or just a reference (LEGACY)
    const isFuncCall = isFunctionCall(docText, offset);
    connection.console.log(`[Definition] Is function call: ${isFuncCall}`);
    
    // 5. Search in current file (LEGACY)
    const currentFilePath = fileURLToPath(doc.uri);
    connection.console.log(`[Definition] Searching in current file: ${currentFilePath}`);
    
    // Try to find function definition
    if (isFuncCall) {
        const functions = findFunctionDefinitions(currentFilePath);
        connection.console.log(`[Definition] Found ${functions.length} functions in current file`);
        
        const funcDef = functions.find(f => f.name === symbolInfo.name);
        if (funcDef) {
            connection.console.log(`[Definition] Found function definition at line ${funcDef.line}`);
            const uri = pathToFileURL(funcDef.filePath).href;
            // Note: funcDef.line is 1-based from legacy finder, needs -1
            return Location.create(uri, {
                start: { line: funcDef.line - 1, character: funcDef.column },
                end: { line: funcDef.line - 1, character: funcDef.column + funcDef.name.length }
            });
        }
    }
    
    // Try to find global variable
    const globals = findGlobalVariables(currentFilePath);
    connection.console.log(`[Definition] Found ${globals.length} global variables in current file`);
    
    const globalVar = globals.find(v => v.name === symbolInfo.name);
    if (globalVar) {
        connection.console.log(`[Definition] Found global variable at line ${globalVar.line}`);
        const uri = pathToFileURL(globalVar.filePath).href;
        return Location.create(uri, {
            start: { line: globalVar.line - 1, character: globalVar.column },
            end: { line: globalVar.line - 1, character: globalVar.column + globalVar.name.length }
        });
    }
    
    // 6. Search in #uses dependencies
    connection.console.log('[Definition] Symbol not found in current file, searching in dependencies...');
    const info = await fetchProjectInfo();
    if (info) {
        const dependencies = await findSymbolInDependencies(symbolInfo.name, currentFilePath, info, isFuncCall);
        if (dependencies) {
            return dependencies;
        }
    }
    
    connection.console.log(`[Definition] Symbol "${symbolInfo.name}" not found`);
    return null;
});

async function handleUsesDefinition(usesPath: string): Promise<Location | null> {
    const info = await fetchProjectInfo();
    if (!info) {
        connection.console.log('[Definition] Failed to fetch project info - no WinCC OA project detected');
        connection.window.showErrorMessage(
            `WinCC OA: Cannot resolve #uses "${usesPath}" - No project detected. ` +
            'Open a WinCC OA project folder or configure paths in settings.'
        );
        return null;
    }
    
    connection.console.log(`[Definition] Project info: projectPath="${info.projectPath}", installPath="${info.installPath}", subProjects=${info.subProjects.length}`);
    
    const resolvedPath = resolveUsesPath(usesPath, info);
    
    if (!resolvedPath) {
        connection.console.log(`[Definition] Could not resolve path for: "${usesPath}"`);
        return null;
    }

    connection.console.log(`[Definition] Resolved to: ${resolvedPath}`);

    const uri = pathToFileURL(resolvedPath).href;
    connection.console.log(`[Definition] URI: ${uri}`);
    
    return Location.create(uri, {
        start: { line: 0, character: 0 },
        end: { line: 0, character: 0 }
    });
}

async function findSymbolInDependencies(
    symbolName: string, 
    currentFilePath: string, 
    projectInfo: ProjectInfo,
    isFunctionCall: boolean
): Promise<Location | null> {
    // Get all #uses statements from current file
    const content = fs.readFileSync(currentFilePath, 'utf-8');
    const lines = content.split('\n');
    const usesPaths: string[] = [];
    
    for (const line of lines) {
        const match = line.match(/#uses\s+["']([^"']+)["']/);
        if (match) {
            usesPaths.push(match[1]);
        }
    }
    
    connection.console.log(`[Definition] Found ${usesPaths.length} #uses statements in current file`);
    
    // Search each dependency
    for (const usesPath of usesPaths) {
        const resolvedPath = resolveUsesPath(usesPath, projectInfo);
        if (!resolvedPath) {
            connection.console.log(`[Definition] Could not resolve dependency: ${usesPath}`);
            continue;
        }
        
        connection.console.log(`[Definition] Searching in dependency: ${resolvedPath}`);
        
        // NEW: Try Symbol Table approach for Classes/Structs
        try {
            const depContent = fs.readFileSync(resolvedPath, 'utf-8');
            const depSymbols = SymbolTable.parseFile(depContent);
            
            connection.console.log(`[Definition] Parsed dependency: ${depSymbols.classes.length} classes, ${depSymbols.structs.length} structs`);
            
            // Check for class
            const classSymbol = depSymbols.classes.find(c => c.name === symbolName);
            if (classSymbol) {
                connection.console.log(`[Definition] Found class "${symbolName}" in ${resolvedPath} at line ${classSymbol.location.line}`);
                const uri = pathToFileURL(resolvedPath).href;
                return Location.create(uri, {
                    start: { line: classSymbol.location.line, character: classSymbol.location.column },
                    end: { line: classSymbol.location.line, character: classSymbol.location.column + classSymbol.name.length }
                });
            }
            
            // Check for struct
            const structSymbol = depSymbols.structs.find(s => s.name === symbolName);
            if (structSymbol) {
                connection.console.log(`[Definition] Found struct "${symbolName}" in ${resolvedPath} at line ${structSymbol.location.line}`);
                const uri = pathToFileURL(resolvedPath).href;
                return Location.create(uri, {
                    start: { line: structSymbol.location.line, character: structSymbol.location.column },
                    end: { line: structSymbol.location.line, character: structSymbol.location.column + structSymbol.name.length }
                });
            }
            
            // Check for methods in all classes (for member access like factory.getDeviceTypeByDPName())
            for (const cls of depSymbols.classes) {
                const method = cls.methods.find(m => m.name === symbolName);
                if (method) {
                    connection.console.log(`[Definition] Found method "${symbolName}" in class ${cls.name} at line ${method.location.line}`);
                    const uri = pathToFileURL(resolvedPath).href;
                    return Location.create(uri, {
                        start: { line: method.location.line, character: method.location.column },
                        end: { line: method.location.line, character: method.location.column + method.name.length }
                    });
                }
            }
            
            connection.console.log(`[Definition] Symbol "${symbolName}" not found as class/struct/method in ${resolvedPath}`);
        } catch (error) {
            connection.console.log(`[Definition] Symbol Table error for ${resolvedPath}: ${error}`);
        }
        
        // Search for function (LEGACY)
        if (isFunctionCall) {
            const functions = findFunctionDefinitions(resolvedPath);
            const funcDef = functions.find(f => f.name === symbolName);
            if (funcDef) {
                connection.console.log(`[Definition] Found function "${symbolName}" in ${resolvedPath} at line ${funcDef.line}`);
                const uri = pathToFileURL(funcDef.filePath).href;
                return Location.create(uri, {
                    start: { line: funcDef.line - 1, character: funcDef.column },
                    end: { line: funcDef.line - 1, character: funcDef.column + funcDef.name.length }
                });
            }
        }
        
        // Search for global variable
        const globals = findGlobalVariables(resolvedPath);
        const globalVar = globals.find(v => v.name === symbolName);
        if (globalVar) {
            connection.console.log(`[Definition] Found global variable "${symbolName}" in ${resolvedPath} at line ${globalVar.line}`);
            const uri = pathToFileURL(globalVar.filePath).href;
            return Location.create(uri, {
                start: { line: globalVar.line - 1, character: globalVar.column },
                end: { line: globalVar.line - 1, character: globalVar.column + globalVar.name.length }
            });
        }
    }
    
    return null;
}

// ============================================================================
// Find References Handler
// ============================================================================

connection.onReferences((params: ReferenceParams): Location[] => {
    connection.console.log('[References] Request received');
    
    const doc = documents.get(params.textDocument.uri);
    if (!doc) {
        connection.console.log('[References] Document not found');
        return [];
    }
    
    const offset = doc.offsetAt(params.position);
    const docText = doc.getText();
    
    // Get symbol at cursor position
    const symbolInfo = getSymbolAtPosition(docText, offset);
    if (!symbolInfo) {
        connection.console.log('[References] No symbol found at cursor position');
        return [];
    }
    
    connection.console.log(`[References] Finding references for: "${symbolInfo.name}"`);
    
    try {
        // Parse file and find all references
        const symbols = SymbolTable.parseFile(docText);
        const references = SymbolTable.findReferences(symbolInfo.name, docText, symbols);
        
        connection.console.log(`[References] Found ${references.length} references`);
        
        // Convert to LSP Location[]
        const currentFilePath = fileURLToPath(doc.uri);
        const uri = pathToFileURL(currentFilePath).href;
        
        const locations: Location[] = references.map(ref => {
            return Location.create(uri, {
                start: { line: ref.location.line, character: ref.location.column },
                end: { line: ref.location.line, character: ref.location.column + ref.name.length }
            });
        });
        
        // Filter based on params.context.includeDeclaration
        if (!params.context.includeDeclaration) {
            connection.console.log('[References] Filtering out declarations');
            return locations.filter((_, idx) => !references[idx].isDefinition);
        }
        
        return locations;
        
    } catch (error) {
        connection.console.log(`[References] Error: ${error}`);
        return [];
    }
});

documents.listen(connection);
connection.listen();