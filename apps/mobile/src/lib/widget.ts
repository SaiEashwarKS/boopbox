import type { Sound } from "@repo/domain";

import { Platform } from "react-native";

import { updateAndroidWidget } from "../widget/android-widget-update";
import SoundsWidget from "../widget/SoundsWidget";
import { type Favourites, isFavourite, sortWithFavourites } from "./favourites";

export function updateWidget(sounds: readonly Sound[], favourites: Favourites): void {
  const sorted = sortWithFavourites(sounds, favourites);
  const widgetSounds = sorted.map((s) => ({
    name: s.name,
    isFavourite: isFavourite(s.filename, favourites),
  }));

  if (Platform.OS === "ios") {
    SoundsWidget.updateSnapshot({ sounds: widgetSounds });
  }

  if (Platform.OS === "android") {
    updateAndroidWidget(sounds, favourites);
  }
}
