import { apiClient } from "../api/client";

export const checkoutService = {
  initiateMomoPayment: async (phoneNumber: string) => {
    const response = await apiClient.post("/checkout/momo", { phoneNumber });
    return response.data; // Returns: { message, orderId, trackingId }
  },
  verifyPaymentStatus: async (orderId: string) => {
    const response = await apiClient.get(`/checkout/status/${orderId}`);
    return response.data; // Returns: { paymentStatus: 'pending' | 'completed' | 'failed' }
  }
};
