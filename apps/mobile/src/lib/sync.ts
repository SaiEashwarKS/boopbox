import type { Catalog } from "@repo/domain";

import * as Effect from "effect/Effect";

import { ApiError, fetchManifest, fetchCatalogPage } from "./api";
import { readCachedCatalog, writeCachedCatalog, writeSoundFile, getMissingSounds } from "./cache";

export type SyncState =
  | { phase: "loading-cache" }
  | { phase: "cached"; catalog: Catalog }
  | { phase: "checking" }
  | { phase: "downloading"; downloaded: number; total: number }
  | { phase: "done"; catalog: Catalog }
  | { phase: "error"; message: string };

export const loadCatalog = async (
  serverUrl: string,
  onProgress: (state: SyncState) => void,
): Promise<Catalog> => {
  // 1. Load cache
  onProgress({ phase: "loading-cache" });
  const cached = await readCachedCatalog();

  if (cached) {
    onProgress({ phase: "cached", catalog: cached });
  }

  // 2. Check manifest
  onProgress({ phase: "checking" });
  const manifest = await Effect.runPromise(fetchManifest(serverUrl));

  // 3. If revision matches and all sound files present, done
  if (cached && cached.revision === manifest.revision) {
    const missing = getMissingSounds(manifest.filenames);
    if (missing.length === 0) {
      onProgress({ phase: "done", catalog: cached });
      return cached;
    }
  }

  // 4. Fetch full catalog page
  const page = await Effect.runPromise(fetchCatalogPage(serverUrl, 0, 200));

  const newCatalog: Catalog = {
    revision: page.revision,
    sounds: [...page.sounds],
  };

  // 5. Download missing sounds using expo-file-system
  const allFilenames = page.sounds.map((s) => s.filename);
  const missing = getMissingSounds(allFilenames);

  if (missing.length > 0) {
    let downloaded = 0;
    onProgress({ phase: "downloading", downloaded: 0, total: missing.length });

    // Parallel downloads with concurrency limit of 5
    await Effect.runPromise(
      Effect.forEach(
        missing,
        (filename) =>
          Effect.tryPromise({
            try: async () => {
              await writeSoundFile(serverUrl, filename);
              downloaded++;
              onProgress({
                phase: "downloading",
                downloaded,
                total: missing.length,
              });
            },
            catch: (e) => new ApiError(`download ${filename} failed`, e),
          }),
        { concurrency: 5 },
      ),
    );
  }

  // 6. Persist catalog
  await writeCachedCatalog(newCatalog);
  onProgress({ phase: "done", catalog: newCatalog });
  return newCatalog;
};
