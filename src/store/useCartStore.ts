import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useToastStore } from './useToastStore';

export interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  thumbnail: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  setItems: (items: CartItem[]) => void;
  clearCart: () => void;
  getTotalItems: () => number;
}

const CART_STORAGE_KEY = 'shopping-cart-storage';

const saveToStorage = async (items: CartItem[]) => {
  try {
    await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving cart to storage:', error);
  }
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  setItems: (items) => set({ items }),
  addItem: (item) => set((state) => {
    let newItems;
    const existingItem = state.items.find((i) => i.id === item.id);
    if (existingItem) {
      const newQuantity = existingItem.quantity + item.quantity;
      if (newQuantity <= 0) {
        newItems = state.items.filter((i) => i.id !== item.id);
      } else {
        newItems = state.items.map((i) =>
          i.id === item.id ? { ...i, quantity: newQuantity } : i
        );
      }
    } else {
      if (state.items.length >= 10) {
        useToastStore.getState().showToast('Cart limit reached (max 10 items)', 'error');
        return { items: state.items };
      }
      newItems = [...state.items, item];
      useToastStore.getState().showToast('Added to cart', 'success');
    }
    saveToStorage(newItems);
    return { items: newItems };
  }),
  removeItem: (id) => set((state) => {
    const newItems = state.items.filter((i) => i.id !== id);
    saveToStorage(newItems);
    return { items: newItems };
  }),
  clearCart: () => {
    const newItems: CartItem[] = [];
    saveToStorage(newItems);
    set({ items: newItems });
    useToastStore.getState().showToast('Cart cleared', 'info');
  },
  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },
}));
