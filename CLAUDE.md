# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Turborepo monorepo using pnpm workspaces.

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

## Architecture

- `apps/api` — Fastify 5 server (ESM, TypeScript).
- `packages/typescript-config` — Shared `tsconfig` bases.

### Key conventions

- **ESM throughout** — All imports use `.js` extensions. Module resolution is `NodeNext`.
- **Strict TypeScript** — `strict: true`, `noUncheckedIndexedAccess: true`.
- **Fastify autoload pattern** — Plugins from `src/plugins/` load first, then routes from `src/routes/`. Routes are auto-prefixed by directory name.
- **Fastify plugins use `fastify-plugin` (`fp`)** to share decorators/hooks with routes.

See packages' AGENTS.md, if present, for package-specific instructions.
