import React, { createContext, useContext, useEffect } from 'react';

import { login, register, setAuthToken, updateProfile, updateProfilePhoto } from '@/src/services/auth';
import { useUserStore, type Session, type User } from '@/src/store/user-store';

type AuthContextValue = {
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (username: string, email: string, password: string, photoUri?: string | null) => Promise<User>;
  updatePhoto: (photoUri: string | null) => Promise<User>;
  updateUserProfile: (profile: { username?: string; email?: string }) => Promise<User>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const session = useUserStore((state) => state.session);
  const isLoading = useUserStore((state) => state.isLoading);
  const restoreSession = useUserStore((state) => state.restoreSession);
  const setStoredSession = useUserStore((state) => state.setSession);
  const updateStoredUser = useUserStore((state) => state.updateUser);
  const clearStoredSession = useUserStore((state) => state.clearSession);

  useEffect(() => {
    const restoreAuthSession = async () => {
      const restoredSession = await restoreSession();
      setAuthToken(restoredSession?.token ?? null);
    };

    void restoreAuthSession();
  }, [restoreSession]);

  const signIn = async (email: string, password: string) => {
    const response = await login(email, password);
    const token = response?.token;

    if (!token) {
      throw new Error('Brak tokena sesji');
    }

    const user: User = {
      id: response?.user?.id,
      username: response?.user?.username,
      email: response?.user?.email || email,
      photoUri: response?.user?.photoUri ?? null,
    };

    setAuthToken(token);
    const nextSession: Session = { token, user };
    await setStoredSession(nextSession);
    return user;
  };

  const signUp = async (username: string, email: string, password: string, photoUri?: string | null) => {
    const response = await register(username, email, password, photoUri);
    const token = response?.token;

    if (!token) {
      throw new Error('Brak tokena sesji');
    }

    const user: User = {
      id: response?.user?.id,
      username: response?.user?.username || username,
      email: response?.user?.email || email,
      photoUri: response?.user?.photoUri ?? photoUri ?? null,
    };

    setAuthToken(token);
    const nextSession: Session = { token, user };
    await setStoredSession(nextSession);
    return user;
  };

  const updatePhoto = async (photoUri: string | null) => {
    const response = await updateProfilePhoto(photoUri);
    const updatedUser: User = {
      id: response?.user?._id || response?.user?.id || session?.user?.id,
      username: response?.user?.username || session?.user?.username,
      email: response?.user?.email || session?.user?.email,
      photoUri: response?.user?.photoUri ?? null,
    };

    if (!session?.token) {
      return updatedUser;
    }

    return updateStoredUser(updatedUser);
  };

  const updateUserProfile = async (profile: { username?: string; email?: string }) => {
    const response = await updateProfile(profile);
    const updatedUser: User = {
      id: response?.user?._id || response?.user?.id || session?.user?.id,
      username: response?.user?.username || session?.user?.username,
      email: response?.user?.email || session?.user?.email,
      photoUri: response?.user?.photoUri ?? null,
    };

    if (!session?.token) {
      return updatedUser;
    }

    return updateStoredUser(updatedUser);
  };

  const signOut = () => {
    setAuthToken(null);
    void clearStoredSession();
  };

  const value: AuthContextValue = {
    session,
    isLoading,
    signIn,
    signUp,
    updatePhoto,
    updateUserProfile,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
