#!/usr/bin/env node
/**
 * Build script that generates server/src/builtins.ts
 * from tools/oaDocParser/winccoa_builtins.json
 */

import * as fs from 'fs';
import * as path from 'path';

interface Parameter {
    name: string;
    type: string;
    optional: boolean;
    variadic?: boolean;
    byRef?: boolean;
}

interface FunctionDef {
    name: string;
    returnType: string;
    parameters: Parameter[];
    description: string;
    deprecated: boolean;
    docUrl?: string;
}

interface FunctionData {
    functions: FunctionDef[];
}

const ROOT_DIR = path.join(__dirname, '..', '..');
const DATA_FILE = path.join(ROOT_DIR, 'resources', 'winccoa-functions-cleaned.json');
const BUILTINS_OUTPUT = path.join(ROOT_DIR, 'language-server', 'src', 'builtins.ts');

function loadFunctionData(): FunctionData {
    console.log('📖 Loading function definitions from resources/winccoa-functions-cleaned.json...');
    const content = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(content);
}

function escapeString(str: string): string {
    return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');
}

function generateBuiltinsTS(data: FunctionData): void {
    console.log(`🔨 Generating language-server/src/builtins.ts with ${data.functions.length} functions...`);
    
    const lines: string[] = [];
    
    // Header
    lines.push('// Auto-generated from resources/winccoa-functions-cleaned.json');
    lines.push(`// DO NOT EDIT MANUALLY - run 'npm run build:functions' instead`);
    lines.push(`// Generated: ${new Date().toISOString()}`);
    lines.push(`// Total Functions: ${data.functions.length}`);
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
    data.functions.forEach((fn, index) => {
        const params = fn.parameters.map(p => {
            const parts: string[] = [`{ name: '${p.name}', type: '${p.type}'`];
            if (p.optional) {
                parts.push(`, optional: true`);
            }
            if (p.variadic) {
                parts.push(`, variadic: true`);
            }
            if (p.byRef) {
                parts.push(`, byRef: true`);
            }
            return parts.join('') + ' }';
        }).join(', ');
        
        lines.push(`    ['${fn.name}', {`);
        lines.push(`        name: '${fn.name}',`);
        lines.push(`        returnType: '${fn.returnType}',`);
        lines.push(`        parameters: [${params}],`);
        lines.push(`        description: '${escapeString(fn.description)}'${fn.deprecated || fn.docUrl ? ',' : ''}`);
        
        if (fn.deprecated) {
            lines.push(`        deprecated: true${fn.docUrl ? ',' : ''}`);
        }
        
        if (fn.docUrl) {
            lines.push(`        docUrl: '${fn.docUrl}'`);
        }
        
        const isLast = index === data.functions.length - 1;
        lines.push(`    }]${isLast ? '' : ','}`);
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
    console.log(`✅ Generated ${BUILTINS_OUTPUT}`);
}

function main() {
    console.log('🚀 Building function definitions...\n');
    
    try {
        const data = loadFunctionData();
        console.log(`   Found ${data.functions.length} functions\n`);
        
        generateBuiltinsTS(data);
        
        console.log('\n✨ Build completed successfully!');
    } catch (error) {
        console.error('❌ Build failed:', error);
        process.exit(1);
    }
}

main();
