import { StyleSheet, useColorScheme, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Bell, Droplet, Dumbbell, Salad } from "lucide-react-native";
import { Colors } from "@/constants/theme";
import HabitToday from "@/components/habit-comp";
import { ThemedView } from "@/components/themed-view";
import { HorizontalCalendar } from "@/components/ui/horizontal-calendar";


export default function HomeScreen() {
  
  const themeName = useColorScheme() ?? 'light';
  const theme = Colors[themeName];
  const themeBackground = theme.background

  return (
    <ThemedView style={styles.mainContainer}>
      <View style={styles.headerText}>
        <ThemedText type="subtitle">
          Cześć, Kamila!
        </ThemedText>
        <View style={[styles.bell, {backgroundColor: themeBackground}]}><Bell color={Colors.common.tint} size={18}/></View>
      </View>
      <HorizontalCalendar />
      <ThemedText type="defaultSemiBold"> Zadania na dziś</ThemedText>
      <HabitToday title="Jeść sniadanie" description="Chcę regularnie jeść śniadanie, aby mieć więcej energii rano i lepiej zaczynać dzień" icon={ <Salad size={28} strokeWidth={1.5} />} color="green"/>
      <HabitToday title="Pić wodę" description="Chcę regularnie jeść śniadanie, aby mieć więcej energii rano i lepiej zaczynać dzień" icon={ <Droplet size={28} strokeWidth={1.5}/>} color="blue"/>
      <HabitToday title="Ćwiczyć" description="Chcę regularnie jeść śniadanie, aby mieć więcej energii rano i lepiej zaczynać dzień" icon={<Dumbbell size={28} strokeWidth={1.5}/>} />

    </ThemedView>
  );
}

const styles = StyleSheet.create({
  bell: {
    borderRadius: 70,
    width: 40,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    shadowColor: Colors.common.tint,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  btn: {
    borderRadius: 20,
    width: 28,
    height: 28,
  },
  headerText: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  mainContainer: {
    gap: 20,
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 20,
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
