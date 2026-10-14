import { api } from "./client";
import type { AdminProductListResponse, DashboardResponse, Product } from "../types";

export const fetchDashboard = async () => (await api.get<DashboardResponse>("/admin/dashboard")).data;

// Admin list includes hidden products too
export const fetchAdminProducts = async () =>
  (await api.get<AdminProductListResponse>("/admin/products")).data.products;

// Create and update send FormData because the product can include an image file.
// (Axios sets the multipart headers by itself.)
export const createProductRequest = async (formData: FormData) =>
  (await api.post<{ product: Product }>("/admin/products", formData)).data.product;

export const updateProductRequest = async (id: string, formData: FormData) =>
  (await api.put<{ product: Product }>(`/admin/products/${id}`, formData)).data.product;

// Hides a visible product, or shows a hidden one
export const toggleProductVisibilityRequest = async (id: string) =>
  (await api.patch<{ product: Product }>(`/admin/products/${id}/visibility`)).data.product;

export const deleteProductRequest = async (id: string) => {
  await api.delete(`/admin/products/${id}`);
};
