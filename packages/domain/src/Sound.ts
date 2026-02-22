import * as Schema from "effect/Schema";

import { SoundFilename } from "./SoundFilename.js";

export class Sound extends Schema.Class<Sound>("Sound")({
  name: Schema.NonEmptyTrimmedString,
  tags: Schema.Array(Schema.NonEmptyTrimmedString),
  filename: SoundFilename,
}) {}
