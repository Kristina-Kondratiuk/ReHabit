import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

export type User = {
  id?: string;
  username?: string;
  email?: string;
  photoUri?: string | null;
};

export type Session = {
  token: string;
  user: User;
};

type UserStore = {
  session: Session | null;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  restoreSession: () => Promise<Session | null>;
  setSession: (session: Session) => Promise<void>;
  updateUser: (user: User) => Promise<User>;
  clearSession: () => Promise<void>;
};

const SESSION_STORAGE_KEY = 'rehabit.session';

const emptySessionState = {
  session: null,
  user: null,
  token: null,
};

export const useUserStore = create<UserStore>((set, get) => ({
  ...emptySessionState,
  isLoading: true,

  restoreSession: async () => {
    try {
      const rawSession = await AsyncStorage.getItem(SESSION_STORAGE_KEY);

      if (!rawSession) {
        set({ ...emptySessionState, isLoading: false });
        return null;
      }

      const parsedSession = JSON.parse(rawSession) as Session | null;

      if (!parsedSession?.token || !parsedSession.user) {
        await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
        set({ ...emptySessionState, isLoading: false });
        return null;
      }

      set({
        session: parsedSession,
        user: parsedSession.user,
        token: parsedSession.token,
        isLoading: false,
      });

      return parsedSession;
    } catch {
      await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
      set({ ...emptySessionState, isLoading: false });
      return null;
    }
  },

  setSession: async (session) => {
    set({
      session,
      user: session.user,
      token: session.token,
      isLoading: false,
    });

    await AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  },

  updateUser: async (user) => {
    const currentSession = get().session;

    if (!currentSession) {
      set({ user });
      return user;
    }

    const nextSession = {
      ...currentSession,
      user,
    };

    set({
      session: nextSession,
      user,
      token: nextSession.token,
      isLoading: false,
    });

    await AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(nextSession));
    return user;
  },

  clearSession: async () => {
    set({ ...emptySessionState, isLoading: false });
    await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
  },
}));
