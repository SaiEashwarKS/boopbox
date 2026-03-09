import { FlexWidget, ListWidget, TextWidget } from "react-native-android-widget";

interface Props {
  sounds: { name: string; isFavourite: boolean }[];
}

export function AndroidSoundsWidget({ sounds }: Props) {
  return (
    <FlexWidget
      style={{
        flexDirection: "column",
        width: "match_parent",
        height: "match_parent",
        backgroundColor: "#ffffff",
        padding: 8,
        borderRadius: 16,
      }}
    >
      <TextWidget
        text="Boopbox Sounds"
        style={{ fontSize: 16, fontWeight: "bold", color: "#1a1a1a" }}
      />
      <ListWidget
        style={{
          width: "match_parent",
          height: "match_parent",
          marginTop: 4,
        }}
      >
        {sounds.map((sound, i) => (
          <FlexWidget
            key={i}
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "match_parent",
              height: 36,
              paddingHorizontal: 4,
            }}
          >
            <TextWidget
              text={sound.isFavourite ? `★ ${sound.name}` : sound.name}
              style={{
                fontSize: 14,
                color: sound.isFavourite ? "#b8860b" : "#333333",
              }}
              maxLines={1}
              truncate="END"
            />
          </FlexWidget>
        ))}
      </ListWidget>
    </FlexWidget>
  );
}
