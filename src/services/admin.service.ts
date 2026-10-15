import { apiClient } from "../api/client";

export const adminService = {
  getAdminOrders: async (status?: string, page: number = 1, limit: number = 10) => {
    const params = { status, page, limit };
    const response = await apiClient.get("/admin/orders", { params });
    return response.data; // Returns: { total, page, pages, orders: [...] }
  },
  updateOrderStatus: async (orderId: string, paymentStatus: "pending" | "completed" | "failed") => {
    const response = await apiClient.patch(`/admin/orders/${orderId}/status`, { paymentStatus });
    return response.data;
  }
};
