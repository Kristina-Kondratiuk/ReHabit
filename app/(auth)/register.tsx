import React from 'react';
import { Keyboard, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedButton } from '@/components/ui/ThemedButton';
import ThemedInput from '@/components/ui/ThemedInput';

const Register = () => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView style={styles.cont}>
        <ThemedText type="title" style={{ marginBottom: 40 }}>Rejestracja</ThemedText>
        <ThemedInput placeholder="Imie" type="text" />
        <ThemedInput placeholder="Nazwisko" type="text" />
        <ThemedInput placeholder="Email" type="email" />
        <ThemedInput placeholder="Hasło" type="password" />
        <ThemedInput placeholder="Powtórz hasło" type="confirmPassword" />
        <ThemedButton title="Wejść" />
      </ThemedView>
        </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  cont: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    color: '#f1f1f1',
  },
});

export default Register;
