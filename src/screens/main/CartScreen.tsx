import React from 'react';
import {
  View, Text, StyleSheet, FlatList, Image,
  TouchableOpacity, SafeAreaView, ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useCartStore, CartItem } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { MainLayout } from '../../components/MainLayout';
import { RootNavigationProp } from '../../navigation/types';
import { ENV } from '../../config/env';

export const CartScreen = () => {
  const navigation = useNavigation<RootNavigationProp>();
  const { items, addItem, removeItem, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleCheckout = () => {
    // Check if user is logged in
    if (isAuthenticated) {
      // If logged in, proceed to checkout
      navigation.navigate('Checkout');
    } else {
      // If not logged in, redirect to login and pass redirect param
      navigation.navigate('Login', { redirectTo: 'Checkout' });
    }
  };

  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.thumbnail }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.itemPrice}>{ENV.CURRENCY_SYMBOL}{item.price.toFixed(2)}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            onPress={() => item.quantity > 1 ? addItem({ ...item, quantity: -1 }) : removeItem(item.id)}
            style={styles.quantityBtn}
          >
            <Ionicons name="remove" size={18} color="#64748b" />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity 
            onPress={() => addItem({ ...item, quantity: 1 })}
            style={styles.quantityBtn}
          >
            <Ionicons name="add" size={18} color="#64748b" />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity onPress={() => removeItem(item.id)} style={styles.removeBtn}>
        <Ionicons name="trash-outline" size={20} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <MainLayout showSearch={false} showCategories={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTitleContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={24} color="#0f172a" />
            </TouchableOpacity>
            <Text style={styles.title}>Your Cart ({items.length})</Text>
          </View>
          {items.length > 0 && (
            <TouchableOpacity onPress={() => clearCart()}>
              <Text style={styles.clearText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>

        {items.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="cart-outline" size={80} color="#cbd5e1" />
            <Text style={styles.emptyText}>Your cart is empty</Text>
            <TouchableOpacity 
              style={styles.shopBtn}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.shopBtnText}>Continue Shopping</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.content}>
            <FlatList
              data={items}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.listContent}
            />
            
            <View style={styles.footer}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>{ENV.CURRENCY_SYMBOL}{subtotal.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Shipping</Text>
                <Text style={styles.summaryValue}>Free</Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>{ENV.CURRENCY_SYMBOL}{subtotal.toFixed(2)}</Text>
              </View>
              
              <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
                <Text style={styles.checkoutText}>Proceed to Checkout</Text>
                <Ionicons name="arrow-forward" size={20} color="#ffffff" style={{ marginLeft: 8 }} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    width: '100%',
    maxWidth: 1000,
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    padding: 4,
  },
  clearText: {
    color: '#ef4444',
    fontWeight: '600',
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 16,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6366f1',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    alignSelf: 'flex-start',
    borderRadius: 8,
    padding: 4,
  },
  quantityBtn: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 6,
  },
  quantityText: {
    paddingHorizontal: 12,
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  removeBtn: {
    padding: 8,
  },
  footer: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    color: '#64748b',
    fontSize: 15,
  },
  summaryValue: {
    color: '#0f172a',
    fontSize: 15,
    fontWeight: '600',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    marginBottom: 24,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  totalValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#6366f1',
  },
  checkoutBtn: {
    backgroundColor: '#6366f1',
    paddingVertical: 18,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkoutText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#64748b',
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 32,
  },
  shopBtn: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  shopBtnText: {
    color: '#ffffff',
    fontWeight: '700',
  },
});
