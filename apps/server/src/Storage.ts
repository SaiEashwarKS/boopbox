import { FileSystem, Path } from "@effect/platform";
import { NodeFileSystem } from "@effect/platform-node";
import { CatalogFile, type SoundFilename } from "@repo/domain";
import { Config, Context, Effect, Layer, Schema } from "effect";

const CatalogJson = Schema.parseJson(CatalogFile);

const DataDir = Config.string("DATA_DIR").pipe(Config.withDefault("../../data"));

export class CatalogStorageError extends Schema.TaggedError<CatalogStorageError>()(
  "CatalogStorageError",
  { message: Schema.String, cause: Schema.Defect },
) {}

export class SoundFileStorageError extends Schema.TaggedError<SoundFileStorageError>()(
  "SoundFileStorageError",
  { message: Schema.String, cause: Schema.Defect },
) {}

export class CatalogStorage extends Context.Tag("@boopbox/CatalogStorage")<
  CatalogStorage,
  {
    readonly read: () => Effect.Effect<CatalogFile>;
  }
>() {
  static readonly layer = Layer.effect(
    CatalogStorage,
    Effect.gen(function* () {
      const fs = yield* FileSystem.FileSystem;
      const path = yield* Path.Path;
      const dataDir = yield* DataDir;
      const catPath = path.join(dataDir, "catalog.json");

      const raw = yield* fs.readFileString(catPath).pipe(
        Effect.catchAll(
          (cause) =>
            new CatalogStorageError({
              message: "Failed to read catalog",
              cause,
            }),
        ),
      );
      const catalog = yield* Schema.decode(CatalogJson)(raw).pipe(
        Effect.catchAll(
          (cause) =>
            new CatalogStorageError({
              message: "Failed to decode catalog",
              cause,
            }),
        ),
      );

      yield* Effect.logInfo(
        `Catalog loaded — revision ${catalog.revision}, ${catalog.sounds.length} sound(s)`,
      );

      return CatalogStorage.of({ read: () => Effect.succeed(catalog) });
    }),
  );
}

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
        fs.exists(path.join(sndDir, filename)).pipe(
          Effect.catchAll(
            (cause) =>
              new SoundFileStorageError({
                message: "Failed to check sound file",
                cause,
              }),
          ),
        );

      const filePath = (filename: SoundFilename) => path.join(sndDir, filename);

      return SoundFileStorage.of({ exists, filePath });
    }),
  );
}

export const StorageLayer = Layer.mergeAll(CatalogStorage.layer, SoundFileStorage.layer).pipe(
  Layer.provide(NodeFileSystem.layer),
  Layer.provide(Path.layer),
);
