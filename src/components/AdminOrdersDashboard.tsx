import React, { useState, useEffect } from "react";
import { adminService } from "../services/admin.service";

export const AdminOrdersDashboard: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [message, setMessage] = useState("");

  const loadDashboardOrders = () => {
    adminService.getAdminOrders(statusFilter || undefined)
      .then((data) => {
        setOrders(data.orders);
        setTotal(data.total);
      })
      .catch(console.error);
  };

  useEffect(() => {
    loadDashboardOrders();
  }, [statusFilter]);

  const handleStatusOverride = async (orderId: string, nextStatus: "completed" | "failed") => {
    try {
      await adminService.updateOrderStatus(orderId, nextStatus);
      setMessage(`Order status updated successfully to ${nextStatus}!`);
      loadDashboardOrders(); // Refresh table view parameters
      setTimeout(() => setMessage(""), 3000);
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "30px", fontFamily: "sans-serif", maxWidth: "1000px", margin: "auto" }}>
      <h2 style={{ color: "#2c5282" }}>Admin Order Log Management Dashboard</h2>
      <p style={{ color: "#4a5568" }}>Total registered pipeline sales transactions: <strong>{total}</strong></p>

      {message && <div style={{ padding: "10px", margin: "10px 0", backgroundColor: "#c6f6d5", color: "#22543d", borderRadius: "6px" }}>{message}</div>}

      <div style={{ marginBottom: "20px" }}>
        <label style={{ marginRight: "10px", fontWeight: "bold" }}>Filter Status:</label>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: "8px", borderRadius: "4px", border: "1px solid #cbd5e0" }}>
          <option value="">All Orders</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
        <thead>
          <tr style={{ backgroundColor: "#edf2f7", borderBottom: "2px solid #cbd5e0" }}>
            <th style={{ padding: "12px" }}>Order ID</th>
            <th style={{ padding: "12px" }}>Customer</th>
            <th style={{ padding: "12px" }}>Amount Paid</th>
            <th style={{ padding: "12px" }}>Payment Status</th>
            <th style={{ padding: "12px" }}>Actions Override</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} style={{ borderBottom: "1px solid #e2e8f0" }}>
              <td style={{ padding: "12px", fontSize: "14px", fontFamily: "monospace" }}>{order._id}</td>
              <td style={{ padding: "12px" }}>
                <div>{order.user?.name || "Anonymous User"}</div>
                <div style={{ fontSize: "12px", color: "#718096" }}>{order.user?.email}</div>
              </td>
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
                {order.paymentStatus !== "pending" && <span style={{ color: "#a0aec0", fontSize: "13px" }}>Locked</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
