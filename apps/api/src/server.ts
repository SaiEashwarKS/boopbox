import Fastify from "fastify";

import app from "./app.js";

const server = Fastify({ logger: true });

await server.register(app);

try {
  const port = Number(process.env.PORT) || 3000;
  await server.listen({ port, host: "0.0.0.0" });
} catch (err) {
  server.log.error(err);
  process.exit(1);
}
