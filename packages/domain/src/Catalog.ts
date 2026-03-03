import * as Schema from "effect/Schema";

import { Sound, SoundFilename } from "./Sound.js";

// ---------------------------------------------------------------------------
// On-disk format
// ---------------------------------------------------------------------------

export class CatalogFile extends Schema.Class<CatalogFile>("CatalogFile")({
  revision: Schema.NonNegative.pipe(Schema.int(), Schema.brand("NonNegativeInt")),
  sounds: Schema.Array(Sound),
}) {}

// ---------------------------------------------------------------------------
// API response schemas
// ---------------------------------------------------------------------------

export class CatalogManifest extends Schema.Class<CatalogManifest>("CatalogManifest")({
  revision: CatalogFile.fields.revision,
  filenames: Schema.Array(SoundFilename),
}) {}

export class CatalogPage extends Schema.Class<CatalogPage>("CatalogPage")({
  revision: CatalogFile.fields.revision,
  sounds: Schema.Array(Sound),
  offset: Schema.NonNegative.pipe(Schema.int()),
  limit: Schema.Positive.pipe(Schema.int()),
  total: Schema.NonNegative.pipe(Schema.int()),
}) {}

export const search = (sounds: ReadonlyArray<Sound>, query: string): ReadonlyArray<Sound> => {
  const q = query.trim().toLowerCase();
  if (q === "") return sounds;
  return sounds.filter(
    (sound) =>
      sound.name.toLowerCase().includes(q) ||
      sound.tags.some((tag) => tag.toLowerCase().includes(q)),
  );
};

export class Catalog extends Schema.Class<Catalog>("Catalog")({
  revision: CatalogFile.fields.revision,
  sounds: Schema.Array(Sound),
}) {}

export const findByFilename = (sounds: ReadonlyArray<Sound>, filename: string): Sound | undefined =>
  sounds.find((sound) => sound.filename === filename);
