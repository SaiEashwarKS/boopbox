# boopbox

Browse, search, and play short audio clips across mobile, web, and macOS.

## Raycast Extension

Install the Raycast extension for macOS:

1. Clone the repo
2. Run the install script:
   ```sh
   ./scripts/install-raycast.sh
   ```
3. Set the **Server URL** in Raycast extension preferences

### Prerequisites
- [pnpm](https://pnpm.io/) (v9+)

## Mobile App

The mobile app runs on iOS, Android via Expo.

1. Clone the repo
2. Install dependencies:
   ```sh
   pnpm install
   ```
3. Set `EXPO_PUBLIC_SERVER_URL` in `.env`:
   ```sh
   cp .env.example .env
   ```
4. Start the app:
   ```sh
   pnpm --filter mobile dev       # Expo dev server
   pnpm --filter mobile ios       # iOS simulator
   pnpm --filter mobile android   # Android emulator
   ```

### Prerequisites
- Node.js >= 20
- [pnpm](https://pnpm.io/) (v9+)

---

## Server

A hosted server is available — apps connect to it by default. To self-host:

```sh
pnpm --filter server dev
```

Serves catalog + audio files from `data/`. Defaults to port 3000.

Env vars: `PORT`, `DATA_DIR`

## Development

```sh
pnpm install
pnpm dev          # start all apps
pnpm build        # build all packages/apps
```

| Command | Description |
|---|---|
| `pnpm dev` | Start all apps |
| `pnpm build` | Build all |
| `pnpm lint` | Lint (oxlint) |
| `pnpm lint:fix` | Lint + autofix |
| `pnpm fmt` | Format (oxfmt) |
| `pnpm fmt:check` | Check formatting |

## Tech Stack

- **Effect** — typed errors, services, layers, HTTP
- **TypeScript** — static type checking
- **React Native + Expo** — cross-platform mobile
- **Raycast API** — macOS extension
- **Turborepo** — monorepo build system
- **pnpm** — package manager
