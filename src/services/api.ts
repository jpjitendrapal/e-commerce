export type Category = {
  slug: string;
  name: string;
  url: string;
};

export type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
};

export type ProductsResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};

import { ENV } from '../config/env';

const BASE_URL = ENV.API_URL;

export const apiService = {
  getProducts: async (): Promise<Product[]> => {
    try {
      const res = await fetch(`${BASE_URL}/products?limit=30`);
      const data: ProductsResponse = await res.json();
      return data.products;
    } catch (e) {
      console.error('Failed to fetch products', e);
      return [];
    }
  },

  searchProducts: async (query: string): Promise<Product[]> => {
    try {
      const res = await fetch(`${BASE_URL}/products/search?q=${query}`);
      const data: ProductsResponse = await res.json();
      return data.products;
    } catch (e) {
      console.error('Failed to search products', e);
      return [];
    }
  },

  getCategories: async (): Promise<Category[] | string[]> => {
    try {
      const res = await fetch(`${BASE_URL}/products/categories`);
      const data = await res.json();
      return data;
    } catch (e) {
      console.error('Failed to fetch categories', e);
      return [];
    }
  },

  getProductsByCategory: async (category: string): Promise<Product[]> => {
    try {
      const res = await fetch(`${BASE_URL}/products/category/${category}`);
      const data: ProductsResponse = await res.json();
      return data.products;
    } catch (e) {
      console.error('Failed to fetch category products', e);
      return [];
    }
  },

  getProduct: async (id: number): Promise<Product | null> => {
    try {
      const res = await fetch(`${BASE_URL}/products/${id}`);
      if (!res.ok) throw new Error('Product not found');
      const data: Product = await res.json();
      return data;
    } catch (e) {
      console.error(`Failed to fetch product ${id}`, e);
      return null;
    }
  },
};
