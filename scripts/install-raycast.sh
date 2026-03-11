#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

# Preflight checks
if ! command -v pnpm &>/dev/null; then
  echo "Error: pnpm is not installed. Install it with:" >&2
  echo "  curl -fsSL https://get.pnpm.io/install.sh | sh -" >&2
  exit 1
fi

# Install dependencies
echo "Installing dependencies..."
(cd "$REPO_ROOT" && pnpm install --frozen-lockfile)

# Build Raycast extension for release
echo "Building Raycast extension..."
cd "$REPO_ROOT/apps/raycast" && npx ray build -e dist -o .

# Instruct user to import the extension
echo ""
echo "Build complete! To import into Raycast:"
echo "  1. Open Raycast and search for 'Import Extension'"
echo "  2. Select the folder: $REPO_ROOT/apps/raycast/"
echo ""
echo "Opening Raycast..."
open "raycast://extensions"
