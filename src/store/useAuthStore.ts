import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  name?: string;
  mobile: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  setUser: (user: User | null) => void;
  updateUser: (userData: Partial<User>) => void;
  logout: () => void;
}

const AUTH_STORAGE_KEY = 'user-auth-storage';

const saveToStorage = async (user: User | null) => {
  try {
    if (user) {
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch (error) {
    console.error('Error saving auth to storage:', error);
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user) => {
    set({ user, isAuthenticated: true });
    saveToStorage(user);
  },
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  updateUser: (userData) => set(state => {
    const newUser = state.user ? { ...state.user, ...userData } : null;
    saveToStorage(newUser);
    return { user: newUser };
  }),
  logout: () => {
    set({ user: null, isAuthenticated: false });
    saveToStorage(null);
  },
}));
