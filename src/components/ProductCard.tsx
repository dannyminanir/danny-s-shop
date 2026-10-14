import { Link } from "react-router-dom";
import { CartIcon, HeartIcon } from "./Icons";
import { useCart } from "../context/cart-context";
import { useWishlist } from "../context/wishlist-context";
import { formatPrice } from "../utils/format";
import type { Product } from "../types";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const saved = isInWishlist(product._id);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      {/* Heart button (sits on top of the image) */}
      <button
        type="button"
        onClick={() => toggleWishlist(product)}
        aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
        className={`absolute right-3 top-3 z-10 rounded-full bg-white/90 p-2 shadow transition hover:scale-110 ${
          saved ? "text-red-500" : "text-slate-500 hover:text-red-500"
        }`}
      >
        <HeartIcon filled={saved} className="h-5 w-5" />
      </button>

      {/* Image + text link to the product page */}
      <Link to={`/products/${product._id}`} className="flex-1">
        <div className="aspect-square overflow-hidden bg-slate-100">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-400">No image</div>
          )}
        </div>

        <div className="p-4 pb-2">
          <span className="inline-block rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
            {product.category}
          </span>
          <h3 className="mt-2 truncate font-semibold text-slate-900">{product.name}</h3>
          {product.description && <p className="mt-1 line-clamp-2 text-sm text-slate-500">{product.description}</p>}
        </div>
      </Link>

      <div className="flex items-center justify-between gap-2 p-4 pt-2">
        <p className="text-lg font-bold text-slate-900">{formatPrice(product.price)}</p>
        <button
          type="button"
          onClick={() => addToCart(product._id)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          <CartIcon className="h-4 w-4" />
          Add
        </button>
      </div>
    </div>
  );
}
