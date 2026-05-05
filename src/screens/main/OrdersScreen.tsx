import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, FlatList, Image, 
  TouchableOpacity, ScrollView 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useOrderStore, Order, getOrderStatus } from '../../store/useOrderStore';
import { MainLayout } from '../../components/MainLayout';
import { RootNavigationProp } from '../../navigation/types';
import { Ionicons } from '@expo/vector-icons';

export const OrdersScreen = () => {
  const navigation = useNavigation<RootNavigationProp>();
  const { orders } = useOrderStore();
  const [, setTick] = useState(0);

  // Re-render every 30 seconds to update statuses
  useEffect(() => {
    const timer = setInterval(() => {
      setTick(t => t + 1);
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderOrderCard = ({ item }: { item: Order }) => {
    const currentStatus = getOrderStatus(item.date, item.status);
    
    return (
      <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderId}>{item.id}</Text>
            <Text style={styles.orderDate}>{formatDate(item.date)}</Text>
          </View>
          <View style={[styles.statusBadge, styles[`status${currentStatus}`]]}>
            <Text style={[styles.statusText, styles[`statusText${currentStatus}`]]}>
              {currentStatus}
            </Text>
          </View>
        </View>

        <View style={styles.itemsPreview}>
          {item.items.slice(0, 3).map((cartItem, index) => (
            <Image 
              key={`${item.id}-item-${index}`}
              source={{ uri: cartItem.thumbnail }} 
              style={styles.itemThumb} 
            />
          ))}
          {item.items.length > 3 && (
            <View style={styles.moreItems}>
              <Text style={styles.moreItemsText}>+{item.items.length - 3}</Text>
            </View>
          )}
        </View>

        <View style={styles.orderFooter}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalValue}>${item.total.toFixed(2)}</Text>
        </View>
      </View>
    );
  };

  return (
    <MainLayout showSearch={false} showCategories={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#0f172a" />
          </TouchableOpacity>
          <Text style={styles.title}>My Orders</Text>
        </View>

        {orders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconBg}>
              <Ionicons name="receipt-outline" size={60} color="#6366f1" />
            </View>
            <Text style={styles.emptyTitle}>No orders yet</Text>
            <Text style={styles.emptySubtitle}>When you place an order, it will appear here.</Text>
            <TouchableOpacity 
              style={styles.shopBtn}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.shopBtnText}>Start Shopping</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={orders}
            renderItem={renderOrderCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#ffffff',
    gap: 16,
  },
  backBtn: { padding: 4 },
  title: { fontSize: 24, fontWeight: '800', color: '#0f172a' },
  listContent: { padding: 16, paddingBottom: 40 },
  orderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  orderId: { fontSize: 15, fontWeight: '700', color: '#0f172a', marginBottom: 4 },
  orderDate: { fontSize: 13, color: '#64748b', fontWeight: '500' },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  statusText: { fontSize: 12, fontWeight: '700' },
  statusProcessing: { backgroundColor: '#fef3c7' },
  statusTextProcessing: { color: '#d97706' },
  statusShipped: { backgroundColor: '#e0f2fe' },
  statusTextShipped: { color: '#0284c7' },
  statusCompleted: { backgroundColor: '#dcfce7' },
  statusTextCompleted: { color: '#16a34a' },
  statusCancelled: { backgroundColor: '#fee2e2' },
  statusTextCancelled: { color: '#dc2626' },
  itemsPreview: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  itemThumb: { width: 48, height: 48, borderRadius: 10, backgroundColor: '#f8fafc' },
  moreItems: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreItemsText: { fontSize: 14, fontWeight: '700', color: '#64748b' },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  totalLabel: { fontSize: 14, color: '#64748b', fontWeight: '600' },
  totalValue: { fontSize: 18, fontWeight: '800', color: '#6366f1' },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIconBg: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f3f4ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: { fontSize: 22, fontWeight: '800', color: '#0f172a', marginBottom: 8 },
  emptySubtitle: { 
    fontSize: 16, 
    color: '#64748b', 
    textAlign: 'center', 
    marginBottom: 32,
    lineHeight: 24,
  },
  shopBtn: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  shopBtnText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
});
