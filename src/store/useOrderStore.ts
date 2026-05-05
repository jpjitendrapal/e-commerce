import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem } from './useCartStore';

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
}

interface OrderState {
  orders: Order[];
  addOrder: (order: Order) => void;
  setOrders: (orders: Order[]) => void;
  clearOrders: () => void;
}

const ORDERS_STORAGE_KEY = 'user-orders-storage';

const saveToStorage = async (orders: Order[]) => {
  try {
    await AsyncStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  } catch (error) {
    console.error('Error saving orders to storage:', error);
  }
};

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  setOrders: (orders) => set({ orders }),
  addOrder: (order) => set((state) => {
    const newOrders = [order, ...state.orders];
    saveToStorage(newOrders);
    return { orders: newOrders };
  }),
  clearOrders: () => {
    set({ orders: [] });
    AsyncStorage.removeItem(ORDERS_STORAGE_KEY);
  },
}));
