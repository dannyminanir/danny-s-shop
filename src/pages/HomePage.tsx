import { useEffect, useState } from "react";
import { fetchCategories, fetchProducts } from "../api/products";
import { getErrorMessage } from "../api/client";
import ProductCard from "../components/ProductCard";
import type { Product } from "../types";

const PAGE_SIZE = 8;

type Sort = "newest" | "price_asc" | "price_desc" | "name";

interface Filters {
  search: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  sort: Sort;
  page: number;
}

const defaultFilters: Filters = {
  search: "",
  category: "",
  minPrice: "",
  maxPrice: "",
  sort: "newest",
  page: 1,
};

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";

export default function HomePage() {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [categories, setCategories] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Change a filter and go back to page 1
  const changeFilter = (patch: Partial<Filters>) => {
    setFilters((current) => ({ ...current, ...patch, page: 1 }));
  };

  const goToPage = (page: number) => {
    setFilters((current) => ({ ...current, page }));
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  // Load the categories once, for the dropdown
  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  // Load products whenever a filter changes (waits 300ms so we don't send a request for every key press)
  useEffect(() => {
    let cancelled = false;

    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchProducts({
          search: filters.search || undefined,
          category: filters.category || undefined,
          minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
          maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
          sort: filters.sort,
          page: filters.page,
          limit: PAGE_SIZE,
        });
        if (!cancelled) {
          setProducts(data.products);
          setTotal(data.total);
          setPages(data.pages);
        }
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 300);

    // If filters change again before the request finishes, ignore the old result
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [filters]);

  const hasActiveFilters =
    filters.search || filters.category || filters.minPrice || filters.maxPrice || filters.sort !== "newest";

  return (
    <div>
      {/* Hero banner */}
      {/* <section className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-600 text-white"> */}
      <section className="bg-blue-400 flex flex-col items-center justify-center text-center sm:flex-row sm:justify-between">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-200">Welcome to Danny's Shop</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">
            Great products. Fair prices. Delivered to you.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-indigo-100">
            Browse our latest collection of electronics, phones and more, all in one place.
          </p>
          <a
            href="#products"
            className="mt-8 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-indigo-700 shadow transition hover:bg-indigo-50"
          >
            Shop now
          </a>
        </div>
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 flex flex-wrap justify-center gap-4">
   <img
  src="/Danny Logo.png"
  alt="Danny's Shop Logo"
  className="mx-auto h-auto w-full max-w-md object-contain"
/>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Our products</h2>
            <p className="text-sm text-slate-500">{loading ? "Loading..." : `${total} product${total === 1 ? "" : "s"} found`}</p>
          </div>
        </div>

        {/* Filter bar */}
        <div className="mb-8 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-6">
          <input
            type="search"
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) => changeFilter({ search: e.target.value })}
            className={`${inputClass} lg:col-span-2`}
          />

          <select value={filters.category} onChange={(e) => changeFilter({ category: e.target.value })} className={inputClass}>
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select value={filters.sort} onChange={(e) => changeFilter({ sort: e.target.value as Sort })} className={inputClass}>
            <option value="newest">Newest first</option>
            <option value="price_asc">Price: low to high</option>
            <option value="price_desc">Price: high to low</option>
            <option value="name">Name (A-Z)</option>
          </select>

          <div className="flex gap-2 lg:col-span-2">
            <input
              type="number"
              min={0}
              placeholder="Min price"
              value={filters.minPrice}
              onChange={(e) => changeFilter({ minPrice: e.target.value })}
              className={inputClass}
            />
            <input
              type="number"
              min={0}
              placeholder="Max price"
              value={filters.maxPrice}
              onChange={(e) => changeFilter({ maxPrice: e.target.value })}
              className={inputClass}
            />
          </div>

          {hasActiveFilters && (
            <button
              onClick={() => setFilters(defaultFilters)}
              className="text-left text-sm font-medium text-indigo-600 hover:underline sm:col-span-2 lg:col-span-6"
            >
              Clear all filters
            </button>
          )}
        </div>

        {error && <p className="mb-6 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="aspect-square bg-slate-200" />
                <div className="space-y-3 p-4">
                  <div className="h-4 w-1/3 rounded bg-slate-200" />
                  <div className="h-4 w-2/3 rounded bg-slate-200" />
                  <div className="h-5 w-1/2 rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && products.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
            <p className="text-lg font-semibold">No products found</p>
            <p className="mt-1 text-sm text-slate-500">Try a different search or clear the filters.</p>
          </div>
        )}

        {/* Product grid */}
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              onClick={() => goToPage(filters.page - 1)}
              disabled={filters.page <= 1}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium transition hover:bg-slate-100 disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-sm text-slate-600">
              Page {filters.page} of {pages}
            </span>
            <button
              onClick={() => goToPage(filters.page + 1)}
              disabled={filters.page >= pages}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium transition hover:bg-slate-100 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </section>
    </div>
  );
}