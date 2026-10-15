import { apiClient } from "../api/client";

export const cartService = {
  getCart: async () => {
    const response = await apiClient.get("/cart");
    return response.data;
  },
  addToCart: async (productId: string, quantity: number = 1) => {
    const response = await apiClient.post("/cart", { productId, quantity });
    return response.data;
  }
};
