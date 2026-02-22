## Project Overview

Boopbox is a sound-catalog application. See `docs/ARCHITECTURE.md` for full architecture, dependency graph, and design decisions.

## Commands

```bash
# Development (all apps via turbo)
pnpm dev

# Build all packages/apps
pnpm build

# Lint and format (oxlint + oxfmt, run from repo root)
pnpm lint            # lint
pnpm lint:fix        # lint with autofix
pnpm lint:types      # lint with type-aware rules
pnpm fmt             # format
pnpm fmt:check       # check formatting without writing

# Run a single app
pnpm --filter <app> dev
pnpm --filter <app> build
```

## Key Conventions

- **ESM throughout** — All imports use `.js` extensions. Module resolution is `NodeNext`.
- **Strict TypeScript** — `strict: true`, `noUncheckedIndexedAccess: true`.

See packages' AGENTS.md, if present, for package-specific instructions.

<!-- effect-solutions:start -->

## Effect Best Practices

**IMPORTANT:** Always consult effect-solutions before writing Effect code.

1. Run `effect-solutions list` to see available guides
2. Run `effect-solutions show <topic>...` for relevant patterns (supports multiple topics)
3. Search `.reference/effect/` for real implementations (run `effect-solutions setup` first)

Topics: quick-start, project-setup, tsconfig, basics, services-and-layers, data-modeling, error-handling, config, testing, cli.

Never guess at Effect patterns - check the guide first.

<!-- effect-solutions:end -->

## Plan Mode

- Make the plan extremely concise. Sacrifice grammar for the sake of concision.
- At the end of each plan, give me a list of unresolved questions to answer, if any.
