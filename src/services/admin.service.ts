import { apiClient } from "./api";

export const adminService = {
  // Fetch paginated store customer mobile money orders list
  getAdminOrders: async (status?: string, page: number = 1, limit: number = 10) => {
    const params = { status, page, limit };
    const response = await apiClient.get("/admin/orders", { params });
    return response.data;
  },

  // Manually override or alter a specific customer order status condition
  updateOrderStatus: async (orderId: string, paymentStatus: "pending" | "completed" | "failed") => {
    const response = await apiClient.patch(`/admin/orders/${orderId}/status`, { paymentStatus });
    return response.data;
  }
};
