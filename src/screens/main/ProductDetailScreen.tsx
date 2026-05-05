import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, Image, ScrollView,
  TouchableOpacity, ActivityIndicator
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList, RootNavigationProp } from '../../navigation/types';
import { apiService, Product } from '../../services/api';
import { MainLayout } from '../../components/MainLayout';

type ProductDetailRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>;

export const ProductDetailScreen = () => {
  const route = useRoute<ProductDetailRouteProp>();
  const navigation = useNavigation<RootNavigationProp>();
  const { productId } = route.params;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const data = await apiService.getProduct(productId);
      setProduct(data);
      setLoading(false);
    };
    fetchProduct();
  }, [productId]);

  return (
    <MainLayout showSearch={false}>
      <ScrollView contentContainerStyle={styles.scrollContainer} bounces={true}>
        {loading ? (
          <ActivityIndicator size="large" color="#6366f1" style={styles.loader} />
        ) : !product ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Product not found.</Text>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.backBtnText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.content}>
            <TouchableOpacity style={styles.backLink} onPress={() => navigation.goBack()}>
              <Text style={styles.backLinkText}>← Back to Products</Text>
            </TouchableOpacity>

            <View style={styles.productContainer}>
              <View style={styles.imageGallery}>
                <Image
                  source={{ uri: product.thumbnail }}
                  style={styles.mainImage}
                  resizeMode="contain"
                />
              </View>

              <View style={styles.detailsSection}>
                <View style={styles.brandBadge}>
                  <Text style={styles.brandText}>{product.brand || product.category}</Text>
                </View>

                <Text style={styles.title}>{product.title}</Text>

                <View style={styles.priceRow}>
                  <Text style={styles.price}>${product.price.toFixed(2)}</Text>
                  {product.discountPercentage > 0 && (
                    <View style={styles.discountBadge}>
                      <Text style={styles.discountText}>{product.discountPercentage}% OFF</Text>
                    </View>
                  )}
                </View>

                <View style={styles.ratingRow}>
                  <Text style={styles.rating}>⭐ {product.rating.toFixed(1)}</Text>
                  <Text style={styles.stockText}>
                    {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                  </Text>
                </View>

                <Text style={styles.description}>{product.description}</Text>

                <TouchableOpacity style={styles.addToCartBtn}>
                  <Text style={styles.addToCartText}>Add to Cart</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, paddingBottom: 60, alignItems: 'center' },
  loader: { marginTop: 60 },
  errorContainer: { marginTop: 60, alignItems: 'center' },
  errorText: { fontSize: 18, color: '#64748b', marginBottom: 20 },
  backBtn: {
    paddingHorizontal: 24, paddingVertical: 12,
    backgroundColor: '#6366f1', borderRadius: 8
  },
  backBtnText: { color: '#fff', fontWeight: '700' },
  content: {
    width: '100%',
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  backLink: {
    marginBottom: 24,
    alignSelf: 'flex-start',
  },
  backLinkText: {
    fontSize: 16,
    color: '#6366f1',
    fontWeight: '600',
  },
  productContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 40,
    justifyContent: 'flex-start',
  },
  imageGallery: {
    flex: 1,
    minWidth: 300,
    maxWidth: 500,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    padding: 24,
    aspectRatio: 1,
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  detailsSection: {
    flex: 1.5,
    minWidth: 300,
    paddingVertical: 16,
  },
  brandBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 16,
  },
  brandText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 16,
    lineHeight: 40,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  price: {
    fontSize: 28,
    fontWeight: '800',
    color: '#6366f1',
  },
  discountBadge: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  discountText: {
    color: '#ef4444',
    fontWeight: '700',
    fontSize: 14,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  rating: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f59e0b',
  },
  stockText: {
    fontSize: 16,
    color: '#10b981',
    fontWeight: '500',
  },
  description: {
    fontSize: 16,
    color: '#475569',
    lineHeight: 26,
    marginBottom: 40,
  },
  addToCartBtn: {
    backgroundColor: '#6366f1',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
    maxWidth: 300,
  },
  addToCartText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
