import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCartStore } from './src/store/useCartStore';
import { useAuthStore } from './src/store/useAuthStore';

export default function App() {
  const { setItems } = useCartStore();
  const { setUser } = useAuthStore();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Load Cart
        const savedCart = await AsyncStorage.getItem('shopping-cart-storage');
        if (savedCart) {
          setItems(JSON.parse(savedCart));
        }

        // Load Auth
        const savedUser = await AsyncStorage.getItem('user-auth-storage');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Failed to initialize app from storage:', error);
      }
    };
    initializeApp();
  }, []);

  return (
    <SafeAreaProvider>
      <RootNavigator />
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}


