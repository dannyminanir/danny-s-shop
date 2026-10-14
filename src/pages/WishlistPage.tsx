import { Link } from "react-router-dom";
import { useWishlist } from "../context/wishlist-context";
import PageLoader from "../components/PageLoader";
import ProductCard from "../components/ProductCard";

export default function WishlistPage() {
  const { products, loading } = useWishlist();

  if (loading && products.length === 0) return <PageLoader />;

  // Empty wishlist
  if (products.length === 0) {
    return (
      <div className="px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Your wishlist is empty</h1>
        <p className="mt-2 text-slate-500">Tap the heart on any product to save it here.</p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-lg bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-700"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold tracking-tight">My wishlist</h1>
      <p className="mt-1 text-sm text-slate-500">
        {products.length} saved product{products.length === 1 ? "" : "s"}
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
