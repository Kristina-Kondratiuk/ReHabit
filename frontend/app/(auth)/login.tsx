import React, { useState } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { Link, router } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ThemedButton } from '@/components/ui/ThemedButton';
import ThemedInput from '@/components/ui/ThemedInput';
import { login } from '@/src/services/auth';
import { loginSchema } from '@/src/validation/authSchemas';
import { z } from 'zod';
import { Colors } from '@/constants/theme';

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setServerError(null);
      const response = await login(data.email, data.password);
      const username = response?.user?.username || 'user';
      Alert.alert('Success', `Zalogowano, ${username}`);
      router.replace('/(tabs)');
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Login failed');
    }
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
            <ThemedText type="title" style={{ marginBottom: 40, color: Colors.light.tint }}>Logowanie</ThemedText>
            <View style={styles.formContainer}>

              <View style={styles.inputCont}>
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, value } }) => (
                    <ThemedInput
                      placeholder="Email"
                      type="email"
                      value={value}
                      onChangeText={onChange}
                      autoCapitalize="none"
                    />
                  )}
                />
                {errors.email ? <Text style={styles.errorText}>{errors.email.message}</Text> : null}
              </View>

              <View style={styles.inputCont}>
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, value } }) => (
                    <ThemedInput
                      placeholder="Password"
                      type="password"
                      value={value}
                      onChangeText={onChange}
                      autoCapitalize="none"
                    />
                  )}
                />
                {errors.password ? <Text style={styles.errorText}>{errors.password.message}</Text> : null}
              </View>

              {serverError ? <Text style={styles.errorText}>{serverError}</Text> : null}

              <ThemedButton
                title={isSubmitting ? 'Loading...' : 'Wejść'}
                onPress={handleSubmit(onSubmit)}
                disabled={isSubmitting}
              />
              <ThemedText type='link'>
                Nie masz konta? <Link href={'/(auth)/register'} style={styles.link}>Zarejestruj się</Link>
              </ThemedText>

            </View>
          </ThemedView>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  link: {
    textDecorationLine: 'underline',
  },
  formContainer: {
    gap: 24,
    width: '100%',
    alignItems: 'center',
  },
  inputCont: {
    width: '100%',
    gap: 4,
  },
  errorText: {
    width: '100%',
    color: '#DC2626',
    fontSize: 12,
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
  },
});