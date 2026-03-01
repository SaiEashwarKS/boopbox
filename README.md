# boopbox

A sound-catalog application — browse, search, and play short audio clips across web, mobile, and macOS.

## Structure

```
apps/
  server/        # Effect HTTP server
packages/
  domain/              # Shared types, schemas, pure logic
  typescript-config/   # Shared tsconfig bases
data/
  catalog.json         # Sound catalog
  sounds/              # MP3 files
```

## Getting Started

Install dependencies:

```sh
pnpm install
```

### Develop

```sh
pnpm dev
```

### Build

```sh
pnpm build
```

## Tech Stack

- [Effect](https://effect.website/) — typed errors, services, layers, HTTP
- [TypeScript](https://www.typescriptlang.org/) — static type checking
- [Turborepo](https://turborepo.dev/) — monorepo build system
- [pnpm](https://pnpm.io/) — package manager
