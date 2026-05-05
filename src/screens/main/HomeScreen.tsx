import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image, TouchableOpacity,
  useWindowDimensions, TextInput, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../components/Header';
import { useNavigation } from '@react-navigation/native';
import { RootNavigationProp } from '../../navigation/types';
import { apiService, Product, Category } from '../../services/api';
import useDeviceWidth from '../../utils/useDeviceWidth';

export const HomeScreen = () => {
  const deviceWidth = useDeviceWidth();
  const navigation = useNavigation<RootNavigationProp>();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Determine layouts based on width

  const isVeryLargeScreen = deviceWidth === "xl";
  const isLargeScreen = deviceWidth === "lg";
  const isMediumScreen = deviceWidth === "md";

  const cardWidth = isVeryLargeScreen ? '23%' : isLargeScreen ? '32%' : isMediumScreen ? '47%' : '100%';
  // const sidebarWidth = isVeryLargeScreen ? '8%' : isLargeScreen ? '10%' : isMediumScreen ? '46%' : '100%';

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      const [fetchedProducts, fetchedCategories] = await Promise.all([
        apiService.getProducts(),
        apiService.getCategories(),
      ]);
      setProducts(fetchedProducts);
      setCategories(fetchedCategories);
      setLoading(false);
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const timeId = setTimeout(() => {
      handleSearch();
    }, 500);

    return () => {
      clearTimeout(timeId);
    }

  }, [searchQuery]);

  const handleSearch = async () => {
    setLoading(true);
    setSelectedCategory(null);
    if (!searchQuery.trim()) {
      const allProducts = await apiService.getProducts();
      setProducts(allProducts);
    } else {
      const searchResults = await apiService.searchProducts(searchQuery);
      setProducts(searchResults);
    }
    setLoading(false);
  };

  const handleCategorySelect = async (categoryObj: any) => {
    const categorySlug = typeof categoryObj === 'string' ? categoryObj : categoryObj.slug;
    setLoading(true);
    setSearchQuery('');

    if ('All' === categorySlug) {
      // Toggle off
      setSelectedCategory(null);
      const allProducts = await apiService.getProducts();
      setProducts(allProducts);
    } else {
      // Toggle on
      setSelectedCategory(categorySlug);
      const catProducts = await apiService.getProductsByCategory(categorySlug);
      setProducts(catProducts);
    }
    setLoading(false);
  };

  const renderCategoryItem = (cat: any) => {
    const slug = typeof cat === 'string' ? cat : cat.slug;
    const name = typeof cat === 'string' ? cat : cat.name;
    const isSelected = selectedCategory === slug;

    return (
      <TouchableOpacity
        key={slug}
        style={[styles.categoryItem, isSelected && styles.categoryItemSelected]}
        onPress={() => handleCategorySelect(cat)}
      >
        <Text style={[styles.categoryText, isSelected && styles.categoryTextSelected]}>
          {name} {isSelected && '>'}
        </Text>
      </TouchableOpacity>
    );
  };

  const SearchBar = (
    <View style={styles.searchContainer}>
      <Text style={styles.searchIcon}>🔍</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search items..."
        placeholderTextColor="#94a3b8"
        underlineColorAndroid="transparent"
        selectionColor="#4CAF50"
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header centerComponent={SearchBar} />
      <View style={[styles.mainLayout, !(isLargeScreen || isVeryLargeScreen) && styles.mainLayoutMobile]}>

        {/* Categories Sidebar */}
        {(isLargeScreen || isVeryLargeScreen) ? (
          <View style={styles.sidebar}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sidebarContent}>
              <TouchableOpacity
                style={[styles.categoryItem, !selectedCategory && styles.categoryItemSelected]}
                onPress={() => handleCategorySelect('All')}
              >
                <Text style={[styles.categoryText, !selectedCategory && styles.categoryTextSelected]}>
                  All
                </Text>
              </TouchableOpacity>
              {categories?.map(renderCategoryItem)}
            </ScrollView>
          </View>
        ) : (
          <View style={styles.horizontalCategoriesContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalCategories}>
              <TouchableOpacity
                style={[styles.categoryItem, !selectedCategory && styles.categoryItemSelected]}
                onPress={() => handleCategorySelect('All')}
              >
                <Text style={[styles.categoryText, !selectedCategory && styles.categoryTextSelected]}>
                  All
                </Text>
              </TouchableOpacity>
              {categories.map(renderCategoryItem)}
            </ScrollView>
          </View>
        )}

        {/* Product Grid Area */}
        <View style={styles.gridArea}>
          <Text style={styles.gridTitle}>
            {selectedCategory ? selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1) : 'All'} ({products?.length})
          </Text>

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
                      <Text style={styles.productName} numberOfLines={2}>{product.title}</Text>
                      <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ScrollView>
        </View>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  mainLayout: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    alignSelf: 'center',
    paddingTop: 24,
  },
  mainLayoutMobile: {
    flexDirection: 'column',
    paddingTop: 0,
  },
  sidebar: {
    width: 250,
    paddingHorizontal: 24,
  },
  sidebarContent: {
    paddingBottom: 40,
  },
  horizontalCategoriesContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    backgroundColor: '#ffffff',
    marginBottom: 16,
  },
  horizontalCategories: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryItemSelected: {
    backgroundColor: '#f3f0ff', // light purple background
  },
  categoryText: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  categoryTextSelected: {
    color: '#6366f1',
    fontWeight: '700',
  },
  gridArea: {
    flex: 1,
  },
  gridTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  scrollContainer: { flexGrow: 1, alignItems: 'center', paddingBottom: 60 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    maxWidth: 500,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
    color: '#94a3b8',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#0f172a',
    borderWidth: 0,
    padding: 4,
    outlineColor: '#f8fafc',
  },
  noResults: {
    fontSize: 18,
    color: '#64748b',
    marginTop: 40,
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
    padding: 16,
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
    lineHeight: 22,
    height: 44,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '500',
    color: '#64748b',
  },
});
