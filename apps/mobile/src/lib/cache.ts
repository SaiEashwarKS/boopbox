import AsyncStorage from "@react-native-async-storage/async-storage";
import { Catalog } from "@repo/domain";
import * as Schema from "effect/Schema";
import { File, Directory, Paths } from "expo-file-system";

const CATALOG_KEY = "catalog";

const soundsDir = new Directory(Paths.document, "sounds");

export const readCachedCatalog = async (): Promise<Catalog | null> => {
  const raw = await AsyncStorage.getItem(CATALOG_KEY);
  if (raw == null) return null;
  try {
    const json = JSON.parse(raw);
    return Schema.decodeUnknownSync(Catalog)(json);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("Failed to decode cached catalog, ignoring cache", e);
    return null;
  }
};

export const writeCachedCatalog = async (catalog: Catalog): Promise<void> => {
  await AsyncStorage.setItem(CATALOG_KEY, JSON.stringify(catalog));
};

export const soundFilePath = (filename: string): string => new File(soundsDir, filename).uri;

export const soundFileExists = (filename: string): boolean => new File(soundsDir, filename).exists;

export const writeSoundFile = async (serverUrl: string, filename: string): Promise<void> => {
  if (!soundsDir.exists) {
    soundsDir.create({ intermediates: true });
  }
  const url = `${serverUrl}/sounds/${encodeURIComponent(filename)}`;
  const dest = new File(soundsDir, filename);
  await File.downloadFileAsync(url, dest, { idempotent: true });
};

export const getMissingSounds = (filenames: readonly string[]): string[] =>
  filenames.filter((f) => !soundFileExists(f));
