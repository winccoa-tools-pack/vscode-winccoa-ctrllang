#!/usr/bin/env node
"use strict";
/**
 * Build script that generates server/src/builtins.ts
 * from tools/oaDocParser/winccoa_builtins.json
 */
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var ROOT_DIR = path.join(__dirname, '..', '..');
var DATA_FILE = path.join(ROOT_DIR, 'resources', 'winccoa-functions-cleaned.json');
var BUILTINS_OUTPUT = path.join(ROOT_DIR, 'language-server', 'src', 'builtins.ts');
function loadFunctionData() {
    console.log('📖 Loading function definitions from resources/winccoa-functions-cleaned.json...');
    var content = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(content);
}
function escapeString(str) {
    return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');
}
function generateBuiltinsTS(data) {
    console.log("\uD83D\uDD28 Generating language-server/src/builtins.ts with ".concat(data.functions.length, " functions..."));
    var lines = [];
    // Header
    lines.push('// Auto-generated from resources/winccoa-functions-cleaned.json');
    lines.push("// DO NOT EDIT MANUALLY - run 'npm run build:functions' instead");
    lines.push("// Generated: ".concat(new Date().toISOString()));
    lines.push("// Total Functions: ".concat(data.functions.length));
    lines.push('');
    lines.push('// WinCC OA Built-in Functions');
    lines.push('export interface FunctionSignature {');
    lines.push('    name: string;');
    lines.push('    returnType: string;');
    lines.push('    parameters: Array<{');
    lines.push('        name: string;');
    lines.push('        type: string;');
    lines.push('        optional?: boolean;');
    lines.push('        variadic?: boolean;');
    lines.push('        byRef?: boolean;');
    lines.push('    }>;');
    lines.push('    description?: string;');
    lines.push('    deprecated?: boolean;');
    lines.push('    docUrl?: string;');
    lines.push('}');
    lines.push('');
    lines.push('export const BUILTIN_FUNCTIONS: Map<string, FunctionSignature> = new Map([');
    // Generate function entries
    data.functions.forEach(function (fn, index) {
        var params = fn.parameters.map(function (p) {
            var parts = ["{ name: '".concat(p.name, "', type: '").concat(p.type, "'")];
            if (p.optional) {
                parts.push(", optional: true");
            }
            if (p.variadic) {
                parts.push(", variadic: true");
            }
            if (p.byRef) {
                parts.push(", byRef: true");
            }
            return parts.join('') + ' }';
        }).join(', ');
        lines.push("    ['".concat(fn.name, "', {"));
        lines.push("        name: '".concat(fn.name, "',"));
        lines.push("        returnType: '".concat(fn.returnType, "',"));
        lines.push("        parameters: [".concat(params, "],"));
        lines.push("        description: '".concat(escapeString(fn.description), "'").concat(fn.deprecated || fn.docUrl ? ',' : ''));
        if (fn.deprecated) {
            lines.push("        deprecated: true".concat(fn.docUrl ? ',' : ''));
        }
        if (fn.docUrl) {
            lines.push("        docUrl: '".concat(fn.docUrl, "'"));
        }
        var isLast = index === data.functions.length - 1;
        lines.push("    }]".concat(isLast ? '' : ','));
    });
    lines.push(']);');
    lines.push('');
    lines.push('export function isBuiltinFunction(name: string): boolean {');
    lines.push('    return BUILTIN_FUNCTIONS.has(name);');
    lines.push('}');
    lines.push('');
    lines.push('export function getBuiltinFunction(name: string): FunctionSignature | undefined {');
    lines.push('    return BUILTIN_FUNCTIONS.get(name);');
    lines.push('}');
    lines.push('');
    lines.push('export function getAllBuiltinFunctions(): FunctionSignature[] {');
    lines.push('    return Array.from(BUILTIN_FUNCTIONS.values());');
    lines.push('}');
    lines.push('');
    fs.writeFileSync(BUILTINS_OUTPUT, lines.join('\n'), 'utf-8');
    console.log("\u2705 Generated ".concat(BUILTINS_OUTPUT));
}
function main() {
    console.log('🚀 Building function definitions...\n');
    try {
        var data = loadFunctionData();
        console.log("   Found ".concat(data.functions.length, " functions\n"));
        generateBuiltinsTS(data);
        console.log('\n✨ Build completed successfully!');
    }
    catch (error) {
        console.error('❌ Build failed:', error);
        process.exit(1);
    }
}
main();
