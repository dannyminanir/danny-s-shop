import React, { useState, useEffect } from "react";
import { apiClient } from "../../api/client";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState("");

  const fetchAdminOrdersLog = () => {
    const params = statusFilter ? { status: statusFilter } : {};
    apiClient.get("/admin/orders", { params })
      .then((res) => setOrders(res.data.orders || []))
      .catch((err) => console.error("Error looking up order logs", err));
  };

  useEffect(() => {
    fetchAdminOrdersLog();
  }, [statusFilter]);

  const handleStatusOverride = async (id: string, state: "completed" | "failed") => {
    try {
      await apiClient.patch(`/admin/orders/${id}/status`, { paymentStatus: state });
      fetchAdminOrdersLog(); // Refresh table view parameters
    } catch (err) {
      console.error("Status override failed", err);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2 style={{ color: "#2c5282" }}>Customer Purchases & Order Log Dashboard</h2>
      
      <div style={{ marginBottom: "20px" }}>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e0" }}>
          <option value="">All Transactions</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#edf2f7", textAlign: "left", borderBottom: "2px solid #cbd5e0" }}>
            <th style={{ padding: "12px" }}>Order ID</th>
            <th style={{ padding: "12px" }}>Shopper</th>
            <th style={{ padding: "12px" }}>Total Amount</th>
            <th style={{ padding: "12px" }}>Status State</th>
            <th style={{ padding: "12px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} style={{ borderBottom: "1px solid #edf2f7" }}>
              <td style={{ padding: "12px", fontFamily: "monospace", fontSize: "13px" }}>{order._id}</td>
              <td style={{ padding: "12px" }}>{order.user?.name} ({order.user?.email})</td>
              <td style={{ padding: "12px", fontWeight: "bold" }}>{order.totalAmount?.toLocaleString()} RWF</td>
              <td style={{ padding: "12px" }}>
                <span style={{ padding: "4px 8px", borderRadius: "12px", fontSize: "12px", fontWeight: "bold", backgroundColor: order.paymentStatus === "completed" ? "#c6f6d5" : order.paymentStatus === "pending" ? "#feebc8" : "#fed7d7", color: order.paymentStatus === "completed" ? "#22543d" : order.paymentStatus === "pending" ? "#744210" : "#742a2a" }}>
                  {order.paymentStatus}
                </span>
              </td>
              <td style={{ padding: "12px" }}>
                {order.paymentStatus === "pending" && (
                  <>
                    <button onClick={() => handleStatusOverride(order._id, "completed")} style={{ padding: "6px 12px", backgroundColor: "#38a169", color: "#fff", border: "none", borderRadius: "4px", marginRight: "6px", cursor: "pointer" }}>Approve</button>
                    <button onClick={() => handleStatusOverride(order._id, "failed")} style={{ padding: "6px 12px", backgroundColor: "#e53e3e", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>Cancel</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
