# Language Server Architecture (v0.5.0)

## Overview

The WinCC OA CTL Language Server was refactored from a monolithic design to a service-based architecture in v0.5.0.

### Motivation

**Before (v0.4.x):**
- `server.ts` was a "God Object" with 1160+ lines
- Hover, Definition, Completion - all inline
- No centralized symbol caching
- `#uses` parsing duplicated 4 times
- Hard to test and extend

**After (v0.5.0):**
- `server.ts` reduced to 496 lines (57% less)
- Clear separation of concerns
- Centralized SymbolCache with mtime invalidation
- Dependency Injection pattern
- Easy to test and extend

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         server.ts                                │
│                    (LSP Connection Glue)                         │
│                        ~500 LOC                                  │
│                                                                  │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌────────────┐ │
│  │ onHover()   │ │onDefinition │ │onCompletion │ │onReferences│ │
│  └──────┬──────┘ └──────┬──────┘ └──────┬──────┘ └─────┬──────┘ │
└─────────┼───────────────┼───────────────┼──────────────┼────────┘
          │               │               │              │
          ▼               ▼               ▼              │
┌─────────────────────────────────────────────────────┐  │
│                     services/                        │  │
│  ┌──────────────┐ ┌──────────────┐ ┌─────────────┐  │  │
│  │ HoverService │ │ Definition   │ │ Completion  │  │  │
│  │   ~220 LOC   │ │   Service    │ │   Service   │  │  │
│  │              │ │   ~315 LOC   │ │   ~55 LOC   │  │  │
│  └──────┬───────┘ └──────┬───────┘ └─────────────┘  │  │
│         │                │                           │  │
│         └────────┬───────┘                           │  │
│                  ▼                                   │  │
│         ┌─────────────────┐                          │  │
│         │  ConfigService  │ (prepared)               │  │
│         │    ~270 LOC     │                          │  │
│         └─────────────────┘                          │  │
└──────────────────┬──────────────────────────────────-┘  │
                   │                                      │
                   ▼                                      │
┌─────────────────────────────────────────────────────────┼──────┐
│                       core/                              │      │
│  ┌────────────────────────────────────────────────────┐  │      │
│  │                   SymbolCache                      │◄─┘      │
│  │                    ~170 LOC                        │         │
│  │                                                    │         │
│  │  • getSymbols(filePath) - cached with mtime check │         │
│  │  • getSymbolsWithDependencies() - incl. #uses     │         │
│  │  • setProjectInfo() - for dependency resolution   │         │
│  │  • invalidate() / invalidateAll()                 │         │
│  └────────────────────────────────────────────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Existing Modules                            │
│  ┌────────────┐ ┌──────────────┐ ┌───────────┐ ┌─────────────┐  │
│  │symbolTable │ │ symbolFinder │ │ builtins  │ │usesResolver │  │
│  │   .ts      │ │     .ts      │ │   .ts     │ │    .ts      │  │
│  └────────────┘ └──────────────┘ └───────────┘ └─────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
language-server/src/
├── server.ts                 # LSP Connection, Handler routing
├── core/
│   └── symbolCache.ts        # Centralized symbol caching
├── services/
│   ├── index.ts              # Central exports
│   ├── completionService.ts  # Completion logic
│   ├── hoverService.ts       # Hover logic
│   ├── definitionService.ts  # Go-to-Definition logic
│   └── configService.ts      # Project configuration (prepared)
├── symbolTable.ts            # Symbol parsing (classes, structs, etc.)
├── symbolFinder.ts           # Token-based symbol search
├── usesResolver.ts           # #uses directive resolution
├── builtins.ts               # WinCC OA built-in functions
└── tokenizer.ts              # CTL tokenizer
```

## Service Pattern

### Dependency Injection

Services receive their dependencies via constructor:

```typescript
// Example: HoverService
export class HoverService {
    private cache: SymbolCache;
    
    constructor(cache: SymbolCache) {
        this.cache = cache;
    }
    
    async handle(doc: TextDocument, position: Position): Promise<Hover | null> {
        // Uses this.cache for symbol resolution
    }
}
```

### Callback Injection for Async Dependencies

For services that need `projectInfo` (which is loaded asynchronously):

```typescript
// Example: DefinitionService
export class DefinitionService {
    private cache: SymbolCache;
    private getProjectInfo: () => Promise<ProjectInfo | null>;
    
    constructor(
        cache: SymbolCache, 
        getProjectInfo: () => Promise<ProjectInfo | null>
    ) {
        this.cache = cache;
        this.getProjectInfo = getProjectInfo;
    }
}
```

### Initialization in server.ts

```typescript
// Instantiate services
const symbolCache = new SymbolCache();
const completionService = new CompletionService();
const hoverService = new HoverService(symbolCache);

// DefinitionService after fetchProjectInfo definition
definitionService = new DefinitionService(symbolCache, fetchProjectInfo);

// Handlers delegate to services
connection.onHover(async (params) => {
    const doc = documents.get(params.textDocument.uri);
    if (!doc) return null;
    await fetchProjectInfo();  // Ensure project info loaded
    return hoverService.handle(doc, params.position);
});
```

## SymbolCache

### Core Concept

The SymbolCache is the heart of the new architecture:

1. **mtime-based invalidation**: Checks file modification time before returning cached data
2. **Dependency resolution**: Resolves `#uses` directives and caches all dependencies
3. **Unsaved document support**: Can work with content from unsaved documents

### API

```typescript
class SymbolCache {
    // Project info for #uses resolution
    setProjectInfo(info: ProjectInfo | null): void;
    
    // Single file (cached)
    getSymbols(filePath: string): FileSymbols | null;
    
    // Unsaved content
    getSymbolsFromContent(content: string, uri?: string): FileSymbols;
    
    // With all dependencies
    getSymbolsWithDependencies(filePath: string, content?: string): FileSymbols[];
    
    // Invalidation
    invalidate(filePath: string): void;
    invalidateAll(): void;
}
```

## Migration Guide

### Adding a New Service

1. **Create service class** in `services/`:
```typescript
export class MyService {
    private cache: SymbolCache;
    
    constructor(cache: SymbolCache) {
        this.cache = cache;
    }
    
    async handle(...): Promise<Result> {
        // Logic here
    }
}
```

2. **Export in `services/index.ts`**:
```typescript
export { MyService } from './myService';
```

3. **Import and instantiate in `server.ts`**:
```typescript
import { MyService } from './services/myService';
const myService = new MyService(symbolCache);
```

4. **Delegate handler**:
```typescript
connection.onMyRequest((params) => myService.handle(params));
```

## Performance Benefits

| Aspect | Before | After |
|--------|--------|-------|
| Symbol parsing | On every request | Once, then cached |
| #uses resolution | Duplicated 4x | Once in cache |
| File mtime check | Never | Automatic |
| Code duplication | ~400 LOC | 0 |

## Testability

Services can be tested in isolation:

```typescript
describe('HoverService', () => {
    let cache: SymbolCache;
    let service: HoverService;
    
    beforeEach(() => {
        cache = new SymbolCache();
        service = new HoverService(cache);
    });
    
    it('handles member access hover', async () => {
        // Test without LSP connection needed
    });
});
```

## Future Extensions

- **Fully integrate ConfigService**: Replace remaining config logic in server.ts
- **ReferencesService**: Extract Find References handler
- **Extend CompletionService**: User-defined symbols + context-aware completion
- **DiagnosticsService**: Syntax errors and warnings
