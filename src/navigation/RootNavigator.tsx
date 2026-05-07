import React from 'react';
import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { HomeScreen } from '../screens/main/HomeScreen';
import { ProductDetailScreen } from '../screens/main/ProductDetailScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { SignUpScreen } from '../screens/auth/SignUpScreen';
import { OTPVerificationScreen } from '../screens/auth/OTPVerificationScreen';
import { CartScreen } from '../screens/main/CartScreen';
import { ProfileScreen } from '../screens/main/ProfileScreen';
import { CheckoutScreen } from '../screens/main/CheckoutScreen';
import { OrdersScreen } from '../screens/main/OrdersScreen';
import { GQLProductsScreen } from '../screens/main/GQLProductsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['http://localhost:8081', 'ecommerce://'],
  config: {
    screens: {
      Home: '',
      Login: 'login',
      SignUp: 'signup',
      OTPVerification: 'verify',
      ProductDetail: 'product/:productId',
      Cart: 'cart',
      Profile: 'profile',
      Checkout: 'checkout',
      Orders: 'orders',
      GQLProducts: 'gql-products',
    },
  },
};

export const RootNavigator = () => {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen name="Orders" component={OrdersScreen} />
        <Stack.Screen name="GQLProducts" component={GQLProductsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
