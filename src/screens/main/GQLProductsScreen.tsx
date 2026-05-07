import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, Image
} from 'react-native';
import { useQuery } from '@apollo/client/react';
import { GET_PRODUCTS } from '../../graphql/queries';
import { MainLayout } from '../../components/MainLayout';
import useDeviceWidth from '../../utils/useDeviceWidth';
import { ENV } from '../../config/env';
import { Ionicons } from '@expo/vector-icons';
import { useCartStore } from '../../store/useCartStore';

export const GQLProductsScreen = () => {
  const deviceWidth = useDeviceWidth();
  const { loading, error, data } = useQuery<any>(GET_PRODUCTS);
  const { addItem, items } = useCartStore();

  const isVeryLargeScreen = deviceWidth === "xl";
  const isLargeScreen = deviceWidth === "lg";
  const isMediumScreen = deviceWidth === "md";

  const cardWidth = isVeryLargeScreen ? '23%' : isLargeScreen ? '32%' : isMediumScreen ? '47%' : '47%';

  const handleAddToCart = (product: any, quantity: number) => {
    addItem({
      id: product.productCode, // Use productCode as ID
      title: product.productName,
      price: product.buyPrice,
      thumbnail: 'https://placehold.co/400x400/png?text=' + product.productName, // Placeholder for thumbnail
      quantity: quantity
    });
  };

  if (error) {
    return (
      <MainLayout>
        <View style={styles.center}>
          <Text style={styles.errorText}>Error loading products: {error.message}</Text>
        </View>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <View style={styles.gridArea}>
        <View style={styles.titleSection}>
          <Text style={styles.gridTitle}>
            MySQL Products (via GQL)
            <Text style={styles.gridCount}> ({data?.products?.length || 0})</Text>
          </Text>
          <View style={styles.accentLine} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer} bounces={true}>
          {loading ? (
            <ActivityIndicator size="large" color="#6366f1" style={{ marginTop: 40 }} />
          ) : data?.products?.length === 0 ? (
            <Text style={styles.noResults}>No products found in MySQL.</Text>
          ) : (
            <View style={styles.gridContainer}>
              {data.products.map((product: any) => (
                <View
                  key={product.productCode}
                  style={[styles.productCard, { width: cardWidth as any }]}
                >
                  <Image 
                    source={{ uri: 'https://placehold.co/400x400/png?text=' + product.productName }} 
                    style={styles.productImage} 
                    resizeMode="cover" 
                  />
                  <View style={styles.productInfo}>
                    <Text style={styles.productBrand} numberOfLines={1}>{product.productVendor}</Text>
                    <Text style={styles.productTitle} numberOfLines={2}>{product.productName}</Text>
                    
                    <View style={styles.priceContainer}>
                      <Text style={styles.productPrice}>{ENV.CURRENCY_SYMBOL}{product.buyPrice.toFixed(2)}</Text>
                    </View>

                    <View style={styles.actionSection}>
                      {items.find(i => i.id === product.productCode) ? (
                        <View style={styles.quantityContainer}>
                          <TouchableOpacity
                            style={styles.qtyBtn}
                            onPress={() => handleAddToCart(product, -1)}
                          >
                            <Ionicons name="remove" size={18} color="#6366f1" />
                          </TouchableOpacity>
                          <Text style={styles.qtyText}>{items.find(i => i.id === product.productCode)?.quantity}</Text>
                          <TouchableOpacity
                            style={styles.qtyBtn}
                            onPress={() => handleAddToCart(product, 1)}
                          >
                            <Ionicons name="add" size={18} color="#6366f1" />
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <TouchableOpacity 
                          style={styles.addToCartBtn}
                          onPress={() => handleAddToCart(product, 1)}
                        >
                          <Ionicons name="cart-outline" size={18} color="#fff" />
                          <Text style={styles.addToCartText}>Add to Cart</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { color: '#ef4444', fontSize: 16, textAlign: 'center' },
  gridArea: { flex: 1 },
  titleSection: { paddingHorizontal: 16, marginTop: 20, marginBottom: 24 },
  gridTitle: { fontSize: 28, fontWeight: '800', color: '#0f172a', letterSpacing: -0.5 },
  gridCount: { fontSize: 18, fontWeight: '600', color: '#94a3b8' },
  accentLine: { width: 40, height: 4, backgroundColor: '#6366f1', borderRadius: 2, marginTop: 8 },
  scrollContainer: { flexGrow: 1, alignItems: 'center', paddingBottom: 60 },
  noResults: { fontSize: 18, color: '#64748b', marginTop: 40, textAlign: 'center' },
  gridContainer: { width: '100%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', paddingHorizontal: 16, gap: 16 },
  productCard: { backgroundColor: '#ffffff', borderRadius: 12, overflow: 'hidden', marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  productImage: { width: '100%', aspectRatio: 1, backgroundColor: '#f8fafc' },
  productInfo: { padding: 12, flex: 1 },
  productBrand: { fontSize: 10, fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: 4, letterSpacing: 0.5 },
  productTitle: { fontSize: 14, fontWeight: '600', color: '#1e293b', marginBottom: 8, lineHeight: 18, height: 36 },
  priceContainer: { marginBottom: 12 },
  productPrice: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  actionSection: { width: '100%' },
  addToCartBtn: { backgroundColor: '#6366f1', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 10, gap: 6 },
  addToCartText: { color: '#ffffff', fontWeight: '700', fontSize: 14 },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f8fafc', borderRadius: 10, padding: 2, borderWidth: 1, borderColor: '#e2e8f0' },
  qtyBtn: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center' },
  qtyText: { fontSize: 15, fontWeight: '800', color: '#0f172a', textAlign: 'center' },
});
