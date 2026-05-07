import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCartStore } from './src/store/useCartStore';
import { useAuthStore } from './src/store/useAuthStore';
import { useOrderStore } from './src/store/useOrderStore';

import { ApolloProvider } from '@apollo/client/react';
import client from './src/config/apollo';

export default function App() {
  const { setItems } = useCartStore();
  const { setUser } = useAuthStore();
  const { setOrders } = useOrderStore();

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

        // Load Orders
        const savedOrders = await AsyncStorage.getItem('user-orders-storage');
        if (savedOrders) {
          setOrders(JSON.parse(savedOrders));
        }

        // Load Saved Address
        const { setSavedAddress } = useAuthStore.getState();
        const savedAddress = await AsyncStorage.getItem('user-auth-address');
        if (savedAddress) {
          setSavedAddress(JSON.parse(savedAddress));
        }
      } catch (error) {
        console.error('Failed to initialize app from storage:', error);
      }
    };
    initializeApp();
  }, []);

  return (
    <SafeAreaProvider>
      <ApolloProvider client={client}>
        <RootNavigator />
      </ApolloProvider>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}


