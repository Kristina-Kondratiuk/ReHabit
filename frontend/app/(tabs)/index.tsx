import { StyleSheet, View } from "react-native";
import { useState } from "react";

import { HelloWave } from "@/components/hello-wave";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import TaskCheckbox from "@/components/ui/task-checkbox";
import { Link } from "expo-router";
import { ThemedButton } from "@/components/ui/ThemedButton";
import { Bell } from "lucide-react-native";
import { Colors } from "@/constants/theme";


export default function HomeScreen() {
  const [selectedTone, setSelectedTone] = useState<"green" | "red" | null>(null);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerText}>
        <ThemedText type="subtitle">
          Hello, User! <HelloWave />
        </ThemedText>
        <View style={styles.bell}><Bell color={Colors.light.tint} size={18}/></View>
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
      <Link href={"/(auth)/login"}> Login link</Link>
      <Link href={"/(auth)/register"}> Register link</Link>
      <View style={styles.choiceButtonsRow}>
        <View style={styles.choiceButtonWrap}>
          <ThemedButton
            title="Nabywam"
            variant="choice"
            tone="green"
            height={86}
            selected={selectedTone === "green"}
            onPress={() => setSelectedTone("green")}
          />
        </View>
        <View style={styles.choiceButtonWrap}>
          <ThemedButton
            title="Pozbywam się"
            variant="choice"
            tone="red"
            height={86}
            selected={selectedTone === "red"}
            onPress={() => setSelectedTone("red")}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bell: {
    backgroundColor: '#fff',
    borderRadius: 70,
    width: 34, 
    height: 34,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
   shadowColor: Colors.light.tint,
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.5, 
  shadowRadius: 4,    
  elevation: 10, 
  },
  btn: {
    borderRadius: 20,
    width: 28,
    height: 28,
  },
  headerText: {
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  mainContainer: {
    gap: 12,
    backgroundColor: "#ffffff",
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
  choiceButtonsRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  choiceButtonWrap: {
    flex: 1,
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
