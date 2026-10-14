import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  fetchAdminProducts,
  toggleProductVisibilityRequest,
  deleteProductRequest,
} from "../../api/admin";
import { getErrorMessage } from "../../api/client";
import { useToast } from "../../context/toast-context";
import ConfirmDialog from "../../components/ConfirmDialog";
import PageLoader from "../../components/PageLoader";
import ProductStatusBadge from "../../components/ProductStatusBadge";
import { EyeIcon, EyeOffIcon, PencilIcon, TrashIcon } from "../../components/Icons";
import { formatPrice } from "../../utils/format";
import type { Product } from "../../types";

type StatusFilter = "all" | "visible" | "hidden";

export default function ProductsPage() {
  const { showToast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");

  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchAdminProducts()
      .then(setProducts)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  // Hide a visible product / show a hidden one
  const handleToggleVisibility = async (product: Product) => {
    try {
      const updated = await toggleProductVisibilityRequest(product._id);
      setProducts((current) => current.map((item) => (item._id === updated._id ? updated : item)));
      showToast(updated.isHidden ? `"${updated.name}" is now hidden` : `"${updated.name}" is now visible`);
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    }
  };

  const handleDelete = async () => {
    if (!productToDelete) return;

    setDeleting(true);
    try {
      await deleteProductRequest(productToDelete._id);
      setProducts((current) => current.filter((item) => item._id !== productToDelete._id));
      showToast(`"${productToDelete.name}" was deleted`);
      setProductToDelete(null);
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    } finally {
      setDeleting(false);
    }
  };

  // Apply the search box and the status dropdown
  const visibleRows = products.filter((product) => {
    const matchesSearch = `${product.name} ${product.category}`.toLowerCase().includes(search.trim().toLowerCase());
    const matchesStatus = status === "all" || (status === "hidden" ? product.isHidden : !product.isHidden);
    return matchesSearch && matchesStatus;
  });

  if (loading) return <PageLoader />;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-sm text-slate-500">{products.length} in total</p>
        </div>
        <Link
          to="/admin/products/new"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          + Add product
        </Link>
      </div>

      {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}

      {/* Search + filter */}
      <div className="mt-6 flex flex-wrap gap-3">
        <input
          type="search"
          placeholder="Search by name or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:w-72"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as StatusFilter)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
        >
          <option value="all">All products</option>
          <option value="visible">Visible only</option>
          <option value="hidden">Hidden only</option>
        </select>
      </div>

      {/* Table */}
      <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visibleRows.map((product) => (
              <tr key={product._id} className={product.isHidden ? "bg-slate-50/60" : ""}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                      {product.imageUrl && <img src={product.imageUrl} alt="" className="h-full w-full object-cover" />}
                    </div>
                    <span className="font-medium">{product.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600">{product.category}</td>
                <td className="px-4 py-3 font-medium">{formatPrice(product.price)}</td>
                <td className="px-4 py-3">
                  <ProductStatusBadge isHidden={product.isHidden} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => handleToggleVisibility(product)}
                      title={product.isHidden ? "Show in shop" : "Hide from shop"}
                      aria-label={product.isHidden ? "Show in shop" : "Hide from shop"}
                      className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-indigo-600"
                    >
                      {product.isHidden ? <EyeIcon className="h-5 w-5" /> : <EyeOffIcon className="h-5 w-5" />}
                    </button>
                    <Link
                      to={`/admin/products/${product._id}/edit`}
                      title="Edit"
                      aria-label="Edit product"
                      className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-indigo-600"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => setProductToDelete(product)}
                      title="Delete"
                      aria-label="Delete product"
                      className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {visibleRows.length === 0 && (
          <p className="px-4 py-12 text-center text-sm text-slate-500">No products match your search.</p>
        )}
      </div>

      <ConfirmDialog
        open={productToDelete !== null}
        title="Delete this product?"
        message={`"${productToDelete?.name}" will be removed permanently, including from customers' carts, wishlists and reviews.`}
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setProductToDelete(null)}
      />
    </div>
  );
}
