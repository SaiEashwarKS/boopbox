import { NodeRuntime } from "@effect/platform-node";
import { Console, Effect } from "effect";

import { CatalogStorage, StorageLayer } from "./Storage.js";

const program = Effect.gen(function* () {
  const catalog = yield* CatalogStorage;
  const sounds = yield* catalog.read();
  yield* Console.log(`Catalog loaded — ${sounds.length} sound(s)`);
});

NodeRuntime.runMain(program.pipe(Effect.provide(StorageLayer)));
