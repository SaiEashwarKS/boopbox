import * as Schema from "effect/Schema";

export const SoundFilename = Schema.NonEmptyTrimmedString.pipe(Schema.brand("SoundFilename"));

export type SoundFilename = typeof SoundFilename.Type;

export class Sound extends Schema.Class<Sound>("Sound")({
  name: Schema.NonEmptyTrimmedString,
  tags: Schema.Array(Schema.NonEmptyTrimmedString),
  filename: SoundFilename,
}) {}
