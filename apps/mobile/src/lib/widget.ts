import type { Sound } from "@repo/domain";

import SoundsWidget from "../widget/SoundsWidget";
import { type Favourites, isFavourite, sortWithFavourites } from "./favourites";

export const updateWidget = (sounds: readonly Sound[], favourites: Favourites): void => {
  const sorted = sortWithFavourites([...sounds], favourites);
  SoundsWidget.updateSnapshot({
    sounds: sorted.map((s) => ({
      name: s.name,
      isFavourite: isFavourite(s.filename, favourites),
    })),
  });
};
