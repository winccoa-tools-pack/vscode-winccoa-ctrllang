/**
 * ctrlXmlParser.ts — Runtime parser for WinCC OA ctrl.xml (cppcheck XML config format v2)
 *
 * Parses `<OA_INSTALL>/data/DevTools/Base/ctrl.xml` and user-provided definition
 * XML files into in-memory function/constant maps.
 *
 * @see docs/ctrl-lang-integration.md for full schema reference
 */

import { XMLParser } from 'fast-xml-parser';

// ---------------------------------------------------------------------------
// Public Interfaces
// ---------------------------------------------------------------------------

export interface CtrlXmlParameter {
    /** Parameter position (1-based) or 'variadic' */
    nr: string;
    /** Parameter name (optional in XML) */
    name: string;
    /** Parameter type (absent = anytype) */
    type: string;
    /** Has a default value → optional parameter */
    optional: boolean;
    /** Is a variadic parameter (nr="variadic") */
    variadic: boolean;
    /** Parameter direction: 'in' (default) or 'out' (by-reference) */
    direction: 'in' | 'out';
    /** Must be initialized before passing (<not-uninit/>) */
    notUninit: boolean;
}

export interface CtrlXmlFunction {
    /** Primary function name */
    name: string;
    /** Alias names (from comma-separated name attribute) */
    aliases: string[];
    /** Return type (empty string if not specified) */
    returnType: string;
    /** Parameters in order */
    parameters: CtrlXmlParameter[];
    /** Function is deprecated (<warn> element) */
    deprecated: boolean;
    /** Deprecation reason from warn element */
    deprecationReason?: string;
    /** Deprecation severity from warn element */
    deprecationSeverity?: string;
    /** Pure/const function (<const/>) */
    isConst: boolean;
    /** Return value should be checked (<use-retval/>) */
    useRetval: boolean;
    /** Function does not return (<noreturn>true</noreturn>) */
    noReturn: boolean;
    /** Leak checking hint (<leak-ignore/>) */
    leakIgnore: boolean;
    /** Source XML file path */
    sourceFile: string;
}

export interface CtrlXmlConstant {
    /** Constant name */
    name: string;
    /** Literal value */
    value: string;
    /** Type hint: 'int' (default), 'float', 'string', 'bool' */
    type: 'int' | 'float' | 'string' | 'bool';
    /** Source XML file path */
    sourceFile: string;
}

export interface DuplicateWarning {
    /** The duplicate symbol name */
    symbolName: string;
    /** Whether it's a function or constant */
    type: 'function' | 'constant';
    /** Which files define this symbol */
    files: string[];
    /** Which file's definition is used (highest priority) */
    resolvedFrom: string;
}

export interface CtrlXmlData {
    /** Parsed functions keyed by name (includes aliases as separate entries) */
    functions: Map<string, CtrlXmlFunction>;
    /** Parsed constants keyed by name */
    constants: Map<string, CtrlXmlConstant>;
    /** Duplicate warnings collected during merge */
    duplicates: DuplicateWarning[];
    /** All loaded source file paths */
    sourceFiles: string[];
}

// ---------------------------------------------------------------------------
// Parser Implementation
// ---------------------------------------------------------------------------

/**
 * Configure the fast-xml-parser for cppcheck XML format.
 * - Attributes are parsed (prefixed with `@_`)
 * - Self-closing tags like `<const/>` produce empty objects
 * - Text content is available as `#text`
 */
function createXmlParser(): XMLParser {
    return new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '@_',
        allowBooleanAttributes: true,
        parseAttributeValue: false, // keep as strings for predictable handling
        isArray: (tagName: string) => {
            // These elements can appear multiple times and must always be arrays
            return tagName === 'function' || tagName === 'define' || tagName === 'arg';
        },
    });
}

/**
 * Parse a single XML definition file into CtrlXmlData.
 *
 * @param xmlContent - Raw XML string content
 * @param sourceFile - Path of the source file (for diagnostics and tracking)
 * @returns Parsed data with functions, constants, and source info
 * @throws Error if XML is malformed or has unexpected structure
 */
export function parseCtrlXml(
    xmlContent: string,
    sourceFile: string
): CtrlXmlData {
    const parser = createXmlParser();
    const parsed = parser.parse(xmlContent);

    const functions = new Map<string, CtrlXmlFunction>();
    const constants = new Map<string, CtrlXmlConstant>();

    // Navigate to the root <def> element
    const def = parsed?.def;
    if (!def) {
        throw new Error(
            `Invalid ctrl.xml: missing <def> root element in ${sourceFile}`
        );
    }

    // Parse <define> elements → constants
    const defines: RawDefine[] = def.define ?? [];
    for (const rawDefine of defines) {
        const constant = parseDefine(rawDefine, sourceFile);
        if (constant) {
            constants.set(constant.name, constant);
        }
    }

    // Parse <function> elements → functions
    const rawFunctions: RawFunction[] = def.function ?? [];
    for (const rawFunc of rawFunctions) {
        const fnList = parseFunction(rawFunc, sourceFile);
        for (const fn of fnList) {
            functions.set(fn.name, fn);
            // Also register each alias as a separate entry pointing to same data
            for (const alias of fn.aliases) {
                if (alias !== fn.name) {
                    functions.set(alias, fn);
                }
            }
        }
    }

    return {
        functions,
        constants,
        duplicates: [],
        sourceFiles: [sourceFile],
    };
}

/**
 * Merge multiple CtrlXmlData sources into one.
 * Earlier entries in the array have higher priority.
 * Duplicates are tracked and reported.
 *
 * @param sources - Array of CtrlXmlData, ordered by priority (index 0 = highest)
 * @returns Merged data with all functions, constants, and duplicate warnings
 */
export function mergeCtrlXmlSources(sources: CtrlXmlData[]): CtrlXmlData {
    const merged: CtrlXmlData = {
        functions: new Map(),
        constants: new Map(),
        duplicates: [],
        sourceFiles: [],
    };

    for (let i = 0; i < sources.length; i++) {
        const source = sources[i];
        merged.sourceFiles.push(...source.sourceFiles);

        // Merge functions
        for (const [name, fn] of source.functions) {
            const existing = merged.functions.get(name);
            if (existing) {
                // Duplicate: existing wins (higher priority)
                addDuplicateWarning(
                    merged.duplicates,
                    name,
                    'function',
                    existing.sourceFile,
                    fn.sourceFile
                );
            } else {
                merged.functions.set(name, fn);
            }
        }

        // Merge constants
        for (const [name, constant] of source.constants) {
            const existing = merged.constants.get(name);
            if (existing) {
                addDuplicateWarning(
                    merged.duplicates,
                    name,
                    'constant',
                    existing.sourceFile,
                    constant.sourceFile
                );
            } else {
                merged.constants.set(name, constant);
            }
        }
    }

    return merged;
}

// ---------------------------------------------------------------------------
// Internal Raw XML Types (fast-xml-parser output shapes)
// ---------------------------------------------------------------------------

/** Raw <define> element as parsed by fast-xml-parser */
interface RawDefine {
    '@_name'?: string;
    '@_value'?: string;
    '@_type'?: string;
}

/** Raw <function> element as parsed by fast-xml-parser */
interface RawFunction {
    '@_name'?: string;
    arg?: RawArg | RawArg[];
    returnValue?: RawReturnValue | RawReturnValue[];
    const?: unknown;
    'use-retval'?: unknown;
    noreturn?: string | boolean;
    warn?: RawWarn | RawWarn[];
    'leak-ignore'?: unknown;
}

/** Raw <arg> element */
interface RawArg {
    '@_nr'?: string;
    '@_type'?: string;
    '@_name'?: string;
    '@_direction'?: string;
    '@_default'?: string;
    'not-uninit'?: unknown;
}

/** Raw <returnValue> element */
interface RawReturnValue {
    '@_type'?: string;
}

/** Raw <warn> element */
interface RawWarn {
    '@_severity'?: string;
    '@_reason'?: string;
}

// ---------------------------------------------------------------------------
// Internal Helpers
// ---------------------------------------------------------------------------

/**
 * Parse a <define> element into a CtrlXmlConstant.
 */
function parseDefine(
    raw: RawDefine,
    sourceFile: string
): CtrlXmlConstant | null {
    const name = raw['@_name'];
    if (!name) return null;

    const value = raw['@_value'] ?? '';
    const rawType = raw['@_type']?.toLowerCase() ?? '';

    let type: CtrlXmlConstant['type'];
    switch (rawType) {
        case 'float':
            type = 'float';
            break;
        case 'string':
            type = 'string';
            break;
        case 'bool':
            type = 'bool';
            break;
        default:
            type = 'int';
            break;
    }

    return { name, value, type, sourceFile };
}

/**
 * Parse a <function> element into one or more CtrlXmlFunction objects.
 * Comma-separated names in the `name` attribute produce multiple functions
 * sharing the same definition (aliases).
 */
function parseFunction(
    raw: RawFunction,
    sourceFile: string
): CtrlXmlFunction[] {
    const nameAttr = raw['@_name'];
    if (!nameAttr) return [];

    // Split comma-separated names (e.g., "dpSet,dpSetWait")
    const names = nameAttr
        .split(',')
        .map((n) => n.trim())
        .filter((n) => n.length > 0);
    if (names.length === 0) return [];

    const primaryName = names[0];
    const aliases = names;

    // Parse return type
    const returnValue = Array.isArray(raw.returnValue)
        ? raw.returnValue[0]
        : raw.returnValue;
    const returnType = returnValue?.['@_type'] ?? '';

    // Parse arguments
    const rawArgs: RawArg[] = normalizeToArray(raw.arg);
    const parameters = rawArgs.map(parseArg);

    // Sort parameters by nr (positional first, variadic last)
    parameters.sort((a, b) => {
        if (a.variadic && !b.variadic) return 1;
        if (!a.variadic && b.variadic) return -1;
        const aNr = parseInt(a.nr, 10);
        const bNr = parseInt(b.nr, 10);
        if (isNaN(aNr) && isNaN(bNr)) return 0;
        if (isNaN(aNr)) return 1;
        if (isNaN(bNr)) return -1;
        return aNr - bNr;
    });

    // Parse flags
    const isConst = raw.const !== undefined;
    const useRetval = raw['use-retval'] !== undefined;
    const leakIgnore = raw['leak-ignore'] !== undefined;
    const noReturn = parseNoReturn(raw.noreturn);

    // Parse deprecation warning
    const warnArr = normalizeToArray(raw.warn);
    const warn = warnArr.length > 0 ? warnArr[0] : undefined;
    const deprecated = warn !== undefined;
    const deprecationReason = warn?.['@_reason'];
    const deprecationSeverity = warn?.['@_severity'];

    // Build the function object (shared between primary + aliases)
    const fn: CtrlXmlFunction = {
        name: primaryName,
        aliases,
        returnType,
        parameters,
        deprecated,
        deprecationReason,
        deprecationSeverity,
        isConst,
        useRetval,
        noReturn,
        leakIgnore,
        sourceFile,
    };

    // Return one function object; aliases are handled by the caller
    return [fn];
}

/**
 * Parse a single <arg> element.
 */
function parseArg(raw: RawArg): CtrlXmlParameter {
    const nr = raw['@_nr'] ?? '';
    const variadic = nr === 'variadic';

    return {
        nr,
        name: raw['@_name'] ?? '',
        type: raw['@_type'] ?? 'anytype',
        optional: raw['@_default'] !== undefined,
        variadic,
        direction: raw['@_direction'] === 'out' ? 'out' : 'in',
        notUninit: raw['not-uninit'] !== undefined,
    };
}

/**
 * Parse <noreturn> element content.
 * Can be `<noreturn>true</noreturn>` or `<noreturn>false</noreturn>`.
 */
function parseNoReturn(value: unknown): boolean {
    if (value === undefined || value === null) return false;
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    return false;
}

/**
 * Normalize a value that may be a single item or array into an array.
 * fast-xml-parser sometimes returns single items when only one element exists,
 * but our isArray config should handle function/define/arg. This is a safety net.
 */
function normalizeToArray<T>(value: T | T[] | undefined | null): T[] {
    if (value === undefined || value === null) return [];
    if (Array.isArray(value)) return value;
    return [value];
}

/**
 * Track a duplicate definition.
 */
function addDuplicateWarning(
    duplicates: DuplicateWarning[],
    symbolName: string,
    type: 'function' | 'constant',
    existingFile: string,
    newFile: string
): void {
    // Check if we already have a warning for this symbol
    const existing = duplicates.find(
        (d) => d.symbolName === symbolName && d.type === type
    );
    if (existing) {
        if (!existing.files.includes(newFile)) {
            existing.files.push(newFile);
        }
    } else {
        duplicates.push({
            symbolName,
            type,
            files: [existingFile, newFile],
            resolvedFrom: existingFile,
        });
    }
}
