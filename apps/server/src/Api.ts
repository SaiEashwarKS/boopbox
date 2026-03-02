import { HttpRouter, HttpServerRequest, HttpServerResponse } from "@effect/platform";
import { CatalogManifest, CatalogPage, SoundFilename } from "@repo/domain";
import { Effect, Schema } from "effect";

import { CatalogStorage, SoundFileStorage } from "./Storage.js";

const PaginationParams = Schema.Struct({
  offset: Schema.optionalWith(Schema.NumberFromString.pipe(Schema.nonNegative(), Schema.int()), {
    default: () => 0,
  }),
  limit: Schema.optionalWith(
    Schema.NumberFromString.pipe(Schema.positive(), Schema.int(), Schema.clamp(1, 200)),
    { default: () => 100 },
  ),
});

const FilenameParams = Schema.Struct({
  filename: SoundFilename,
});

const etagFor = (revision: number) => `"rev-${revision}"`;

const notModified = (request: HttpServerRequest.HttpServerRequest, revision: number) => {
  const ifNoneMatch = request.headers["if-none-match"];
  return ifNoneMatch === etagFor(revision);
};

export const Api = HttpRouter.empty.pipe(
  HttpRouter.get(
    "/catalog/manifest",
    Effect.gen(function* () {
      const req = yield* HttpServerRequest.HttpServerRequest;
      const { read } = yield* CatalogStorage;
      const catalog = yield* read();

      if (notModified(req, catalog.revision)) {
        return HttpServerResponse.empty({ status: 304 });
      }

      const manifest = new CatalogManifest({
        revision: catalog.revision,
        filenames: catalog.sounds.map((s) => s.filename),
      });

      return yield* HttpServerResponse.json(manifest).pipe(
        Effect.map(HttpServerResponse.setHeader("etag", etagFor(catalog.revision))),
        Effect.map(HttpServerResponse.setHeader("cache-control", "no-cache")),
      );
    }),
  ),

  HttpRouter.get(
    "/catalog",
    Effect.gen(function* () {
      const req = yield* HttpServerRequest.HttpServerRequest;
      const { read } = yield* CatalogStorage;
      const catalog = yield* read();

      if (notModified(req, catalog.revision)) {
        return HttpServerResponse.empty({ status: 304 });
      }

      const { offset, limit } = yield* HttpServerRequest.schemaSearchParams(PaginationParams);
      const sounds = catalog.sounds.slice(offset, offset + limit);

      const page = new CatalogPage({
        revision: catalog.revision,
        sounds,
        offset,
        limit,
        total: catalog.sounds.length,
      });

      return yield* HttpServerResponse.json(page).pipe(
        Effect.map(HttpServerResponse.setHeader("etag", etagFor(catalog.revision))),
        Effect.map(HttpServerResponse.setHeader("cache-control", "no-cache")),
      );
    }),
  ),

  HttpRouter.get(
    "/sounds/:filename",
    Effect.gen(function* () {
      const { filename } = yield* HttpRouter.schemaPathParams(FilenameParams);
      const snd = yield* SoundFileStorage;
      const found = yield* snd.exists(filename);

      if (!found) {
        return HttpServerResponse.empty({ status: 404 });
      }

      return yield* HttpServerResponse.file(snd.filePath(filename)).pipe(
        Effect.map(HttpServerResponse.setHeader("content-type", "audio/mpeg")),
        Effect.map(
          HttpServerResponse.setHeader("cache-control", "public, max-age=31536000, immutable"),
        ),
      );
    }),
  ),
);
