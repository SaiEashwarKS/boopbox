import { HttpMiddleware, HttpServer } from "@effect/platform";
import { NodeHttpServer, NodeRuntime } from "@effect/platform-node";
import { Config, Layer } from "effect";
import { createServer } from "node:http";

import { Api } from "./Api.js";
import { StorageLayer } from "./Storage.js";

const Port = Config.integer("PORT").pipe(Config.withDefault(3000));

const ServerLive = Layer.unwrapEffect(
  Config.map(Port, (port) => NodeHttpServer.layer(() => createServer(), { port, host: "0.0.0.0" })),
);

const HttpLive = Api.pipe(
  HttpServer.serve(HttpMiddleware.cors()),
  HttpServer.withLogAddress,
  Layer.provide(ServerLive),
  Layer.provide(StorageLayer),
);

NodeRuntime.runMain(Layer.launch(HttpLive));
