import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedButton } from '@/components/ui/ThemedButton';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { habitIconMap, presetHabits } from '@/constants/habit-presets';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function AddHabitPresetScreen() {
  const themeName = useColorScheme() ?? 'light';
  const theme = Colors[themeName];
  const presetShadowStyle =
    themeName === 'dark'
      ? {
          shadowColor: Colors.common.purple,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 1,
          shadowRadius: 3,
          elevation: 3,
        }
      : {
          shadowOpacity: 0,
          elevation: 0,
        };

  const handleCreateOwnHabit = () => {
    router.push('/(tabs)/addHabit/create');
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <ThemedText style={styles.titleText} type='subtitle'>Stworzenie nawyku</ThemedText>

          <ThemedButton title="Dodaj nowy nawyk" onPress={handleCreateOwnHabit} height={56} />

          <View style={styles.presetSection}>
            <ThemedText type="defaultSemiBold" style={styles.sectionLabel}>
              Sugerowane nawyki
            </ThemedText>
            <View style={styles.presetGrid}>
              {presetHabits.map((preset) => {
                const Icon = habitIconMap[preset.icon];
                return (
                  <Pressable
                    key={preset.id}
                    style={[styles.presetCard, { backgroundColor: theme.purple }, presetShadowStyle]}
                    onPress={() =>
                      router.push({
                        pathname: '/(tabs)/addHabit/create',
                        params: { presetId: preset.id },
                      })
                    }
                  >
                    <View style={[styles.presetIconWrap, { backgroundColor: Colors.common.white }]}>
                      <Icon size={22} color={Colors.common.black} strokeWidth={1.8} />
                    </View>
                    <ThemedText type="defaultSemiBold" style={styles.presetTitle}>
                      {preset.title}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </View>
          </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 24,
  },
  presetCard: {
    width: '48.5%',
    minHeight: 117,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    padding: 12,
    gap: 10,
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  presetSection: {
    gap: 16
  },
  presetIconWrap: {
    width: 49,
    height: 49,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  presetTitle: {
    fontSize: 14,
    lineHeight: 18,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionLabel: {
    marginTop: 16,
  },
  titleText: {
    marginBottom: 20,
  },
});
