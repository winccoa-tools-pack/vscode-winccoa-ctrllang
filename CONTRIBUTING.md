# Contributing

Thank you for contributing to the WinCC OA CTRL Test Framework extension!

## Getting Started

1. Fork the repository
2. Create a feature branch from `develop`: `git checkout -b feature/<issue-id>/<description>`
3. Install dependencies: `npm install`
4. Build: `npm run compile`
5. Run tests: `npm test`
6. Format code: `npm run format`

## Development Workflow

### GitFlow Branching

This project uses GitFlow. The branching model is fully automated via GitHub Actions.

- **`develop`** — Default branch for day-to-day work
- **`main`** — Stable releases only
- **`feature/*`** — New features (branch from `develop`)
- **`bugfix/*`** — Bug fixes (branch from `develop`)
- **`release/vX.Y.Z`** — Release preparation (targets `main`)
- **`hotfix/vX.Y.Z`** — Production hotfixes (targets `main`)

**Branch naming convention:**

```text
feature/<gh-issue-id>/<what-will-be-done>
bugfix/<gh-issue-id>/<short-description>
```

Examples:

- `feature/32/config-editor`
- `bugfix/45/fix-result-parsing`

### Before Submitting a PR

1. **Format code:** `npm run format`
2. **Build:** `npm run compile`
3. **Run tests:** `npm test`
4. **Lint:** `npm run lint`

### Pull Request Guidelines

Use the PR template at `.github/PULL_REQUEST_TEMPLATE/feature-bugfix.md`.

**Required sections:**

- Description of changes
- Link related issues with keywords:
  - `Fixes #123` — Closes the issue when merged
  - `Closes #123` — Closes the issue when merged
  - `Related to #123` — References without closing
- Testing checklist

## Code Style

- Use TypeScript for all source files
- Follow existing patterns and conventions
- Keep exports stable and document public APIs
- Use meaningful variable and function names

## Testing Requirements

**All new features must have automated tests:**

- **Unit tests** — Focus on code coverage and isolated logic
- **Integration tests** — Test functionality with WinCC OA and OS interactions

Run tests:

```bash
npm run test:unit          # Unit tests only
npm run test:integration   # Integration tests
npm run test:coverage      # With coverage report
```

## Documentation

- Document new features, APIs, and commands
- Update README.md when adding commands or settings
- Propose screenshots for UX documentation when applicable

---

## AI Coding Assistants

When working with AI coding assistants (GitHub Copilot, Claude, Cursor, etc.), see the dedicated instructions:

- **Full instructions:** [.github/copilot-instructions.md](.github/copilot-instructions.md)
- **Quick reference:** [AGENT.md](AGENT.md)

---

## Questions?

Open an issue or reach out to the maintainers. Thanks for contributing!
