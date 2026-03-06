import type { Sound, SoundFilename } from "@repo/domain";

import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "favourites";

export type Favourites = Record<SoundFilename, number>;

export async function loadFavourites(): Promise<Favourites> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return {} as Favourites;
  return JSON.parse(raw) as Favourites;
}

export async function saveFavourites(favs: Favourites): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(favs));
}

export async function toggleFavourite(
  filename: SoundFilename,
  favs: Favourites,
): Promise<Favourites> {
  const next = { ...favs };
  if (filename in next) {
    delete next[filename];
  } else {
    next[filename] = Date.now();
  }
  await saveFavourites(next);
  return next;
}

export function isFavourite(filename: SoundFilename, favs: Favourites): boolean {
  return filename in favs;
}

export function sortWithFavourites(sounds: readonly Sound[], favs: Favourites): Sound[] {
  const favourited: Sound[] = [];
  const rest: Sound[] = [];
  for (const s of sounds) {
    if (s.filename in favs) {
      favourited.push(s);
    } else {
      rest.push(s);
    }
  }
  favourited.sort((a, b) => (favs[b.filename] ?? 0) - (favs[a.filename] ?? 0));
  return [...favourited, ...rest];
}
