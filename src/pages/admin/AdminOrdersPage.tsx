import { useEffect, useState } from "react";
import { fetchAdminOrders, updateAdminOrderStatusRequest } from "../../api/admin";
import { getErrorMessage } from "../../api/client";
import PageLoader from "../../components/PageLoader";
import { useToast } from "../../context/toast-context";
import type { AdminOrder, AdminOrderStatus } from "../../types";
import { formatPrice } from "../../utils/format";

export default function AdminOrdersPage() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [statusFilter, setStatusFilter] = useState<"" | AdminOrderStatus>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  useEffect(() => {
    let isCurrentRequest = true;
    setLoading(true);
    setError("");

    fetchAdminOrders(statusFilter || undefined)
      .then((response) => {
        if (isCurrentRequest) setOrders(response.orders);
      })
      .catch((err: unknown) => {
        if (isCurrentRequest) setError(getErrorMessage(err));
      })
      .finally(() => {
        if (isCurrentRequest) setLoading(false);
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [statusFilter]);

  const handleStatusOverride = async (order: AdminOrder, status: "completed" | "failed") => {
    setUpdatingOrderId(order._id);
    try {
      await updateAdminOrderStatusRequest(order._id, status);
      const response = await fetchAdminOrders(statusFilter || undefined);
      setOrders(response.orders);
      showToast(`Order ${order._id} marked ${status}`);
    } catch (err: unknown) {
      showToast(getErrorMessage(err), "error");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
          <p className="text-sm text-slate-500">Manage customer payments</p>
        </div>
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as "" | AdminOrderStatus)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none sm:w-auto"
          aria-label="Filter orders by payment status"
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}

      <div className="mt-6 space-y-3 md:hidden">
        {orders.map((order) => (
          <article key={order._id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="break-all font-mono text-xs text-slate-500">{order._id}</p>
            <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="break-words font-medium">{order.user?.name || "Unknown customer"}</p>
                {order.user?.email && <p className="break-all text-xs text-slate-500">{order.user.email}</p>}
              </div>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold capitalize text-slate-700">
                {order.paymentStatus}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
              <span className="font-semibold">{formatPrice(order.totalAmount)}</span>
              {order.paymentStatus === "pending" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStatusOverride(order, "completed")}
                    disabled={updatingOrderId !== null}
                    className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusOverride(order, "failed")}
                    disabled={updatingOrderId !== null}
                    className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </article>
        ))}
        {!error && orders.length === 0 && (
          <p className="rounded-2xl border border-slate-200 bg-white px-4 py-12 text-center text-sm text-slate-500">
            No orders match this status.
          </p>
        )}
      </div>

      <div className="mt-6 hidden overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Payment status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="break-all px-4 py-3 font-mono text-xs">{order._id}</td>
                <td className="px-4 py-3">
                  <div className="font-medium">{order.user?.name || "Unknown customer"}</div>
                  {order.user?.email && <div className="text-xs text-slate-500">{order.user.email}</div>}
                </td>
                <td className="px-4 py-3 font-medium">{formatPrice(order.totalAmount)}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold capitalize text-slate-700">
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {order.paymentStatus === "pending" && (
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleStatusOverride(order, "completed")}
                        disabled={updatingOrderId !== null}
                        className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusOverride(order, "failed")}
                        disabled={updatingOrderId !== null}
                        className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!error && orders.length === 0 && (
          <p className="px-4 py-12 text-center text-sm text-slate-500">No orders match this status.</p>
        )}
      </div>
    </div>
  );
}
