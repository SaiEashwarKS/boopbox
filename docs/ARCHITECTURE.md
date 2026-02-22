# Architecture

This document describes the high-level architecture of Boopbox.
It is intended as an onboarding guide for both human contributors and AI agents.
If you find it outdated, update it — keeping this file accurate is more valuable than keeping it stable.

## What Is Boopbox?

Boopbox is a sound-catalog application: users browse, search, and play short audio clips across multiple platforms (web, mobile, macOS Raycast extension). A central server hosts the catalog and audio files; clients consume it.

## Project Structure — Codemap

The repo is a **Turborepo + pnpm workspaces** monorepo. Everything is **ESM** and **strict TypeScript** (module resolution: `NodeNext`, `.js` import extensions everywhere).

```
boopbox/
├── apps/
│   └── server/            Effect HTTP server (in progress)
├── packages/
│   ├── domain/            Shared types, schemas, pure search/filter logic
│   └── typescript-config/ Shared tsconfig bases (base.json)
├── data/
│   ├── catalog.json       Sound catalog — checked into repo, read-only at runtime
│   └── sounds/            MP3 files — checked into repo
├── docs/                  Architecture docs and design notes
├── turbo.json             Turborepo task config
├── package.json           Root — scripts, devDeps, lint-staged
└── CLAUDE.md              AI-agent instructions for this repo
```

### `apps/server` — The Server

Entry point: `src/server.ts`. Effect-based server using `@effect/platform-node`. Storage layer (`src/Storage.ts`) provides read-only `CatalogStorage` and `SoundFileStorage` services backed by `@effect/platform` `FileSystem`. Reads `data/` from repo root at startup.

### `packages/domain`

Shared domain types and pure logic. Exports: `Sound` (Schema.Class), `SoundFilename` (branded string), `Catalog` (array schema), `search`, `findByFilename`. Depends only on `effect`.

### `packages/typescript-config`

Shared `tsconfig` base files extended by every app and package.

## Planned Packages and Apps (Not Yet Created)

The following are planned but do not exist on disk yet.

| Package / App  | Purpose                              | Key deps                           |
| -------------- | ------------------------------------ | ---------------------------------- |
| `packages/api` | API contract definitions (`HttpApi`) | `@repo/domain`, `@effect/platform` |
| `apps/web`     | Browser UI (Vite + React)            | `@repo/domain`, `@repo/api`        |
| `apps/mobile`  | iOS/Android UI (Expo + React Native) | `@repo/domain`                     |
| `apps/raycast` | macOS quick-launch UI                | `@repo/domain`, `@raycast/api`     |

## Dependency Graph

Arrows point from dependent → dependency.

```
packages/domain          ← foundation; depends only on effect
     ↑
packages/api             ← depends on domain + @effect/platform
     ↑
apps/server              ← depends on domain + api + @effect/platform-node
apps/web                 ← depends on domain + api (typed Effect HTTP client)
apps/mobile              ← depends on domain only (plain fetch + schema validation)
apps/raycast             ← depends on domain only (Raycast native APIs)
```

## Architectural Invariants

- **ESM only.** No CommonJS. All imports use `.js` extensions.
- **Strict TypeScript everywhere.** `strict: true`, `noUncheckedIndexedAccess: true`.
- **Dependency direction flows upward.** Apps depend on packages; packages never depend on apps. `packages/domain` is the leaf — it has no in-repo dependencies.
- **Mobile and Raycast stay lightweight.** They depend only on `packages/domain`, never on `packages/api`, to keep bundle sizes small.
- **No shared React layer.** DOM, React Native, and Raycast renderers are too different; each app owns its own UI code.
- **Per-app storage and audio playback.** Each platform uses its native mechanism (localStorage, AsyncStorage, Raycast LocalStorage; HTML5 Audio, expo-av, afplay). There is no shared abstraction for these.

## Cross-Cutting Concerns

### Tooling

| Concern                | Tool                       | Config location                |
| ---------------------- | -------------------------- | ------------------------------ |
| Monorepo orchestration | Turborepo                  | `turbo.json`                   |
| Package management     | pnpm workspaces            | `pnpm-workspace.yaml`          |
| Linting                | oxlint                     | root `package.json` scripts    |
| Formatting             | oxfmt                      | root `package.json` scripts    |
| Pre-commit hooks       | Husky + lint-staged        | `.husky/`, root `package.json` |
| Effect DX              | `@effect/language-service` | patched in `prepare` script    |

### Effect

The codebase is adopting [Effect](https://effect.website) as its core library for typed errors, services, layers, and HTTP. When writing Effect code, always consult the `effect-solutions` skill and `.reference/effect/` directory first — never guess at patterns.

## Sound Catalog

The sound catalog is **locally curated and self-hosted** — there is no external API dependency or user-generated content.

### Data storage

- **Catalog metadata** lives in `data/catalog.json`, checked into the repo. Each entry contains: name, tags, and filename. The server loads it into memory at startup (read-only).
- **Audio files** live in `data/sounds/`, checked into the repo. Served as static assets by the server.
- To add a sound: drop the MP3 in `data/sounds/`, add an entry to `catalog.json`, commit.
- If the catalog grows large enough that JSON-in-memory becomes awkward (thousands of sounds), step up to **SQLite** via `better-sqlite3` — still a single file, no external database. For large MP3 collections, consider **git-lfs**.

### Curation

Sounds are manually curated from free/permissive sources (Freesound.org, Pixabay, MyInstants, etc.). There is no scraping pipeline or external API integration — sounds are downloaded, added to `data/sounds/`, and registered in `data/catalog.json`.

## Key Decisions Log

- **Effect HTTP server.** Typed clients, automatic OpenAPI generation.
- **Web uses `@repo/api` for typed client;** mobile and Raycast do not.
- **v0 keeps things simple:** no shared hooks, no shared storage abstraction, no shared audio abstraction.
- **Local catalog, not an external API.** The server is the single source of truth for sound metadata and audio files. No external service dependency, no user uploads.
