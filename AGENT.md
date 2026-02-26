# AI Coding Assistant Instructions

> See [.github/copilot-instructions.md](.github/copilot-instructions.md) for full instructions.

## Quick Reference

### Before Any Changes

```bash
npm run format      # Format code
npm run lint        # Lint check
npm run lint:md     # Lint check for markdown
npm run compile     # Build
npm test            # Test
```

### Branch Naming

```text
feature/<issue-id>/<description>
bugfix/<issue-id>/<description>
```

### Key Rules

1. **Complete features before starting new ones**
2. **All new features need tests**
3. **Update docs with changes**
4. **Link PRs to issues** (`Fixes #123`, `Closes #123`)
5. **Branch from `develop`** for new work

### Project Structure

- `src/extension.ts` - Main entry point
