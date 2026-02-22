import * as Schema from "effect/Schema";

import { Sound } from "./Sound.js";

export const Catalog = Schema.Array(Sound);

export type Catalog = typeof Catalog.Type;

export const search = (catalog: Catalog, query: string): Catalog => {
  const q = query.trim().toLowerCase();
  if (q === "") return catalog;
  return catalog.filter(
    (sound) =>
      sound.name.toLowerCase().includes(q) ||
      sound.tags.some((tag) => tag.toLowerCase().includes(q)),
  );
};

export const findByFilename = (catalog: Catalog, filename: string): Sound | undefined =>
  catalog.find((sound) => sound.filename === filename);
