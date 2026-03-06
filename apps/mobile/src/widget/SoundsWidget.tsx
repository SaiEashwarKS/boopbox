import { Text, VStack, HStack, Divider, Spacer } from "@expo/ui/swift-ui";
import { font, foregroundStyle, padding, frame } from "@expo/ui/swift-ui/modifiers";
import { createWidget, type WidgetBase } from "expo-widgets";

type SoundEntry = {
  name: string;
  isFavourite: boolean;
};

type SoundsWidgetProps = {
  sounds: SoundEntry[];
};

const maxItems: Record<string, number> = {
  systemSmall: 4,
  systemMedium: 4,
  systemLarge: 10,
  systemExtraLarge: 16,
};

const SoundsWidget = (props: WidgetBase<SoundsWidgetProps>) => {
  "widget";

  const limit = maxItems[props.family] ?? 6;
  const sounds = (props.sounds ?? []).slice(0, limit);
  const remaining = (props.sounds ?? []).length - sounds.length;

  if (sounds.length === 0) {
    return (
      <VStack modifiers={[padding({ all: 12 }), frame({ maxWidth: 9999, maxHeight: 9999 })]}>
        <Text modifiers={[font({ weight: "bold", size: 14 })]}>Boopbox</Text>
        <Spacer />
        <Text
          modifiers={[
            foregroundStyle({ type: "hierarchical", style: "secondary" }),
            font({ size: 13 }),
          ]}
        >
          No sounds yet. Open the app to sync.
        </Text>
        <Spacer />
      </VStack>
    );
  }

  return (
    <VStack
      alignment="leading"
      spacing={0}
      modifiers={[padding({ all: 12 }), frame({ maxWidth: 9999, maxHeight: 9999 })]}
    >
      <Text modifiers={[font({ weight: "bold", size: 14 }), padding({ bottom: 4 })]}>Boopbox</Text>
      {sounds.map((sound, i) => (
        <VStack key={i} spacing={0}>
          {i > 0 && <Divider />}
          <HStack spacing={4} modifiers={[padding({ vertical: 3 })]}>
            {sound.isFavourite && (
              <Text modifiers={[foregroundStyle("#FFD700"), font({ size: 12 })]}>{"\u2605"}</Text>
            )}
            <Text
              modifiers={[
                font({ size: 13 }),
                foregroundStyle({ type: "hierarchical", style: "primary" }),
              ]}
            >
              {sound.name}
            </Text>
            <Spacer />
          </HStack>
        </VStack>
      ))}
      {remaining > 0 && (
        <Text
          modifiers={[
            foregroundStyle({ type: "hierarchical", style: "tertiary" }),
            font({ size: 11 }),
            padding({ top: 2 }),
          ]}
        >
          +{remaining} more
        </Text>
      )}
    </VStack>
  );
};

export default createWidget("SoundsWidget", SoundsWidget);
