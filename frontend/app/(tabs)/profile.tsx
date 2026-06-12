import React, { useEffect, useState } from 'react';
import { Alert, Keyboard, Pressable, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import {
  ArrowLeft,
  Camera,
  LogOut,
  Moon,
  Pencil,
  Smartphone,
  Sun,
  Trash2,
  UserRound,
  UserRoundCog,
} from 'lucide-react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ProfileMenuButton } from '@/components/ui/profile-menu-button';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/src/context/auth-context';
import { useThemeStore } from '@/src/store/theme-store';
import { getDisplayPhotoUri, saveProfilePhotoToDevice, shouldUnmirrorPhoto } from '@/src/utils/profile-photo';

type ProfileView = 'main' | 'settings' | 'theme' ;

const goalText = 'Każdy dzień to krok do celu✨';

const splitUsername = (username: string) => {
  const [firstName, ...rest] = username.trim().split(' ');

  return {
    firstName: firstName || 'Kamila',
    lastName: rest.join(' ') || 'Kowalska',
  };
};

export default function Profile() {
  const themeName = useColorScheme() ?? 'light';
  const theme = Colors[themeName];
  const { session, signOut, updatePhoto, updateUserProfile } = useAuth();
  const themePreference = useThemeStore((state) => state.preference);
  const setThemePreference = useThemeStore((state) => state.setThemePreference);
  const username = session?.user?.username || 'Kamila Kowalska';
  const email = session?.user?.email || 'kamila3456@gmail.com';
  const initialName = splitUsername(username);

  const [activeView, setActiveView] = useState<ProfileView>('main');
  const [currentPhotoUri, setCurrentPhotoUri] = useState<string | null>(session?.user?.photoUri ?? null);
  const [firstName, setFirstName] = useState(initialName.firstName);
  const [lastName, setLastName] = useState(initialName.lastName);
  const [emailValue, setEmailValue] = useState(email);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  useEffect(() => {
    setCurrentPhotoUri(session?.user?.photoUri ?? null);
  }, [session?.user?.photoUri]);

  const handleDeleteAccount = () => {
    Alert.alert('Usunięcie konta', 'Ta akcja będzie dostępna w kolejnej wersji.');
  };

  const handleSaveProfile = async () => {
    try {
      setIsSavingProfile(true);
      const nextUsername = `${firstName.trim()} ${lastName.trim()}`.trim();
      const nextEmail = emailValue.trim();

      const updatedUser = await updateUserProfile({
        username: nextUsername,
        email: nextEmail,
      });

      const updatedName = splitUsername(updatedUser.username || nextUsername);
      setFirstName(updatedName.firstName);
      setLastName(updatedName.lastName);
      setEmailValue(updatedUser.email || nextEmail);
      setCurrentPhotoUri(updatedUser.photoUri ?? currentPhotoUri);

      Alert.alert('Zapisano', 'Zmiany profilu zostały zapisane.');
    } catch (error) {
      Alert.alert('Błąd', error instanceof Error ? error.message : 'Nie udało się zapisać zmian profilu.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const savePickedPhoto = async (nextPhotoUri: string) => {
    const previousPhotoUri = currentPhotoUri;

    setCurrentPhotoUri(nextPhotoUri);

    try {
      const updatedUser = await updatePhoto(nextPhotoUri);
      setCurrentPhotoUri(updatedUser.photoUri ?? nextPhotoUri);
    } catch (error) {
      setCurrentPhotoUri(previousPhotoUri);
      Alert.alert('Błąd', error instanceof Error ? error.message : 'Nie udało się zaktualizować zdjęcia.');
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
      cameraType: ImagePicker.CameraType.front,
      quality: 0.9,
      aspect: [1, 1],
    });

    if (!result.canceled && result.assets[0]?.uri) {
      const savedPhotoUri = await saveProfilePhotoToDevice(result.assets[0].uri, { frontCamera: true });
      await savePickedPhoto(savedPhotoUri);
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
      quality: 0.8,
      aspect: [1, 1],
    });

    if (!result.canceled && result.assets[0]?.uri) {
      const savedPhotoUri = await saveProfilePhotoToDevice(result.assets[0].uri);
      await savePickedPhoto(savedPhotoUri);
    }
  };

  const openPhotoOptions = () => {
    Alert.alert('Zmień zdjęcie', 'Wybierz źródło', [
      { text: 'Anuluj', style: 'cancel' },
      { text: 'Zrób zdjęcie', onPress: () => void pickFromCamera() },
      { text: 'Wybierz z galerii', onPress: () => void pickFromGallery() },
    ]);
  };

  if (activeView === 'settings') {
    return (
      <ProfileShell>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.keyboardDismissArea}>
            <BackHeader title="Ustawienia profilu" onBack={() => setActiveView('main')} />
            <Avatar editable uri={currentPhotoUri} onEditPhoto={openPhotoOptions} />

            <View style={styles.goalEditPill}>
              <ThemedText style={styles.goalText}>{goalText}</ThemedText>
              <Pencil color={Colors.common.tint} size={16} strokeWidth={1.7} />
            </View>

            <View style={styles.form}>
              <ProfileInput label="Imię" value={firstName} onChangeText={setFirstName} />
              <ProfileInput label="Nazwisko" value={lastName} onChangeText={setLastName} />
            </View>

            <Pressable
              accessibilityRole="button"
              onPress={() => void handleSaveProfile()}
              style={[styles.primaryButton, isSavingProfile ? styles.primaryButtonDisabled : undefined]}
              disabled={isSavingProfile}
            >
              <Text style={styles.primaryButtonText}>{isSavingProfile ? 'Zapisywanie...' : 'Zapisz zmiany'}</Text>
            </Pressable>
          </View>
        </TouchableWithoutFeedback>
      </ProfileShell>
    );
  }

  if (activeView === 'theme') {
    return (
      <ProfileShell>
        <BackHeader title="Motyw aplikacji" onBack={() => setActiveView('main')} />

        <View style={styles.optionList}>
          <ThemeOption
            title="Kolor systemu"
            icon={Smartphone}
            selected={themePreference === 'system'}
            onPress={() => void setThemePreference('system')}
          />
          <ThemeOption
            title="Ciemny"
            icon={Moon}
            selected={themePreference === 'dark'}
            onPress={() => void setThemePreference('dark')}
          />
          <ThemeOption
            title="Jasny"
            icon={Sun}
            selected={themePreference === 'light'}
            onPress={() => void setThemePreference('light')}
          />
        </View>
      </ProfileShell>
    );
  }

  return (
    <ProfileShell>
      <View style={styles.mainHeader}>
        <ThemedText type="subtitle" style={styles.title}>
          Mój profil
        </ThemedText>
      </View>

      <Avatar uri={currentPhotoUri} />

      <View style={styles.goalPill}>
        <ThemedText style={styles.goalText}>{goalText}</ThemedText>
      </View>

      <View style={styles.menuSection}>
        <ThemedText type="defaultSemiBold" style={[styles.sectionTitle, { color: theme.descr }]}>
          Zarządzanie profilem
        </ThemedText>
        <ProfileMenuButton icon={UserRoundCog} title="Ustawienia profilu" onPress={() => setActiveView('settings')} />
        <ProfileMenuButton icon={Moon} title="Motyw aplikacji" onPress={() => setActiveView('theme')} />
        <ProfileMenuButton icon={LogOut} title="Wyloguj się" onPress={signOut} />
        <ProfileMenuButton icon={Trash2} title="Usunięcie konta" danger onPress={handleDeleteAccount} />
      </View>
    </ProfileShell>
  );
}

function ProfileShell({ children }: { children: React.ReactNode }) {
  return (
    <ThemedView style={styles.screen}>
      <ThemedView style={styles.content}>{children}</ThemedView>
    </ThemedView>
  );
}

function BackHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <View style={styles.backHeader}>
      <Pressable accessibilityRole="button" onPress={onBack} style={styles.backButton}>
        <ArrowLeft color={Colors.common.tint} size={28} strokeWidth={1.6} />
      </Pressable>
      <ThemedText type="subtitle" style={styles.headerTitle}>
        {title}
      </ThemedText>
    </View>
  );
}

function Avatar({
  editable = false,
  uri,
  onEditPhoto,
}: {
  editable?: boolean;
  uri: string | null;
  onEditPhoto?: () => void;
}) {
  return (
    <View style={styles.avatarWrap}>
      {uri ? (
        <Image
          source={{ uri: getDisplayPhotoUri(uri) }}
          style={[styles.avatar, shouldUnmirrorPhoto(uri) ? styles.unmirroredPhoto : undefined]}
          contentFit="cover"
        />
      ) : (
        <UserRound size={100} color="#F0F0F0" strokeWidth={1} />
      )}
      {editable ? (
        <Pressable accessibilityRole="button" onPress={onEditPhoto} style={styles.cameraButton}>
          <Camera color={Colors.common.white} size={16} strokeWidth={1.8} />
        </Pressable>
      ) : null}
    </View>
  );
}

function ProfileInput({
  label,
  value,
  onChangeText,
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  keyboardType?: 'default' | 'email-address';
}) {
  const themeName = useColorScheme() ?? 'light';
  const theme = Colors[themeName];
  const surfaceColor = themeName === 'dark' ? Colors.dark.grey : Colors.common.white;

  return (
    <View style={styles.inputGroup}>
      <Text style={[styles.inputLabel, { color: theme.descr }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize={keyboardType === 'email-address' ? 'none' : 'words'}
        style={[
          styles.inputField,
          { backgroundColor: surfaceColor, color: Colors.common.tint, borderColor: Colors.common.tint },
        ]}
        placeholderTextColor={theme.descr}
      />
    </View>
  );
}

function ThemeOption({
  title,
  icon: Icon,
  selected,
  onPress,
}: {
  title: string;
  icon: React.ComponentType<{ color?: string; size?: number; strokeWidth?: number }>;
  selected: boolean;
  onPress: () => void;
}) {
  const themeName = useColorScheme() ?? 'light';
  const isDark = themeName === 'dark';
  const surfaceColor = isDark ? '#17111F' : Colors.common.white;
  const borderColor = selected ? '#D7A7FF' : isDark ? '#2A2A2A' : '#E4E4E4';
  const textColor = selected ? Colors.common.tint : isDark ? Colors.common.textDark : Colors.common.black;
  const iconColor = selected ? Colors.common.tint : Colors.common.white;

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={[
        styles.themeOption,
        { backgroundColor: surfaceColor, borderColor },
        isDark ? styles.darkGlow : undefined,
        selected ? styles.themeOptionSelected : undefined,
      ]}
    >
      <View style={[styles.menuIcon, selected ? styles.themeIconSelected : styles.themeIconDark]}>
        <Icon color={iconColor} size={18} strokeWidth={1.8} />
      </View>
      <Text style={[styles.themeOptionText, { color: textColor }]}>{title}</Text>
      <View style={[styles.radio, selected ? styles.radioSelected : undefined]}>
        {selected ? <View style={styles.radioDot} /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 104,
    height: 104,
    borderRadius: 52,
  },
  unmirroredPhoto: {
    transform: [{ scaleX: -1 }],
  },
  avatarWrap: {
    alignSelf: 'center',
    width: 116,
    height: 116,
    borderRadius: 58,
    borderWidth: 2,
    borderColor: '#E8D6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 22,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  backHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 16,
  },
  cameraButton: {
    position: 'absolute',
    right: 4,
    bottom: 4,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.common.tint,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.common.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 96,
  },
  darkGlow: {
    shadowColor: Colors.common.tint,
    shadowOpacity: 0.16,
    shadowRadius: 5,
    elevation: 3,
  },
  form: {
    gap: 10,
    marginTop: 20,
  },
  goalEditPill: {
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: Colors.common.tint,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  goalPill: {
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: Colors.common.tint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 34,
  },
  goalText: {
    color: Colors.common.tint,
    fontSize: 12,
    lineHeight: 14,
    fontWeight: '700',
  },
  headerTitle: {
    flex: 1,
    color: Colors.common.tint,
    fontSize: 22,
    lineHeight: 26,
  },
  inputField: {
    height: 46,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontFamily: 'Inter',
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '700',
    paddingVertical: 0,
  },
  inputGroup: {
    gap: 6,
    minHeight: 66,
  },
  inputLabel: {
    fontFamily: 'Inter',
    fontSize: 12,
    lineHeight: 14,
    paddingLeft: 8,
  },
  keyboardDismissArea: {
    flex: 1,
  },
  mainHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.common.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E9D8FF',
  },
  menuSection: {
    gap: 10,
  },
  optionList: {
    gap: 12,
    marginTop: 24,
  },
  primaryButton: {
    height: 52,
    borderRadius: 8,
    backgroundColor: Colors.common.tint,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 26,
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: Colors.common.white,
    fontFamily: 'Inter',
    fontSize: 16,
    lineHeight: 18,
    fontWeight: '800',
  },
  radio: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#D9B8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.common.white,
  },
  radioSelected: {
    backgroundColor: Colors.common.tint,
    borderColor: Colors.common.tint,
  },
  screen: {
    flex: 1,
  },
  sectionTitle: {
    marginBottom: 6,
  },
  themeIconDark: {
    backgroundColor: Colors.common.black,
    borderColor: Colors.common.black,
  },
  themeIconSelected: {
    backgroundColor: Colors.common.white,
    borderColor: '#E9D8FF',
  },
  themeOption: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E4E4E4',
    backgroundColor: Colors.common.white,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    shadowColor: Colors.common.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  themeOptionSelected: {
    borderColor: '#D7A7FF',
    shadowColor: Colors.common.tint,
  },
  themeOptionText: {
    flex: 1,
    fontFamily: 'Inter',
    fontSize: 14,
    lineHeight: 16,
    fontWeight: '800',
  },
  title: {
    color: Colors.common.tint,
  },
});
