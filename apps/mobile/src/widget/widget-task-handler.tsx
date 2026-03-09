import type { WidgetTaskHandlerProps } from "react-native-android-widget";

import { readCachedCatalog } from "../lib/cache";
import { loadFavourites, sortWithFavourites } from "../lib/favourites";
import { AndroidSoundsWidget } from "./AndroidSoundsWidget";

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  const { widgetAction, renderWidget } = props;

  if (widgetAction === "WIDGET_DELETED" || widgetAction === "WIDGET_CLICK") {
    return;
  }

  const catalog = await readCachedCatalog();
  const favourites = await loadFavourites();

  const sounds = catalog?.sounds ?? [];
  const sorted = sortWithFavourites(sounds, favourites);

  const widgetSounds = sorted.map((s) => ({
    name: s.name,
    isFavourite: s.filename in favourites,
  }));

  renderWidget(<AndroidSoundsWidget sounds={widgetSounds} />);
}
