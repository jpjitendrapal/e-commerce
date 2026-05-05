import { create } from 'zustand';
import { apiService } from '../services/api';

interface CategoryState {
  categories: any[];
  selectedCategory: string | null;
  searchQuery: string;
  loading: boolean;
  setCategories: (categories: any[]) => void;
  setSelectedCategory: (category: string | null) => void;
  setSearchQuery: (query: string) => void;
  fetchCategories: () => Promise<void>;
  reset: () => void;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  selectedCategory: null,
  searchQuery: '',
  loading: false,

  setCategories: (categories) => set({ categories: Array.isArray(categories) ? categories : [] }),
  setSelectedCategory: (category) => set({ selectedCategory: category, searchQuery: '' }),
  setSearchQuery: (query) => set({ searchQuery: query, selectedCategory: null }),

  fetchCategories: async () => {
    // Avoid double fetching if already loading or already have categories
    if (get().loading || get().categories.length > 0) return;
    
    set({ loading: true });
    try {
      const fetchedCategories = await apiService.getCategories();
      set({ categories: Array.isArray(fetchedCategories) ? fetchedCategories : [] });
    } catch (e) {
      console.error('Failed to fetch categories in store', e);
      set({ categories: [] });
    } finally {
      set({ loading: false });
    }
  },

  reset: () => set({ selectedCategory: null, searchQuery: '' }),
}));
