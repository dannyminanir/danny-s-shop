import React, { useState, useEffect } from "react";
import { adminService } from "../services/admin.service";

export const AdminOrdersDashboard: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState("");

  const refreshOrders = () => {
    adminService.getAdminOrders(filter || undefined).then((data) => setOrders(data.orders)).catch(console.error);
  };

  useEffect(() => {
    refreshOrders();
  }, [filter]);

  const handleUpdate = async (id: string, status: "completed" | "failed") => {
    await adminService.updateOrderStatus(id, status);
    refreshOrders();
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2 style={{ color: "#2c5282" }}>Admin Order Log Management</h2>
      <div style={{ marginBottom: "15px" }}>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ padding: "8px", borderRadius: "4px" }}>
          <option value="">All Payment Statuses</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#edf2f7", textAlign: "left" }}>
            <th style={{ padding: "10px" }}>Order ID</th>
            <th style={{ padding: "10px" }}>Customer</th>
            <th style={{ padding: "10px" }}>Total Amount</th>
            <th style={{ padding: "10px" }}>Status</th>
            <th style={{ padding: "10px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} style={{ borderBottom: "1px solid #edf2f7" }}>
              <td style={{ padding: "10px", fontSize: "13px", fontFamily: "monospace" }}>{order._id}</td>
              <td style={{ padding: "10px" }}>{order.user?.name} ({order.user?.email})</td>
              <td style={{ padding: "10px", fontWeight: "bold" }}>{order.totalAmount?.toLocaleString()} RWF</td>
              <td style={{ padding: "10px" }}>{order.paymentStatus}</td>
              <td style={{ padding: "10px" }}>
                {order.paymentStatus === "pending" && (
                  <>
                    <button onClick={() => handleUpdate(order._id, "completed")} style={{ marginRight: "5px", backgroundColor: "#48bb78", color: "#fff", border: "none", padding: "4px 8px", borderRadius: "3px" }}>Approve</button>
                    <button onClick={() => handleUpdate(order._id, "failed")} style={{ backgroundColor: "#f56565", color: "#fff", border: "none", padding: "4px 8px", borderRadius: "3px" }}>Cancel</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
