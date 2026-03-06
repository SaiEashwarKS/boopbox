import type { WidgetTaskHandlerProps } from "react-native-android-widget";

import AsyncStorage from "@react-native-async-storage/async-storage";

import type { Favourites } from "../lib/favourites";

import { sortWithFavourites } from "../lib/favourites";
import { AndroidSoundsWidget } from "./AndroidSoundsWidget";

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  const { widgetAction, renderWidget } = props;

  if (widgetAction === "WIDGET_DELETED" || widgetAction === "WIDGET_CLICK") {
    return;
  }

  const catalogRaw = await AsyncStorage.getItem("catalog");
  const favouritesRaw = await AsyncStorage.getItem("favourites");

  const catalog = catalogRaw ? JSON.parse(catalogRaw) : null;
  const favourites: Favourites = favouritesRaw ? JSON.parse(favouritesRaw) : {};

  const sounds = catalog?.sounds ?? [];
  const sorted = sortWithFavourites(sounds, favourites);

  const widgetSounds = sorted.map((s) => ({
    name: s.name,
    isFavourite: s.filename in favourites,
  }));

  renderWidget(<AndroidSoundsWidget sounds={widgetSounds} />);
}
