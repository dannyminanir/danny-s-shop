import { apiClient } from "./api";

export const checkoutService = {
  // Add item to database shopping cart
  addToCart: async (productId: string, quantity: number = 1) => {
    const response = await apiClient.post("/cart", { productId, quantity });
    return response.data;
  },

  // View active user cart basket
  getCart: async () => {
    const response = await apiClient.get("/cart");
    return response.data;
  },

  // Fire Mobile Money payment prompt payload
  initiateMomoPayment: async (phoneNumber: string) => {
    const response = await apiClient.post("/checkout/momo", { phoneNumber });
    return response.data; // Returns: { message, orderId, trackingId }
  },

  // Poll live transaction milestone state status details
  verifyPaymentStatus: async (orderId: string) => {
    const response = await apiClient.get(`/checkout/status/${orderId}`);
    return response.data; // Returns: { paymentStatus: 'completed' | 'pending' | 'failed' }
  }
};
