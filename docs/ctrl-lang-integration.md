# CTRL Language Metadata Integration Plan

## Overview

WinCC OA ships an official metadata file for the CTRL language in **cppcheck XML config format**:

```text
<OA_INSTALL_DIR>/data/DevTools/Base/ctrl.xml
```

This file is the **authoritative source** for all built-in functions, constants, and type information.
It replaces our current web-scraped data (`winccoa-functions-cleaned.json`) and hand-maintained constants (`CONSTANTS` set in `types.ts`).

### Current State vs. ctrl.xml

| Aspect | Current (scraped) | ctrl.xml (official) |
|--------|-------------------|---------------------|
| **Functions** | 983 (from web docs) | 1137 (from WinCC OA) |
| **Constants/Defines** | ~80 (hand-picked in `types.ts`) | 610 (complete) |
| **Parameter types** | Partial (scraped HTML) | Exact (`type` attribute) |
| **Parameter direction** | Heuristic (`byRef` guessing) | Exact (`direction="out"`) |
| **Variadic params** | Missing for many | Explicit (`nr="variadic"`) |
| **Default values** | Not available | Present (`default="true"`) |
| **Deprecation/Warnings** | Manual `deprecated` flag | `<warn severity="style" reason="Obsolescent">` |
| **Const functions** | Not tracked | `<const />` element |
| **Return value usage** | Not tracked | `<use-retval />` (linting hint) |
| **Grouped aliases** | Not supported | `name="dpSet,dpSetWait"` |
| **Version-specific** | Single version | Per-installation (version-accurate) |

### Impact

This is a **game changer** because:

1. **154 missing functions** will become available (1137 vs. 983)
2. **610 constants** replace 80 hand-maintained ones — full coverage
3. **Parameter metadata is exact** — no more guessing `byRef` from docs
4. **Version-accurate** — the file matches the installed WinCC OA version
5. **Future**: A CTL-to-cppcheck-AST converter enables static analysis on user code

---

## ctrl.xml Schema Reference

### Root Structure

```xml
<?xml version="1.0"?>
<def format="2">
  <!-- Constants -->
  <define name="FALSE" value="false"/>
  <define name="M_PI" value="3.1415926535898" type="float"/>
  <define name="PROJ" value="someProject" type="string"/>

  <!-- Functions -->
  <function name="dpGet">...</function>
  <function name="dpSet,dpSetWait">...</function>   <!-- comma = aliases -->
</def>
```

### `<define>` Element (Constants)

| Attribute | Description | Example |
|-----------|-------------|---------|
| `name` | Constant name | `"DPEL_INT"` |
| `value` | Literal value | `"21"` |
| `type` | Optional type hint | `"string"`, `"float"` (absent = int) |

### `<function>` Element

```xml
<function name="dpCopy">
  <arg nr="1" />
  <arg nr="2" />
  <arg nr="3" direction="out" />
  <arg nr="4" default="1" />
</function>
```

**Attributes:**

| Attribute | Description |
|-----------|-------------|
| `name` | Function name(s), comma-separated for aliases |

**Child Elements:**

| Element | Description |
|---------|-------------|
| `<returnValue type="int" />` | Return type |
| `<arg nr="1" type="string" name="path" direction="out" default="true" />` | Parameter |
| `<const />` | Function is a pure/const function (no side effects) |
| `<use-retval />` | Return value should be used (lint hint) |
| `<noreturn>true</noreturn>` | Function does not return (e.g., `exit`) |
| `<warn severity="style" reason="Obsolescent" />` | Deprecated/obsolescent function |
| `<leak-ignore />` | Leak checking hint |

**`<arg>` attributes:**

| Attribute | Values | Description |
|-----------|--------|-------------|
| `nr` | `"1"`, `"2"`, ..., `"variadic"` | Argument position or variadic |
| `type` | `"string"`, `"int"`, `"anytype"`, ... | Argument type (optional, absent = anytype) |
| `name` | `"path"`, `"t1"`, ... | Argument name (optional) |
| `direction` | `"out"` | Output/by-reference parameter |
| `default` | `"true"`, `"1"`, `""` | Has default value (optional param) |

**`<arg>` child elements:**

| Element | Description |
|---------|-------------|
| `<not-uninit />` | Value must be initialized before passing |

---

## OA Version Resolution

### Why Version Matters

Each WinCC OA version ships its own `ctrl.xml` with version-specific functions and constants. The extension must determine **which WinCC OA version** the user is working with to load the correct metadata.

### Resolution Strategy

Uses the `@winccoa-tools-pack/npm-winccoa-core` (v0.2.6+) APIs:

```typescript
import {
    getProjectByProjectPath,
    getAvailableWinCCOAVersions,
    getWinCCOAInstallationPathByVersion,
} from '@winccoa-tools-pack/npm-winccoa-core';

let usedOaVersion: string | null = null;

async function getUsedOaVersion(scriptPath: string): Promise<string | null> {
    if (usedOaVersion) {
        return usedOaVersion;
    }

    // 1. Try to detect from the WinCC OA project the file belongs to
    const project = await getProjectByProjectPath(scriptPath);
    const oaVersion = project?.getVersion();

    if (oaVersion) {
        usedOaVersion = oaVersion;
        return usedOaVersion;
    }

    // 2. No project found → show version picker (QuickPick)
    const versions = getAvailableWinCCOAVersions();
    // → present as VS Code QuickPick, let user select
    usedOaVersion = await showVersionPicker(versions);
    return usedOaVersion;
}

// Then resolve the install directory:
function resolveInstallDir(version: string): string | null {
    const oaInstallDir = getWinCCOAInstallationPathByVersion(version);
    if (!oaInstallDir) {
        vscode.window.showWarningMessage(
            `WinCC OA ${version} installation not found.`
        );
        return null;
    }
    return oaInstallDir;
}
```

### Cache Invalidation

- `usedOaVersion` is cached for the session
- **Must be cleared** when OA version changes (user switches version via status bar or command)
- On version change: clear `usedOaVersion`, re-parse ctrl.xml, rebuild function/constant maps

### OA Version Selector (Status Bar)

Selected OA version is visible in the **bottom status bar**, next to the existing project selector:

```text
┌──────────────────────────────────────────────────────┐
│ ... │ MyProject │ WinCC OA 3.20 │ ...               │
└──────────────────────────────────────────────────────┘
```

- **No version selected** → shown in **red** (alert state)
- **Version selected** → normal display (e.g. `WinCC OA 3.20`)
- **Click** on status bar item → opens version picker (same as command)
- **Command**: `winccoa.selectOaVersion` — callable from command palette and by clicking status bar

### Future: Extract to Shared Extension

The version selector logic must eventually move into `RichardJanisch.winccoa-project-admin` (declared as `extensionDependencies`) so it can be **shared between all WinCC OA extensions**. For now, implement in this extension; extract before publishing the changes.

```jsonc
// package.json (future)
"extensionDependencies": [
    "RichardJanisch.winccoa-project-admin"
]
```

---

## Integration Strategy

### Core Principle: Runtime-First

A build-time generator **cannot work** because ctrl.xml differs per WinCC OA version and patch level. We cannot build the extension against every possible WinCC OA installation. Therefore, ctrl.xml must be parsed **at runtime** from the user's installed WinCC OA.

The bundled `builtins.ts` (from web-scraped data) serves only as a **fallback** when ctrl.xml is unavailable.

### Phase 0: Runtime Parser & Multi-XML Loading (First Step)

Create a `ctrlXmlParser.ts` module that parses XML definition files at language server startup and builds in-memory function/constant maps.

#### XML Sources (Priority Order)

The extension loads definitions from **multiple XML sources**, merged in priority order:

| Priority | Source | Description |
|----------|--------|-------------|
| 1 | `<OA_INSTALL>/data/DevTools/Base/ctrl.xml` | Official WinCC OA definitions |
| 2 | User-configured additional XML files | Add-on / library definitions |
| 3 | Imported XML files (via command) | User-provided definitions |
| 4 | Bundled `builtins.ts` | Fallback (web-scraped data) |

#### User-Configurable Additional XML Paths

Users can configure additional XML definition files:

```jsonc
// VS Code settings (per-user)
"winccoa.ctrlLang.additionalDefinitions": [
    "C:/path/to/addon-functions.xml",            // absolute path
    "./definitions/my-library.xml"                // relative to workspace
]
```

Additionally, a **workspace config file** allows team-wide sharing (every user working with the repo gets the same definitions):

```text
.winccoa/definitions.json   (or similar — naming convention TBD)
```

> **Naming convention**: Must avoid conflicts with other WinCC OA extensions. Brainstorm the exact file location later, but use a shared `.winccoa/` directory convention.

#### Import XML via Command

A VS Code command allows importing XML definitions without WinCC OA installed:

```text
Command: winccoa.importDefinitionXml
  → Opens file picker / paste dialog
  → User selects or pastes XML from trusted location
  → File is stored in workspace .winccoa/ directory
  → Definitions are loaded immediately
```

This also allows testing newly generated XML files before publishing.

#### Source Tracking & Duplicate Detection

Each loaded definition carries its **source file** information:

```typescript
export interface CtrlXmlFunction {
    name: string;
    aliases: string[];
    returnType: string;
    parameters: Array<{...}>;
    // ... (same as before)
    sourceFile: string;          // NEW: which XML file defined this
    sourceIndex: number;         // NEW: priority index (lower = higher priority)
}
```

**Duplicate detection:**

- When a function/constant is defined in **multiple XML files**, warn the user:
  - Same file: `"Duplicate definition 'dpGet' in ctrl.xml (lines 42, 187)"`
  - Different files: `"'dpGet' defined in both ctrl.xml and addon.xml — using ctrl.xml (higher priority)"`
- Show as VS Code diagnostics or output channel warnings
- Higher-priority source wins; lower-priority duplicate is ignored but reported

**On reload**: When an XML file is reloaded (e.g., version change), only definitions from **that specific source** are replaced. Definitions from other sources remain untouched.

#### Detection & Loading Sequence

```text
1. Language server starts
2. Resolve OA version (see "OA Version Resolution" above)
3. Resolve OA install path via getWinCCOAInstallationPathByVersion()
4. Check if <installPath>/data/DevTools/Base/ctrl.xml exists
5. Load additional XML files from settings + workspace config
6. Parse all found XML files → CtrlXmlData (functions + constants)
7. Check for duplicate definitions across all sources → warn user
8. Merge with bundled builtins (descriptions/docUrls)
9. If NO XML found at all → fall back to bundled builtins.ts
```

#### Parser Interface

```typescript
// ctrlXmlParser.ts
export interface CtrlXmlFunction {
    name: string;
    aliases: string[];           // from comma-separated names
    returnType: string;
    parameters: Array<{
        name: string;
        type: string;
        optional?: boolean;      // from 'default' attribute
        variadic?: boolean;      // from nr="variadic"
        direction?: 'in' | 'out'; // from direction attribute
        defaultValue?: string;   // from default attribute
    }>;
    deprecated?: boolean;        // from <warn>
    deprecationReason?: string;  // from warn reason
    isConst?: boolean;           // from <const>
    useRetval?: boolean;         // from <use-retval>
    noReturn?: boolean;          // from <noreturn>
    sourceFile: string;          // origin XML file path
}

export interface CtrlXmlConstant {
    name: string;
    value: string;
    type: 'int' | 'float' | 'string' | 'bool';
    sourceFile: string;          // origin XML file path
}

export interface CtrlXmlData {
    functions: Map<string, CtrlXmlFunction>;
    constants: Map<string, CtrlXmlConstant>;
    duplicates: DuplicateWarning[];   // collected during merge
    sourceFiles: string[];            // all loaded XML file paths
}

export interface DuplicateWarning {
    symbolName: string;
    type: 'function' | 'constant';
    files: string[];             // which files define it
    resolvedFrom: string;        // which file "won"
}

export function parseCtrlXml(xmlContent: string, sourceFile: string): CtrlXmlData;
export function mergeCtrlXmlSources(sources: CtrlXmlData[]): CtrlXmlData;
```

#### No File Watcher Needed

ctrl.xml can only change when WinCC OA is **reinstalled or updated**. No file watcher is required.

> **Documented limitation**: After reinstalling/updating WinCC OA, the user must **reload the VS Code window** (`Developer: Reload Window`) for the extension to pick up the new ctrl.xml.

#### Caching

- Parse once on startup, cache in `SymbolCache`
- Invalidate when OA version changes (status bar selector / command)
- No mtime watching — documented limitation (reload required)
- ~191 KB parsing takes <100ms, perfectly fine

### Phase 1: Enriched FunctionSignature

Extend the existing `FunctionSignature` interface to carry the richer metadata from ctrl.xml. The language server merges ctrl.xml data into the same `FunctionSignature` objects used everywhere:

```typescript
// builtins.ts (enriched interface, backward-compatible)
export interface FunctionSignature {
    name: string;
    aliases?: string[];          // NEW: from comma-separated names
    returnType: string;
    parameters: Array<{
        name: string;
        type: string;
        optional?: boolean;      // from 'default' attribute
        variadic?: boolean;      // from nr="variadic"
        direction?: 'in' | 'out'; // NEW: from direction attribute
        defaultValue?: string;   // NEW: from default attribute
    }>;
    description?: string;        // from web docs (merged)
    deprecated?: boolean;        // from <warn>
    deprecationReason?: string;  // NEW: from warn reason
    isConst?: boolean;           // NEW: from <const>
    useRetval?: boolean;         // NEW: from <use-retval>
    noReturn?: boolean;          // NEW: from <noreturn>
    docUrl?: string;
    sourceFile?: string;         // NEW: origin XML file (for diagnostics)
}
```

All new fields are **optional** — existing bundled builtins continue to work without them.

### Phase 2: Merge with Web Documentation

The ctrl.xml has **exact signatures** but **no descriptions or doc URLs**. The web-scraped data has **descriptions and URLs** but less accurate signatures.

**Merge strategy:**

```text
Primary:   ctrl.xml       → function names, parameters, types, direction, defaults
Secondary: scraped JSON   → description, docUrl
Result:    merged builtins with best of both worlds
```

**Implementation (runtime merge in language server):**

1. Parse ctrl.xml sources → `CtrlXmlData` (functions + constants)
2. Load bundled `BUILTIN_FUNCTIONS` from `builtins.ts` (has descriptions/docUrls)
3. For each function in ctrl.xml, enrich with `description`/`docUrl` from bundled data
4. Functions only in ctrl.xml get `description: undefined` (can be added later)
5. Functions only in bundled data (not in ctrl.xml) are kept as-is (may be version-specific)
6. Result: `Map<string, FunctionSignature>` used by all services

### Phase 3: Static Analysis Tool (External NPM Package)

Phase 3 is implemented as a **standalone npm tool** — not embedded in the VS Code extension. This enables use in **CI/CD pipelines** (GitHub Actions, Jenkins) and by **AI/LLM tools**.

#### Architecture

```text
┌─────────────────────┐     ┌──────────────────────┐
│  VS Code Extension  │     │  GitHub Actions / CI  │
│  (displays results) │     │  (runs analysis)      │
└────────┬────────────┘     └────────┬─────────────┘
         │                           │
         └───────────┬───────────────┘
                     ▼
         ┌───────────────────────┐
         │  @winccoa-tools-pack/ │
         │  ctrl-static-analysis │
         │  (npm package / CLI)  │
         └───────────────────────┘
```

#### CLI Tool

```bash
# Run from CI or locally
npx @winccoa-tools-pack/ctrl-static-analysis \
    --ctrl-xml ./ctrl.xml \
    --format sarif \
    src/scripts/**/*.ctl
```

#### Output Formats

| Format | Use Case |
|--------|----------|
| **SARIF** | GitHub Code Scanning, SonarQube import, VS Code SARIF Viewer |
| **ESLint JSON** | Familiar format, easy to process |
| **CTRL-specific JSON** | Extended with CTRL-specific severity/categories |

#### Checks (from enriched metadata)

- Parameter count/type validation
- Deprecation warnings (`<warn>` elements)
- Return value usage (`<use-retval>`)
- `out` parameter misuse (passing literal to `direction="out"` param)
- Constant type mismatches

#### LLM / AI Integration

The tool is declared in `package.json` for AI/LLM tooling:

```jsonc
// package.json
"llm": {
    "tools": [{
        "name": "ctrl-static-analysis",
        "description": "Run CTRL/CTRL++ static analysis on WinCC OA scripts"
    }]
}
```

#### VS Code Integration

The VS Code extension does **not** run analysis itself — it invokes the npm tool and displays results:

1. Run `ctrl-static-analysis` CLI as child process
2. Parse SARIF/JSON output
3. Map to VS Code diagnostics (problems panel)
4. Show inline squiggles, quick fixes where applicable

### Phase 4: CTL-to-Cppcheck AST (External Tool, Future)

Similar to Phase 3 — implemented as an **external tool**, not embedded in the extension.

Cppcheck can generate `library.xml` files (or similar). The same format can be produced from CTRL code, enabling cppcheck-based analysis on CTRL scripts.

> **Note**: This may work only with limited WinCC OA versions / CTRL language features. Kept as future possibility — skip for now.

### Phase 5: XML Generation from CTL Scripts (Future)

Generate cppcheck-format XML definition files **from existing `.ctl` files**. This is invaluable for:

- **Encrypted WinCC OA libraries** — users can publish XML definitions without source code
- **Third-party add-ons** — create definition files for add-on APIs
- **Community sharing** — publish definitions for popular WinCC OA libraries

#### Approach

The extension already parses CTL scripts (symbolFinder, symbolTable). Use that data to generate XML:

```text
Command: winccoa.generateDefinitionXml
  → Analyzes selected .ctl file(s)
  → Extracts functions, classes, constants
  → Generates cppcheck-format XML
  → User saves to workspace .winccoa/ directory
```

#### Doxygen-Style Annotations

To capture metadata not visible from code alone (`isConst`, `useRetval`, etc.), support doxygen-style annotations in **function block headers**:

```ctl
/** @isConst
 *  @useRetval
 *  @param path [out] The resolved path
 *  @deprecated Use newFunction() instead
 */
int myFunction(string &path)
{
    // ...
}
```

> **Constraint**: In CTL, `@` annotations can only appear in function block headers (doc comments before the function declaration).

The exact annotation format should follow an established convention. Candidates:

- **JSDoc style** (`@param`, `@returns`, `@deprecated`) — widely known
- **Doxygen style** (`@param`, `@return`, `@const`) — C/C++ ecosystem
- **Custom CTRL annotations** — only if needed for CTRL-specific concepts

Prefer an established format where possible; add CTRL-specific extensions only for concepts like `@useRetval`, `@isConst` that don't exist in standard formats.

---

## File Structure After Integration

```text
language-server/src/
├── builtins.ts              # Existing: bundled fallback (enriched interface)
├── ctrlXmlParser.ts         # NEW: runtime parser for ctrl.xml → CtrlXmlData
├── ctrlXmlMerger.ts         # NEW: merges multiple XML sources + bundled builtins
├── ctrlXmlLoader.ts         # NEW: discovery, loading, source tracking
└── ...

src/
├── services/
│   ├── oaVersionService.ts  # NEW: version resolution, status bar, caching
│   └── ...
└── ...

tools/scripts/
├── build-functions.ts       # Existing (generates bundled fallback builtins.ts)
└── ...

resources/
├── winccoa-functions-cleaned.json  # Kept: descriptions & docUrls for fallback
└── ...
```

> **Note:** No build-time generation from ctrl.xml — all parsing happens at runtime.
> The bundled `builtins.ts` remains the fallback for installations without ctrl.xml.

---

## New Commands & UI

| Command | Title | Trigger |
|---------|-------|---------|
| `winccoa.selectOaVersion` | Select WinCC OA Version | Command palette, status bar click |
| `winccoa.importDefinitionXml` | Import CTRL Definition XML | Command palette |
| `winccoa.generateDefinitionXml` | Generate Definition XML from CTL | Command palette (Phase 5) |

**Status Bar Item:**

| Item | Position | Click Action |
|------|----------|--------------|
| WinCC OA version | Next to project selector | Opens `winccoa.selectOaVersion` |

---

## Implementation Order

| Step | Phase | Effort | Description | State
|------|-------|--------|-------------|------
| 1 | — | M | OA version resolution + status bar + `selectOaVersion` command | Done |
| 2 | 0 | M | Create `ctrlXmlParser.ts` — runtime XML parser → `CtrlXmlData` |  |
| 3 | 0 | S | Multi-XML loading: detect ctrl.xml + user-configured files |  |
| 4 | 0 | S | Source tracking + duplicate detection + warnings |  |
| 5 | 0 | S | `importDefinitionXml` command |  |
| 6 | 1 | S | Extend `FunctionSignature` interface with new optional fields |  |
| 7 | 2 | M | Create `ctrlXmlMerger.ts` — merge XML sources + bundled builtins at runtime |  |
| 8 | 2 | S | Wire merger into language server startup (SymbolCache integration) |  |
| 9 | 3 | L | External npm tool: `ctrl-static-analysis` with SARIF output |  |
| 10 | 3 | M | VS Code integration: invoke tool, display diagnostics |  |
| 11 | 4 | L | CTL-to-cppcheck AST external tool (future) |  |
| 12 | 5 | M | `generateDefinitionXml` command + doxygen annotations |  |

**Effort**: S = Small (1-2h), M = Medium (3-5h), L = Large (1-2 days)

---

## Backward Compatibility

- **Older WinCC OA versions**: ctrl.xml may not exist → fall back to bundled `builtins.ts`
- **ctrl.xml is optional**: The DevTools package is user-selectable during WinCC OA installation — it may not be installed even on newer versions
- **No WinCC OA installed** (pure editor use): Use bundled builtins; user can import XML via command
- **Different WinCC OA versions**: Each version's ctrl.xml may differ → resolved by OA version selector
- **Existing `build:functions` script**: Kept unchanged — generates the bundled fallback `builtins.ts`

## Limitations (Documented)

1. **After WinCC OA reinstall/update**: User must reload the VS Code window for the extension to pick up the new ctrl.xml (no file watcher)
2. **ctrl.xml availability**: The DevTools package is optional during WinCC OA installation — not guaranteed to exist
3. **cppcheck AST (Phase 4)**: Limited WinCC OA version/feature compatibility — future work

## Resolved Questions

1. **Since which WinCC OA version does `ctrl.xml` exist?** → Don't determine a version — just check if the file exists. It's an optional install package. Document as limitation.

2. **Are there additional XML files for add-on components?** → Currently only `Base/ctrl.xml`. Support **user-configurable additional XML paths** (absolute + workspace-relative) and a workspace config file for team-wide sharing. Naming convention TBD (use `.winccoa/` directory, avoid conflicts with other WinCC OA extensions). Future: generate XML from `.ctl` files (for encrypted libraries, third-party add-ons).

3. **CTL-to-cppcheck AST converter** → Cppcheck can generate `library.xml` format. We can produce the same from CTRL code. Limited version compatibility — skip for now, keep as Phase 4.

4. **Should we bundle a `ctrl.xml` snapshot?** → No. Instead, provide a VS Code command (`winccoa.importDefinitionXml`) to let the user import XML from a trusted location (copy & paste). This avoids licensing concerns and allows testing new definitions before publishing.
