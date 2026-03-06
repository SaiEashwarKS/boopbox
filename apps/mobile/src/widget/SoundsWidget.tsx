"widget";

import { Text, VStack, HStack, Divider } from "@expo/ui/swift-ui";
import { font, foregroundStyle, padding, frame } from "@expo/ui/swift-ui/modifiers";
import { createWidget, type WidgetBase } from "expo-widgets";

type SoundsWidgetProps = WidgetBase<{
  sounds: { name: string; isFavourite: boolean }[];
}>;

const ITEMS_PER_FAMILY: Record<string, number> = {
  systemSmall: 4,
  systemMedium: 4,
  systemLarge: 10,
  systemExtraLarge: 16,
};

function SoundsWidgetComponent(props: SoundsWidgetProps) {
  const { sounds, family } = props;
  const maxItems = ITEMS_PER_FAMILY[family] ?? 4;

  if (sounds.length === 0) {
    return (
      <VStack
        modifiers={[padding({ all: 12 }), frame({ maxWidth: Infinity, maxHeight: Infinity })]}
      >
        <Text modifiers={[font({ weight: "bold", size: 16 })]}>Boopbox</Text>
        <Text
          modifiers={[
            foregroundStyle({ type: "hierarchical", style: "secondary" }),
            font({ size: 13 }),
          ]}
        >
          No sounds yet. Open the app to sync.
        </Text>
      </VStack>
    );
  }

  const visible = sounds.slice(0, maxItems);
  const remaining = sounds.length - visible.length;

  return (
    <VStack alignment="leading" spacing={0} modifiers={[padding({ all: 12 })]}>
      <Text modifiers={[font({ weight: "bold", size: 16 }), padding({ bottom: 4 })]}>Boopbox</Text>
      {visible.map((sound, i) => (
        <VStack key={sound.name + String(i)} alignment="leading" spacing={0}>
          {i > 0 && <Divider />}
          <HStack spacing={4} modifiers={[padding({ vertical: 2 })]}>
            {sound.isFavourite && (
              <Text modifiers={[foregroundStyle("#FFD700"), font({ size: 13 })]}>★</Text>
            )}
            <Text modifiers={[font({ size: 13 })]}>{sound.name}</Text>
          </HStack>
        </VStack>
      ))}
      {remaining > 0 && (
        <Text
          modifiers={[
            foregroundStyle({ type: "hierarchical", style: "secondary" }),
            font({ size: 11 }),
            padding({ top: 2 }),
          ]}
        >
          +{remaining} more
        </Text>
      )}
    </VStack>
  );
}

export default createWidget("SoundsWidget", SoundsWidgetComponent);
