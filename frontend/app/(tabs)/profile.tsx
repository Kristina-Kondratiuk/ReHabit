import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ThemedButton } from '@/components/ui/ThemedButton';
import { useAuth } from '@/src/context/auth-context';

const Profile = () => {
  const { session, signOut } = useAuth();
  const username = session?.user?.username || 'User';
  const email = session?.user?.email || 'example@email.com';

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Profil</ThemedText>

      <ThemedView style={styles.card}>
        <View style={styles.row}>
          <ThemedText type="defaultSemiBold">Imię</ThemedText>
          <ThemedText>{username}</ThemedText>
        </View>
        <View style={styles.row}>
          <ThemedText type="defaultSemiBold">Email</ThemedText>
          <ThemedText>{email}</ThemedText>
        </View>
      </ThemedView>

      <ThemedButton title="Wyloguj się" onPress={signOut} />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 16,
    padding: 16,
    gap: 14,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 24,
  },
  row: {
    gap: 6,
  },
});

export default Profile;
