import * as Schema from "effect/Schema";

export const SoundFilename = Schema.NonEmptyTrimmedString.pipe(Schema.brand("SoundFilename"));

export type SoundFilename = typeof SoundFilename.Type;
