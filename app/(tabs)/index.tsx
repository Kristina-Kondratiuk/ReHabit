import { Button, StyleSheet, TouchableOpacity, View } from "react-native";

import { HelloWave } from "@/components/hello-wave";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import TaskCheckbox from "@/components/ui/task-checkbox";

export default function HomeScreen() {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerText}>
        <ThemedText type="title">
          Hello, User! <HelloWave />
        </ThemedText>
      </View>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="subtitle">Read a book</ThemedText>
            <TaskCheckbox/>
      </ThemedView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="subtitle">Clean the room</ThemedText>
            <TaskCheckbox/>
      </ThemedView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="subtitle">Train</ThemedText>
            <TaskCheckbox/>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: 20,
    width: 28,
    height: 28,
  },
  headerText: {
    marginBottom: 10,
  },
  mainContainer: {
    gap: 12,
    backgroundColor: "#F2EAE0",
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 120,
    height: "100%",
  },
  titleContainer: {
    width: "100%",
    height: 80,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#B4D3D9",
    borderRadius: 20,
    padding: 18,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
