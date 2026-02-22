# boopbox

A Turborepo monorepo containing a Fastify API.

## Structure

```
apps/
  api/          # Fastify API server
packages/
  typescript-config/   # Shared tsconfig.json
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

### Start (after build)

```sh
cd apps/api && node dist/server.js
```

## Tech Stack

- [Fastify](https://fastify.dev/) — API framework
- [TypeScript](https://www.typescriptlang.org/) — static type checking
- [Turborepo](https://turborepo.dev/) — monorepo build system
- [pnpm](https://pnpm.io/) — package manager
