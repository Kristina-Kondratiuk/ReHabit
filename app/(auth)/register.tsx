import React, { useState } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableWithoutFeedback } from 'react-native';
import { Link, router } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedButton } from '@/components/ui/ThemedButton';
import ThemedInput from '@/components/ui/ThemedInput';
import { authApi } from '@/lib/api';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Validation', 'Wypełni wszystkie pola');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Validation', 'Hasła nie pasują do siebie');
      return;
    }

    try {
      setLoading(true);
      const response = await authApi.register({
        username: username.trim(),
        email: email.trim(),
        password,
      });

      Alert.alert('Success', `Konto utworzone!: ${response.user.username}`);
      router.replace('/(tabs)');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Register failed';
      Alert.alert('Register error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}>
          <ThemedView style={styles.cont}>
            <ThemedText type="title" style={{ marginBottom: 40 }}>Rejestracja</ThemedText>
            <ThemedInput placeholder="Username" type="text" value={username} onChangeText={setUsername} />
            <ThemedInput placeholder="Email" type="email" value={email} onChangeText={setEmail} autoCapitalize="none" />
            <ThemedInput placeholder="Hasło" autoComplete="off"
              textContentType="none"
              autoCorrect={false} type="password" value={password} onChangeText={setPassword} autoCapitalize="none" />
            <ThemedInput placeholder="Powtórz hasło" autoComplete="off"
              textContentType="none"
              autoCorrect={false} type="confirmPassword" value={confirmPassword} onChangeText={setConfirmPassword} autoCapitalize="none" />
            <ThemedButton title={loading ? 'Loading...' : 'Wejść'} onPress={handleRegister} disabled={loading} />
            <Text style={styles.accLink}>Masz już konto? <Link href={'/login'} style={styles.link}>Zaloguj się</Link></Text>
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
    marginTop: 20
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

export default Register;
