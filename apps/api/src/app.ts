import type { FastifyInstance } from "fastify";

import AutoLoad from "@fastify/autoload";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function app(fastify: FastifyInstance) {
  // 1. Load all plugins
  await fastify.register(AutoLoad, {
    dir: path.join(__dirname, "plugins"),
    forceESM: true,
  });

  // 2. Load all routes (auto-prefixed by directory name)
  await fastify.register(AutoLoad, {
    dir: path.join(__dirname, "routes"),
    forceESM: true,
  });
}
