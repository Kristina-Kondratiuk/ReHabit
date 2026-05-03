import React, { useState } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableWithoutFeedback } from 'react-native';
import { Link, router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ThemedButton } from '@/components/ui/ThemedButton';
import ThemedInput from '@/components/ui/ThemedInput';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Validation', 'Wpisz login oraz hasło');
      return;
    }

    // try {
    //   setLoading(true);
    //   const response = await authApi.login({ email: email.trim(), password });

    //   Alert.alert('Success', `Zalogowano, ${response.user.username}`);
    //   router.replace('/(tabs)');
    // } catch (error) {
    //   const message = error instanceof Error ? error.message : 'Login failed';
    //   Alert.alert('Login error', message);
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={-100}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}>
          <ThemedView style={styles.cont}>
            <ThemedText type="title" style={{ marginBottom: 40 }}>Logowanie</ThemedText>
            <ThemedInput placeholder="Email" type="email" value={email} onChangeText={setEmail} autoCapitalize="none" />
            <ThemedInput placeholder="Password" type="password" value={password} onChangeText={setPassword} autoCapitalize="none" />
            <ThemedButton title={loading ? 'Loading...' : 'Wejść'} onPress={handleLogin} disabled={loading} />
            <Text style={styles.accLink}>Nie masz konta? <Link href={'/register'}style={styles.link}>Zarejestruj się</Link></Text>
          </ThemedView>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  link: {
textDecorationLine: "underline"
  },
  accLink: {
    marginTop: 20,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  cont: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    color: '#f1f1f1',
  },
});
