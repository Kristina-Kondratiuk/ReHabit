import React from "react";
import { Keyboard, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { ThemedButton } from "@/components/ui/ThemedButton";
import ThemedInput from "@/components/ui/ThemedInput";

export default function Login() {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView style={styles.cont}>
        <ThemedText type="title" style={{ marginBottom: 40 }}>Logowanie</ThemedText>
        <ThemedInput placeholder="Email" type="email" />
        <ThemedInput placeholder="Password" type="password" />
        <ThemedButton title="Wejść" />
      </ThemedView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  cont: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    color: '#f1f1f1',
  },
});
