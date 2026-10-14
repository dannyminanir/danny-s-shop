import { api } from "./client";
import type { ProductDetails, ProductListResponse } from "../types";

export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "newest" | "price_asc" | "price_desc" | "name";
  page?: number;
  limit?: number;
}

export const fetchProducts = async (filters: ProductFilters = {}) => {
  const response = await api.get<ProductListResponse>("/products", { params: filters });
  return response.data;
};

export const fetchCategories = async () => {
  const response = await api.get<{ categories: string[] }>("/products/categories");
  return response.data.categories;
};

export const fetchProductById = async (id: string) => {
  const response = await api.get<ProductDetails>(`/products/${id}`);
  return response.data;
};