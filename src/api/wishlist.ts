import { api } from "./client";
import type { Wishlist } from "../types";

export const fetchWishlist = async () => (await api.get<Wishlist>("/wishlist")).data;

export const addToWishlistRequest = async (productId: string) =>
  (await api.post<Wishlist>("/wishlist", { productId })).data;

export const removeFromWishlistRequest = async (productId: string) =>
  (await api.delete<Wishlist>(`/wishlist/${productId}`)).data;
