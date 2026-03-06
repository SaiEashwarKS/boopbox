import { search, type Sound } from "@repo/domain";
import { Audio } from "expo-av";
import { StatusBar } from "expo-status-bar";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";

import { soundFilePath } from "./src/lib/cache";
import { loadCatalog, type SyncState } from "./src/lib/sync";

const SERVER_URL = "http://localhost:3000";

const statusText = (state: SyncState): string => {
  switch (state.phase) {
    case "loading-cache":
      return "Loading cache\u2026";
    case "cached":
      return "Checking for updates\u2026";
    case "checking":
      return "Checking server\u2026";
    case "downloading":
      return `Downloading ${state.downloaded}/${state.total}\u2026`;
    case "done":
      return "";
    case "error":
      return `Error: ${state.message}`;
  }
};

export default function App() {
  const [sounds, setSounds] = useState<readonly Sound[]>([]);
  const [syncState, setSyncState] = useState<SyncState>({
    phase: "loading-cache",
  });
  const [searchText, setSearchText] = useState("");
  const [playingFilename, setPlayingFilename] = useState<string | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  const isLoading = syncState.phase !== "done" && syncState.phase !== "error";

  const onProgress = useCallback((state: SyncState) => {
    setSyncState(state);
    if (state.phase === "cached" || state.phase === "done") {
      setSounds(state.catalog.sounds);
    }
  }, []);

  useEffect(() => {
    loadCatalog(SERVER_URL, onProgress).catch((err) => {
      setSyncState({ phase: "error", message: String(err) });
    });
  }, [onProgress]);

  // Cleanup sound on unmount
  useEffect(() => {
    return () => {
      soundRef.current?.unloadAsync();
    };
  }, []);

  const playSound = useCallback(
    async (filename: string) => {
      // Tap same sound → stop
      if (playingFilename === filename) {
        await soundRef.current?.stopAsync();
        await soundRef.current?.unloadAsync();
        soundRef.current = null;
        setPlayingFilename(null);
        return;
      }

      // Stop previous sound
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      const uri = soundFilePath(filename);
      const { sound } = await Audio.Sound.createAsync({ uri });
      soundRef.current = sound;
      setPlayingFilename(filename);

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
          soundRef.current = null;
          setPlayingFilename(null);
        }
      });

      await sound.playAsync();
    },
    [playingFilename],
  );

  const filtered = search([...sounds], searchText);
  const subtitle = statusText(syncState);

  const renderItem = useCallback(
    ({ item }: { item: Sound }) => {
      const isPlaying = playingFilename === item.filename;
      return (
        <TouchableOpacity
          style={[styles.row, isPlaying && styles.rowPlaying]}
          onPress={() => playSound(item.filename)}
          activeOpacity={0.7}
        >
          <View style={styles.rowContent}>
            <Text style={[styles.name, isPlaying && styles.namePlaying]}>
              {isPlaying ? "\u25B6 " : ""}
              {item.name}
            </Text>
            {item.tags.length > 0 && <Text style={styles.tags}>{item.tags.join(", ")}</Text>}
          </View>
        </TouchableOpacity>
      );
    },
    [playingFilename, playSound],
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.title}>Boopbox</Text>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search sounds\u2026"
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
      {isLoading && subtitle ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>{subtitle}</Text>
        </View>
      ) : syncState.phase === "error" ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>{subtitle}</Text>
        </View>
      ) : (
        <FlatList
          data={filtered as Sound[]}
          renderItem={renderItem}
          keyExtractor={(item) => item.filename}
          contentContainerStyle={styles.list}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchInput: {
    backgroundColor: "#F0F0F0",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: "#666",
  },
  errorText: {
    fontSize: 14,
    color: "#FF3B30",
  },
  list: {
    paddingBottom: 32,
  },
  row: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E0E0E0",
  },
  rowPlaying: {
    backgroundColor: "#E8F4FD",
  },
  rowContent: {
    gap: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
  },
  namePlaying: {
    color: "#007AFF",
  },
  tags: {
    fontSize: 13,
    color: "#888",
  },
});
