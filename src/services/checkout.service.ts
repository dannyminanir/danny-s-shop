import { apiClient } from "../api/client";

export interface MomoPaymentInitResponse {
  message?: string;
  orderId: string;
  trackingId?: string;
}

export interface PaymentStatusResponse {
  paymentStatus: "pending" | "completed" | "failed";
}

export const checkoutService = {
  initiateMomoPayment: async (phoneNumber: string) => {
    const response = await apiClient.post<MomoPaymentInitResponse>("/checkout/momo", { phoneNumber });
    return response.data;
  },
  verifyPaymentStatus: async (orderId: string, signal?: AbortSignal) => {
    const response = await apiClient.get<PaymentStatusResponse>(`/checkout/status/${orderId}`, { signal });
    return response.data;
  }
};
