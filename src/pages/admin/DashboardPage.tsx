import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchDashboard } from "../../api/admin";
import { getErrorMessage } from "../../api/client";
import PageLoader from "../../components/PageLoader";
import ProductStatusBadge from "../../components/ProductStatusBadge";
import { formatDate, formatPrice } from "../../utils/format";
import type { DashboardResponse } from "../../types";

// One number card at the top of the dashboard
function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className={`mt-2 text-3xl font-extrabold ${color}`}>{value}</p>
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard()
      .then(setData)
      .catch((err) => setError(getErrorMessage(err)));
  }, []);

  if (error) return <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>;
  if (!data) return <PageLoader />;

  const { stats, recentProducts } = data;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-slate-500">A quick look at your shop.</p>
        </div>
        <Link
          to="/admin/products/new"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          + Add product
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total products" value={stats.totalProducts} color="text-slate-900" />
        <StatCard label="Visible in shop" value={stats.visibleProducts} color="text-emerald-600" />
        <StatCard label="Hidden products" value={stats.hiddenProducts} color="text-amber-600" />
        <StatCard label="Customers" value={stats.totalUsers} color="text-indigo-600" />
      </div>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="font-semibold">Recently added products</h2>
          <Link to="/admin/products" className="text-sm font-medium text-indigo-600 hover:underline">
            View all
          </Link>
        </div>

        {recentProducts.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-slate-500">No products yet. Add your first one!</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {recentProducts.map((product) => (
              <li key={product._id} className="flex items-center gap-4 px-5 py-3">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                  {product.imageUrl && <img src={product.imageUrl} alt="" className="h-full w-full object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{product.name}</p>
                  <p className="text-xs text-slate-500">
                    {product.category} · added {formatDate(product.createdAt)}
                  </p>
                </div>
                <ProductStatusBadge isHidden={product.isHidden} />
                <p className="w-28 text-right font-semibold">{formatPrice(product.price)}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
