import { api } from "./client";
import type { Cart } from "../types";

export const fetchCart = async () => (await api.get<Cart>("/cart")).data;

export const addToCartRequest = async (productId: string, quantity: number) =>
  (await api.post<Cart>("/cart", { productId, quantity })).data;

export const updateCartItemRequest = async (productId: string, quantity: number) =>
  (await api.put<Cart>(`/cart/${productId}`, { quantity })).data;

export const removeCartItemRequest = async (productId: string) =>
  (await api.delete<Cart>(`/cart/${productId}`)).data;

export const clearCartRequest = async () => (await api.delete<Cart>("/cart")).data;
