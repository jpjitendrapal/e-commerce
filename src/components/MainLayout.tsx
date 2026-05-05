import React, { useEffect, ReactNode } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, KeyboardAvoidingView, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Header } from './Header';
import { useCategoryStore } from '../store/useCategoryStore';
import useDeviceWidth from '../utils/useDeviceWidth';
import { RootNavigationProp } from '../navigation/types';
import { Toast } from './Toast';

interface MainLayoutProps {
  children: ReactNode;
  showSearch?: boolean;
  showCategories?: boolean;
}

export const MainLayout = ({ 
  children, 
  showSearch = true,
  showCategories = true
}: MainLayoutProps) => {
  const deviceWidth = useDeviceWidth();
  const navigation = useNavigation<RootNavigationProp>();
  const route = useRoute();
  
  const { 
    categories, selectedCategory, searchQuery, 
    setSelectedCategory, setSearchQuery, fetchCategories 
  } = useCategoryStore();

  const isLargeScreen = deviceWidth === "lg" || deviceWidth === "xl";
  const isMobile = deviceWidth === 'sm';

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategorySelect = (cat: any) => {
    const slug = typeof cat === 'string' ? cat : cat.slug;
    
    if (slug === 'All') {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(slug);
    }

    if (route.name !== 'Home') {
      navigation.navigate('Home');
    }
  };

  const handleSearch = () => {
    if (route.name !== 'Home') {
      navigation.navigate('Home');
    }
  };

  const renderCategoryItem = (cat: any) => {
    if (!cat) return null;
    const slug = typeof cat === 'string' ? cat : cat.slug;
    const name = typeof cat === 'string' ? cat : cat.name;
    const isSelected = selectedCategory === slug;

    return (
      <TouchableOpacity
        key={slug}
        style={[styles.categoryItem, isSelected && styles.categoryItemSelected]}
        onPress={() => handleCategorySelect(cat)}
      >
        {isSelected && isLargeScreen && <View style={styles.activeBar} />}
        <Text style={[styles.categoryText, isSelected && styles.categoryTextSelected]} numberOfLines={1}>
          {name}
        </Text>
      </TouchableOpacity>
    );
  };

  const SearchBar = (
    <View style={[styles.searchContainer, isMobile && styles.searchContainerMobile]}>
      <Text style={styles.searchIcon}>🔍</Text>
      <TextInput
        style={styles.searchInput}
        placeholder={isMobile ? "Search..." : "Search items..."}
        placeholderTextColor="#94a3b8"
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
      />
    </View>
  );

  const categoryList = Array.isArray(categories) ? categories : [];

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <Header centerComponent={showSearch ? SearchBar : undefined} />
        
        <View style={[
          styles.mainLayout, 
          !isLargeScreen && styles.mainLayoutMobile,
          !showCategories && styles.mainLayoutNoCategories
        ]}>
          
          {/* Categories Sidebar/Top Bar */}
          {showCategories && (
            isLargeScreen ? (
              <View style={styles.sidebar}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sidebarContent}>
                  <TouchableOpacity
                    style={[styles.categoryItem, !selectedCategory && styles.categoryItemSelected]}
                    onPress={() => handleCategorySelect('All')}
                  >
                    {!selectedCategory && isLargeScreen && <View style={styles.activeBar} />}
                    <Text style={[styles.categoryText, !selectedCategory && styles.categoryTextSelected]}>
                      All
                    </Text>
                  </TouchableOpacity>
                  {categoryList.map(renderCategoryItem)}
                </ScrollView>
              </View>
            ) : (
              <View style={styles.horizontalCategoriesContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalCategories}>
                  <TouchableOpacity
                    style={[styles.categoryItem, !selectedCategory && styles.categoryItemSelected]}
                    onPress={() => handleCategorySelect('All')}
                  >
                    {!selectedCategory && isLargeScreen && <View style={styles.activeBar} />}
                    <Text style={[styles.categoryText, !selectedCategory && styles.categoryTextSelected]}>
                      All
                    </Text>
                  </TouchableOpacity>
                  {categoryList.map(renderCategoryItem)}
                </ScrollView>
              </View>
            )
          )}

          {/* Content Area */}
          <View style={[styles.contentArea, !showCategories && styles.contentAreaFull]}>
            {children}
          </View>

        </View>
        <Toast />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  mainLayout: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    paddingTop: 24,
  },
  mainLayoutMobile: {
    flexDirection: 'column',
    paddingTop: 0,
  },
  mainLayoutNoCategories: {
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
  },
  horizontalCategories: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  categoryItemSelected: {
    backgroundColor: '#f3f0ff',
  },
  activeBar: {
    position: 'absolute',
    left: 0,
    top: '25%',
    bottom: '25%',
    width: 4,
    backgroundColor: '#6366f1',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  categoryText: {
    fontSize: 15,
    color: '#64748b',
    fontWeight: '500',
  },
  categoryTextSelected: {
    color: '#6366f1',
    fontWeight: '700',
  },
  contentArea: {
    flex: 1,
  },
  contentAreaFull: {
    paddingTop: 0,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    maxWidth: 500,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchContainerMobile: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 6,
    color: '#94a3b8',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
    borderWidth: 0,
    padding: 4,
  },
});
