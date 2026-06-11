import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

import { login, register, setAuthToken, updateProfilePhoto } from '@/src/services/auth';

type User = {
  id?: string;
  username?: string;
  email?: string;
  photoUri?: string | null;
};

type Session = {
  token: string;
  user: User;
};

type AuthContextValue = {
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (username: string, email: string, password: string, photoUri?: string | null) => Promise<User>;
  updatePhoto: (photoUri: string | null) => Promise<User>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const SESSION_STORAGE_KEY = 'rehabit.session';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const rawSession = await AsyncStorage.getItem(SESSION_STORAGE_KEY);
        if (!rawSession) {
          return;
        }

        const parsedSession = JSON.parse(rawSession) as Session | null;

        if (parsedSession?.token) {
          setAuthToken(parsedSession.token);
          setSession(parsedSession);
        }
      } catch {
        setAuthToken(null);
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    };

    void restoreSession();
  }, []);

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
    setSession(nextSession);
    await AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(nextSession));
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
    setSession(nextSession);
    await AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(nextSession));
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

    const nextSession: Session = {
      token: session.token,
      user: updatedUser,
    };

    setSession(nextSession);
    await AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(nextSession));
    return updatedUser;
  };

  const signOut = () => {
    setAuthToken(null);
    setSession(null);
    void AsyncStorage.removeItem(SESSION_STORAGE_KEY);
  };

  const value: AuthContextValue = {
    session,
    isLoading,
    signIn,
    signUp,
    updatePhoto,
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
