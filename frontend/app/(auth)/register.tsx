import React, { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { Link } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedButton } from '@/components/ui/ThemedButton';
import ThemedInput from '@/components/ui/ThemedInput';
import { useAuth } from '@/src/context/auth-context';
import { registerSchema } from '@/src/validation/authSchemas';
import { z } from 'zod';
import { Colors } from '@/constants/theme';

type RegisterForm = z.infer<typeof registerSchema>;

const Register = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const { signUp } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      setServerError(null);
      await signUp(data.username, data.email, data.password);
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Register failed');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={-130}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}>
          <ThemedView style={styles.cont}>
            <ThemedText type="title" style={{ marginBottom: 40, color: Colors.common.tint }}>Rejestracja</ThemedText>
            <View style={styles.formContainer}>

              <View style={styles.inputCont}>
                <Controller
                  control={control}
                  name="username"
                  render={({ field: { onChange, value } }) => (
                    <ThemedInput
                      placeholder="Username"
                      type="text"
                      value={value}
                      onChangeText={onChange}
                    />
                  )}
                />
                {errors.username ? <Text style={styles.errorText}>{errors.username.message}</Text> : null}
              </View>

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
                      placeholder="Hasło"
                      type="password"
                      value={value}
                      onChangeText={onChange}
                      autoCapitalize="none"
                      autoComplete="off"
                      textContentType="none"
                      autoCorrect={false}
                    />
                  )}
                />
                {errors.password ? <Text style={styles.errorText}>{errors.password.message}</Text> : null}
              </View>

              <View style={styles.inputCont}>
                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field: { onChange, value } }) => (
                    <ThemedInput
                      placeholder="Powtórz hasło"
                      type="confirmPassword"
                      value={value}
                      onChangeText={onChange}
                      autoCapitalize="none"
                      autoComplete="off"
                      textContentType="none"
                      autoCorrect={false}
                    />
                  )}
                />
                {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword.message}</Text> : null}
              </View>

              {serverError ? <Text style={styles.errorText}>{serverError}</Text> : null}

              <ThemedButton
                title={isSubmitting ? 'Loading...' : 'Zarejestruj się'}
                onPress={handleSubmit(onSubmit)}
                disabled={isSubmitting}
              />
              <ThemedText type='link'>
                Masz już konto? <Link href={'/(auth)/login'} style={styles.link}>Zaloguj się</Link>
              </ThemedText>

            </View>
          </ThemedView>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

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
    color: Colors.common.error,
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

export default Register;
