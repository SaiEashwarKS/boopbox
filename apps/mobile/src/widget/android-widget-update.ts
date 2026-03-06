import type { Sound } from "@repo/domain";

import React from "react";
import { Platform } from "react-native";
import { requestWidgetUpdate } from "react-native-android-widget";

import type { Favourites } from "../lib/favourites";

import { sortWithFavourites } from "../lib/favourites";
import { AndroidSoundsWidget } from "./AndroidSoundsWidget";

export async function updateAndroidWidget(
  sounds: readonly Sound[],
  favourites: Favourites,
): Promise<void> {
  if (Platform.OS !== "android") return;

  const sorted = sortWithFavourites(sounds, favourites);
  const widgetSounds = sorted.map((s) => ({
    name: s.name,
    isFavourite: s.filename in favourites,
  }));

  await requestWidgetUpdate({
    widgetName: "SoundsWidget",
    renderWidget: () => React.createElement(AndroidSoundsWidget, { sounds: widgetSounds }),
  });
}
