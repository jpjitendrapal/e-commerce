import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image, TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootNavigationProp } from '../../navigation/types';
import { apiService, Product } from '../../services/api';
import useDeviceWidth from '../../utils/useDeviceWidth';
import { MainLayout } from '../../components/MainLayout';
import { useCategoryStore } from '../../store/useCategoryStore';
import { useCartStore } from '../../store/useCartStore';
import { Ionicons } from '@expo/vector-icons';
import { ENV } from '../../config/env';

export const HomeScreen = () => {
  const deviceWidth = useDeviceWidth();
  const navigation = useNavigation<RootNavigationProp>();
  const { selectedCategory, searchQuery } = useCategoryStore();
  const { addItem, items } = useCartStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const isVeryLargeScreen = deviceWidth === "xl";
  const isLargeScreen = deviceWidth === "lg";
  const isMediumScreen = deviceWidth === "md";

  const cardWidth = isVeryLargeScreen ? '23%' : isLargeScreen ? '32%' : isMediumScreen ? '47%' : '47%';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      if (searchQuery) {
        const results = await apiService.searchProducts(searchQuery);
        setProducts(results);
      } else if (selectedCategory) {
        const results = await apiService.getProductsByCategory(selectedCategory);
        setProducts(results);
      } else {
        const results = await apiService.getProducts();
        setProducts(results);
      }
      setLoading(false);
    };

    const timer = setTimeout(fetchProducts, searchQuery ? 500 : 0);
    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery]);

  const handleAddToCart = (product: Product, quantity: number) => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
      quantity: quantity
    });
  };

  return (
    <MainLayout>
      <View style={styles.gridArea}>
        <View style={styles.titleSection}>
          <Text style={styles.gridTitle}>
            {selectedCategory ? selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1) : 'All Products'}
            <Text style={styles.gridCount}> ({products?.length || 0})</Text>
          </Text>
          <View style={styles.accentLine} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer} bounces={true}>
          {loading ? (
            <ActivityIndicator size="large" color="#6366f1" style={{ marginTop: 40 }} />
          ) : products?.length === 0 ? (
            <Text style={styles.noResults}>No products found.</Text>
          ) : (
            <View style={styles.gridContainer}>
              {products?.map((product) => (
                <TouchableOpacity
                  key={product.id}
                  style={[styles.productCard, { width: cardWidth as any }]}
                  onPress={() => navigation.navigate('ProductDetail', { productId: product.id })}
                >
                  <Image source={{ uri: product.thumbnail }} style={styles.productImage} resizeMode="cover" />
                    <View style={styles.productInfo}>
                      <Text style={styles.productBrand} numberOfLines={1}>{product.brand || product.category}</Text>
                      <Text style={styles.productTitle} numberOfLines={2}>{product.title}</Text>
                      
                      <View style={styles.priceContainer}>
                        <Text style={styles.productPrice}>{ENV.CURRENCY_SYMBOL}{product.price.toFixed(2)}</Text>
                      </View>

                      <View style={styles.actionSection}>
                        {items.find(i => i.id === product.id) ? (
                          <View style={styles.quantityContainer}>
                            <TouchableOpacity
                              style={styles.qtyBtn}
                              onPress={(e) => { e.stopPropagation(); handleAddToCart(product, -1); }}
                            >
                              <Ionicons name="remove" size={18} color="#6366f1" />
                            </TouchableOpacity>
                            <Text style={styles.qtyText}>{items.find(i => i.id === product.id)?.quantity}</Text>
                            <TouchableOpacity
                              style={styles.qtyBtn}
                              onPress={(e) => { e.stopPropagation(); handleAddToCart(product, 1); }}
                            >
                              <Ionicons name="add" size={18} color="#6366f1" />
                            </TouchableOpacity>
                          </View>
                        ) : (
                          <TouchableOpacity 
                            style={styles.addToCartBtn}
                            onPress={(e) => { e.stopPropagation(); handleAddToCart(product, 1); }}
                          >
                            <Ionicons name="cart-outline" size={18} color="#fff" />
                            <Text style={styles.addToCartText}>Add</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  gridArea: {
    flex: 1,
  },
  titleSection: {
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 24,
  },
  gridTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  gridCount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#94a3b8',
  },
  accentLine: {
    width: 40,
    height: 4,
    backgroundColor: '#6366f1',
    borderRadius: 2,
    marginTop: 8,
  },
  scrollContainer: { flexGrow: 1, alignItems: 'center', paddingBottom: 60 },
  noResults: {
    fontSize: 18,
    color: '#64748b',
    marginTop: 40,
    textAlign: 'center',
  },
  gridContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    gap: 16,
  },
  productCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  productImage: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#f8fafc',
  },
  productInfo: {
    padding: 12,
    flex: 1,
  },
  productBrand: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
    textTransform: 'uppercase',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
    lineHeight: 18,
    height: 36,
  },
  priceContainer: {
    marginBottom: 12,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  actionSection: {
    width: '100%',
  },
  addToCartBtn: {
    backgroundColor: '#6366f1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  addToCartText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 2,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  qtyText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
  },
});
