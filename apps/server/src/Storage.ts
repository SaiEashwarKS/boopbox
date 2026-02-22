import { FileSystem, Path } from "@effect/platform";
import { NodeFileSystem } from "@effect/platform-node";
import { Catalog, type SoundFilename } from "@repo/domain";
import { Config, Context, Effect, Layer, Schema } from "effect";

const CatalogJson = Schema.parseJson(Catalog);

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const DataDir = Config.string("DATA_DIR").pipe(Config.withDefault("../../data"));

// ---------------------------------------------------------------------------
// Errors
// ---------------------------------------------------------------------------

export class CatalogStorageError extends Schema.TaggedError<CatalogStorageError>()(
  "CatalogStorageError",
  { message: Schema.String, cause: Schema.Defect },
) {}

export class SoundFileStorageError extends Schema.TaggedError<SoundFileStorageError>()(
  "SoundFileStorageError",
  { message: Schema.String, cause: Schema.Defect },
) {}

// ---------------------------------------------------------------------------
// CatalogStorage
// ---------------------------------------------------------------------------

export class CatalogStorage extends Context.Tag("@boopbox/CatalogStorage")<
  CatalogStorage,
  {
    readonly read: () => Effect.Effect<Catalog, CatalogStorageError>;
  }
>() {
  static readonly layer = Layer.effect(
    CatalogStorage,
    Effect.gen(function* () {
      const fs = yield* FileSystem.FileSystem;
      const path = yield* Path.Path;
      const dataDir = yield* DataDir;
      const catPath = path.join(dataDir, "catalog.json");

      const read = () =>
        Effect.gen(function* () {
          const raw = yield* fs.readFileString(catPath);
          return yield* Schema.decode(CatalogJson)(raw);
        }).pipe(
          Effect.catchAll(
            (cause) => new CatalogStorageError({ message: "Failed to read catalog", cause }),
          ),
        );

      return CatalogStorage.of({ read });
    }),
  );
}

// ---------------------------------------------------------------------------
// SoundFileStorage
// ---------------------------------------------------------------------------

export class SoundFileStorage extends Context.Tag("@boopbox/SoundFileStorage")<
  SoundFileStorage,
  {
    readonly exists: (filename: SoundFilename) => Effect.Effect<boolean, SoundFileStorageError>;
    readonly filePath: (filename: SoundFilename) => string;
  }
>() {
  static readonly layer = Layer.effect(
    SoundFileStorage,
    Effect.gen(function* () {
      const fs = yield* FileSystem.FileSystem;
      const path = yield* Path.Path;
      const dataDir = yield* DataDir;
      const sndDir = path.join(dataDir, "sounds");

      const exists = (filename: SoundFilename) =>
        fs
          .exists(path.join(sndDir, filename))
          .pipe(
            Effect.catchAll(
              (cause) =>
                new SoundFileStorageError({ message: "Failed to check sound file", cause }),
            ),
          );

      const filePath = (filename: SoundFilename) => path.join(sndDir, filename);

      return SoundFileStorage.of({ exists, filePath });
    }),
  );
}

// ---------------------------------------------------------------------------
// Combined layer
// ---------------------------------------------------------------------------

export const StorageLayer = Layer.mergeAll(CatalogStorage.layer, SoundFileStorage.layer).pipe(
  Layer.provide(NodeFileSystem.layer),
  Layer.provide(Path.layer),
);
