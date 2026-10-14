import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchProductById } from "../api/products";
import { getErrorMessage } from "../api/client";
import { useCart } from "../context/cart-context";
import { useWishlist } from "../context/wishlist-context";
import Button from "../components/Button";
import PageLoader from "../components/PageLoader";
import StarRating from "../components/StarRating";
import { CartIcon, HeartIcon, MinusIcon, PlusIcon } from "../components/Icons";
import { formatDate, formatPrice } from "../utils/format";
import type { ProductDetails } from "../types";

const MAX_QUANTITY = 99;

// Loads the product from the backend, then shows it
export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();

  // We remember WHICH product the result belongs to. While it doesn't match the id in the URL
  // we are still loading (this also handles clicking from one product to another).
  const [result, setResult] = useState<{ id: string; details?: ProductDetails; error?: string } | null>(null);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;
    fetchProductById(id)
      .then((details) => {
        if (!cancelled) setResult({ id, details });
      })
      .catch((err) => {
        if (!cancelled) setResult({ id, error: getErrorMessage(err) });
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (!result || result.id !== id) return <PageLoader />;

  if (!result.details) {
    return (
      <div className="px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <p className="mt-2 text-slate-500">{result.error || "This product doesn't exist or is no longer available."}</p>
        <Link to="/" className="mt-6 inline-block font-semibold text-indigo-600 hover:underline">
          Back to shop
        </Link>
      </div>
    );
  }

  // key={id} resets the quantity picker when you open a different product
  return <ProductView key={id} details={result.details} />;
}

// The actual product page: image, price, quantity picker, buttons and reviews
function ProductView({ details }: { details: ProductDetails }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const { product, averageRating, reviewCount, reviews } = details;
  const saved = isInWishlist(product._id);

  const handleAddToCart = async () => {
    setAdding(true);
    await addToCart(product._id, quantity);
    setAdding(false);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-slate-500">
        <Link to="/" className="hover:text-indigo-600">
          Shop
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-700">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Image */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="aspect-square w-full object-cover" />
          ) : (
            <div className="flex aspect-square items-center justify-center text-slate-400">No image</div>
          )}
        </div>

        {/* Info */}
        <div>
          <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
            {product.category}
          </span>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">{product.name}</h1>

          <div className="mt-3 flex items-center gap-2">
            <StarRating rating={averageRating} />
            <span className="text-sm text-slate-500">
              {reviewCount > 0 ? `${averageRating} (${reviewCount} review${reviewCount === 1 ? "" : "s"})` : "No reviews yet"}
            </span>
          </div>

          <p className="mt-6 text-3xl font-bold text-slate-900">{formatPrice(product.price)}</p>

          <p className="mt-6 whitespace-pre-line leading-relaxed text-slate-600">
            {product.description || "No description available for this product."}
          </p>

          {/* Quantity + buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="flex items-center rounded-lg border border-slate-300 bg-white">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
                className="p-3 text-slate-600 hover:text-indigo-600 disabled:opacity-40"
              >
                <MinusIcon className="h-4 w-4" />
              </button>
              <span className="w-10 text-center font-semibold">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(MAX_QUANTITY, q + 1))}
                disabled={quantity >= MAX_QUANTITY}
                aria-label="Increase quantity"
                className="p-3 text-slate-600 hover:text-indigo-600 disabled:opacity-40"
              >
                <PlusIcon className="h-4 w-4" />
              </button>
            </div>

            <Button onClick={handleAddToCart} loading={adding} className="px-6 py-3">
              <CartIcon className="h-5 w-5" />
              Add to cart
            </Button>

            <Button variant="secondary" onClick={() => toggleWishlist(product)} className="px-4 py-3">
              <HeartIcon filled={saved} className={`h-5 w-5 ${saved ? "text-red-500" : ""}`} />
              {saved ? "Saved" : "Save"}
            </Button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold tracking-tight">Customer reviews</h2>

        {reviews.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white py-12 text-center text-slate-500">
            No reviews yet for this product.
          </div>
        ) : (
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {/* Summary box */}
            <div className="h-fit rounded-2xl border border-slate-200 bg-white p-6 text-center">
              <p className="text-5xl font-extrabold text-slate-900">{averageRating}</p>
              <div className="mt-2 flex justify-center">
                <StarRating rating={averageRating} />
              </div>
              <p className="mt-2 text-sm text-slate-500">
                Based on {reviewCount} review{reviewCount === 1 ? "" : "s"}
              </p>
            </div>

            {/* Review list */}
            <ul className="space-y-4 lg:col-span-2">
              {reviews.map((review) => (
                <li key={review._id} className="rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700">
                        {review.user?.name?.charAt(0).toUpperCase() ?? "?"}
                      </span>
                      <div>
                        <p className="font-semibold text-slate-900">{review.user?.name ?? "Customer"}</p>
                        <p className="text-xs text-slate-500">{formatDate(review.createdAt)}</p>
                      </div>
                    </div>
                    <StarRating rating={review.rating} className="h-4 w-4" />
                  </div>
                  {review.comment && <p className="mt-3 text-slate-600">{review.comment}</p>}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}
