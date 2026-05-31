import React, { createContext, useContext, useMemo, useState } from 'react';

import { login, register, setAuthToken } from '@/src/services/auth';

type User = {
  username?: string;
  email?: string;
};

type Session = {
  token: string;
  user: User;
};

type AuthContextValue = {
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (username: string, email: string, password: string) => Promise<User>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);

  const signIn = async (email: string, password: string) => {
    const response = await login(email, password);
    const token = response?.token;

    if (!token) {
      throw new Error('Brak tokena sesji');
    }

    const user: User = {
      username: response?.user?.username,
      email: response?.user?.email || email,
    };

    setAuthToken(token);
    setSession({ token, user });
    return user;
  };

  const signUp = async (username: string, email: string, password: string) => {
    const response = await register(username, email, password);
    const token = response?.token;

    if (!token) {
      throw new Error('Brak tokena sesji');
    }

    const user: User = {
      username: response?.user?.username || username,
      email: response?.user?.email || email,
    };

    setAuthToken(token);
    setSession({ token, user });
    return user;
  };

  const signOut = () => {
    setAuthToken(null);
    setSession(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isLoading: false,
      signIn,
      signUp,
      signOut,
    }),
    [session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
