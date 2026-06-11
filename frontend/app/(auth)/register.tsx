import React, { useState } from 'react';
import { ActionSheetIOS, Alert, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
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
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { UserRound } from 'lucide-react-native';

type RegisterForm = z.infer<typeof registerSchema>;

const Register = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
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
      await signUp(data.username, data.email, data.password, photoUri);
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Register failed');
    }
  };

  const pickFromCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Brak dostępu', 'Aby zrobić zdjęcie, włącz dostęp do aparatu w ustawieniach.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.9,
      aspect: [1, 1],
    });

    if (!result.canceled && result.assets[0]?.uri) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const pickFromGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Brak dostępu', 'Aby wybrać zdjęcie, włącz dostęp do galerii w ustawieniach.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.9,
      aspect: [1, 1],
    });

    if (!result.canceled && result.assets[0]?.uri) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const pickFromFiles = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'image/*',
      copyToCacheDirectory: true,
      multiple: false,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const openPhotoOptions = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take a photo', 'Choose from gallery', 'Choose from files'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            void pickFromCamera();
          }
          if (buttonIndex === 2) {
            void pickFromGallery();
          }
          if (buttonIndex === 3) {
            void pickFromFiles();
          }
        }
      );
      return;
    }

    Alert.alert('Add photo', 'Choose source', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Take a photo', onPress: () => void pickFromCamera() },
      { text: 'Choose from gallery', onPress: () => void pickFromGallery() },
      { text: 'Choose from files', onPress: () => void pickFromFiles() },
    ]);
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
            <ThemedText type="title" style={{ marginBottom: 40, color: Colors.common.tint }}>Rejestracja</ThemedText>
            <View style={styles.formContainer}>
              <Pressable onPress={openPhotoOptions} style={styles.photoPressable}>
                <View style={styles.photoCircle}>
                  {photoUri ? (
                    <Image source={{ uri: photoUri }} style={styles.photoPreview} contentFit="cover" />
                  ) : (
                    <UserRound size={100} color="#F0F0F0" strokeWidth={1} />
                  )}
                </View>
                <View style={styles.photoRow}>
                  <ThemedText style={styles.photoLabel}>Dodaj zdjęcie</ThemedText>
                </View>
              </Pressable>

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
    gap: 16,
    width: '100%',
    alignItems: 'center',
  },
  inputCont: {
    width: '100%',
    gap: 4,
  },
  photoCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#B6B6B6',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  photoLabel: {
    fontSize: 16,
    lineHeight: 16,
    color: '#222222',
  },
  photoPressable: {
    alignItems: 'center',
    gap: 10,
  },
  photoPreview: {
    width: '100%',
    height: '100%',
  },
  photoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
    paddingHorizontal: 20,
  },
});

export default Register;
