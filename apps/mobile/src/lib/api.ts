import { CatalogManifest, CatalogPage } from "@repo/domain";
import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";

export class ApiError {
  readonly _tag = "ApiError";
  constructor(
    readonly message: string,
    readonly cause?: unknown,
  ) {}
}

const fetchJson = <A, I>(url: string, schema: Schema.Schema<A, I>) =>
  Effect.tryPromise({
    try: () =>
      fetch(url).then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}: ${r.statusText}`);
        return r.json();
      }),
    catch: (e) => new ApiError(`fetch ${url} failed`, e),
  }).pipe(
    Effect.flatMap((json) =>
      Schema.decodeUnknown(schema)(json).pipe(
        Effect.mapError((e) => new ApiError(`decode failed for ${url}`, e)),
      ),
    ),
  );

export const fetchManifest = (serverUrl: string) =>
  fetchJson(`${serverUrl}/catalog/manifest`, CatalogManifest);

export const fetchCatalogPage = (serverUrl: string, offset = 0, limit = 200) =>
  fetchJson(`${serverUrl}/catalog?offset=${offset}&limit=${limit}`, CatalogPage);

export const fetchSoundUrl = (serverUrl: string, filename: string) =>
  `${serverUrl}/sounds/${encodeURIComponent(filename)}`;
