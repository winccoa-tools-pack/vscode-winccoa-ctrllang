/**
 * ctrlXmlMerger.ts — Merges ctrl.xml runtime data with bundled web-scraped builtins.
 *
 * Merge strategy:
 * - ctrl.xml provides: exact signatures, parameter types, directions, defaults, flags
 * - Bundled builtins provide: descriptions, docUrls (from web scraping)
 * - For functions in BOTH sources: use ctrl.xml signature + bundled description/docUrl
 * - For functions only in ctrl.xml: create entry without description (enriched later)
 * - For functions only in bundled: keep as-is (may be version-specific or UI-only)
 *
 * @see docs/ctrl-lang-integration.md Phase 2
 */

import { FunctionSignature, FunctionParameter, ConstantInfo, BUILTIN_FUNCTIONS } from './builtins';
import { CtrlXmlData, CtrlXmlFunction, CtrlXmlParameter } from './ctrlXmlParser';
import { CONSTANTS } from './types';

/**
 * Merge ctrl.xml data with bundled builtins into a unified function map.
 *
 * @param xmlData - Parsed and merged ctrl.xml data (from CtrlXmlLoader)
 * @returns Merged map of all known functions
 */
export function mergeXmlWithBuiltins(xmlData: CtrlXmlData): Map<string, FunctionSignature> {
    const merged = new Map<string, FunctionSignature>();

    // Pass 1: Convert all XML functions to FunctionSignature, enrich from bundled
    for (const [name, xmlFn] of xmlData.functions) {
        const bundled = BUILTIN_FUNCTIONS.get(name);
        merged.set(name, convertXmlFunction(xmlFn, bundled));
    }

    // Pass 2: Keep bundled-only functions (not in ctrl.xml)
    for (const [name, bundledFn] of BUILTIN_FUNCTIONS) {
        if (!merged.has(name)) {
            merged.set(name, bundledFn);
        }
    }

    return merged;
}

/**
 * Convert a CtrlXmlFunction to FunctionSignature, optionally enriching
 * with description/docUrl from the bundled entry.
 */
function convertXmlFunction(
    xmlFn: CtrlXmlFunction,
    bundled?: FunctionSignature
): FunctionSignature {
    const sig: FunctionSignature = {
        name: xmlFn.name,
        returnType: xmlFn.returnType || 'void',
        parameters: xmlFn.parameters.map(convertXmlParameter),

        // Enrich from bundled data (descriptions + docUrls from web scrape)
        description: bundled?.description,
        docUrl: bundled?.docUrl,

        // Flags from ctrl.xml
        deprecated: xmlFn.deprecated || undefined,
        deprecationReason: xmlFn.deprecationReason,
        isConst: xmlFn.isConst || undefined,
        useRetval: xmlFn.useRetval || undefined,
        noReturn: xmlFn.noReturn || undefined,
        sourceFile: xmlFn.sourceFile,
    };

    // Aliases (only set if non-empty)
    if (xmlFn.aliases.length > 0) {
        sig.aliases = xmlFn.aliases;
    }

    return sig;
}

/**
 * Convert a CtrlXmlParameter to the FunctionParameter format used by builtins.
 */
function convertXmlParameter(xmlParam: CtrlXmlParameter): FunctionParameter {
    const param: FunctionParameter = {
        name: xmlParam.name || `arg${xmlParam.nr}`,
        type: xmlParam.type || 'anytype',
    };

    if (xmlParam.optional) {
        param.optional = true;
    }
    if (xmlParam.variadic) {
        param.variadic = true;
    }
    if (xmlParam.direction === 'out') {
        param.direction = 'out';
        param.byRef = true; // backward compat: 'out' means by-reference
    }
    if (xmlParam.optional && xmlParam.nr !== 'variadic') {
        // If the XML specifies a default value implicitly (via 'default' attr),
        // we mark it. The actual default value text is not stored in CtrlXmlParameter
        // but the optional flag covers this case.
        param.defaultValue = undefined; // placeholder for future enrichment
    }

    return param;
}

/**
 * Merge XML constants with the hardcoded CONSTANTS set from types.ts.
 * XML constants have richer info (value, type); hardcoded ones get a basic entry.
 */
export function mergeXmlConstants(xmlData: CtrlXmlData): Map<string, ConstantInfo> {
    const merged = new Map<string, ConstantInfo>();

    // Pass 1: XML constants (with value + type from ctrl.xml)
    for (const [name, xmlConst] of xmlData.constants) {
        merged.set(name, {
            name: xmlConst.name,
            value: xmlConst.value,
            type: xmlConst.type,
            sourceFile: xmlConst.sourceFile,
        });
    }

    // Pass 2: Hardcoded constants not in XML get a basic entry
    for (const name of CONSTANTS) {
        if (!merged.has(name)) {
            merged.set(name, {
                name,
                type: 'int', // default assumption
            });
        }
    }

    return merged;
}

/**
 * Get merge statistics for logging.
 */
export function getMergeStats(
    xmlData: CtrlXmlData,
    merged: Map<string, FunctionSignature>
): {
    xmlOnly: number;
    bundledOnly: number;
    enriched: number;
    total: number;
    constants: number;
} {
    let xmlOnly = 0;
    let enriched = 0;

    for (const name of xmlData.functions.keys()) {
        if (BUILTIN_FUNCTIONS.has(name)) {
            enriched++;
        } else {
            xmlOnly++;
        }
    }

    let bundledOnly = 0;
    for (const name of BUILTIN_FUNCTIONS.keys()) {
        if (!xmlData.functions.has(name)) {
            bundledOnly++;
        }
    }

    return {
        xmlOnly,
        bundledOnly,
        enriched,
        total: merged.size,
        constants: xmlData.constants.size,
    };
}
