import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/cart-context";
import { useToast } from "../context/toast-context";
import Button from "../components/Button";
import ConfirmDialog from "../components/ConfirmDialog";
import PageLoader from "../components/PageLoader";
import { MinusIcon, PlusIcon, TrashIcon } from "../components/Icons";
import { formatPrice } from "../utils/format";

const MAX_QUANTITY = 99;

export default function CartPage() {
  const { cart, loading, updateQuantity, removeFromCart, clearCart } = useCart();
  const { showToast } = useToast();
  const [confirmingClear, setConfirmingClear] = useState(false);

  if (loading && cart.items.length === 0) return <PageLoader />;

  // Empty cart
  if (cart.items.length === 0) {
    return (
      <div className="px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-slate-500">Looks like you haven't added anything yet.</p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-lg bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-700"
        >
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-end justify-between">
        <h1 className="text-3xl font-extrabold tracking-tight">Shopping cart</h1>
        <button onClick={() => setConfirmingClear(true)} className="text-sm font-medium text-red-600 hover:underline">
          Empty cart
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Items */}
        <ul className="space-y-4 lg:col-span-2">
          {cart.items.map(({ product, quantity, subtotal }) => (
            <li key={product._id} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4">
              <Link to={`/products/${product._id}`} className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-28 sm:w-28">
                {product.imageUrl && <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />}
              </Link>

              <div className="flex flex-1 flex-col justify-between">
                <div className="flex justify-between gap-2">
                  <div>
                    <Link to={`/products/${product._id}`} className="font-semibold text-slate-900 hover:text-indigo-600">
                      {product.name}
                    </Link>
                    <p className="text-sm text-slate-500">{product.category}</p>
                  </div>
                  <button
                    onClick={() => removeFromCart(product._id)}
                    aria-label={`Remove ${product.name}`}
                    className="h-fit p-1 text-slate-400 hover:text-red-600"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded-lg border border-slate-300">
                    <button
                      onClick={() => updateQuantity(product._id, quantity - 1)}
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                      className="p-2 text-slate-600 hover:text-indigo-600 disabled:opacity-40"
                    >
                      <MinusIcon className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product._id, quantity + 1)}
                      disabled={quantity >= MAX_QUANTITY}
                      aria-label="Increase quantity"
                      className="p-2 text-slate-600 hover:text-indigo-600 disabled:opacity-40"
                    >
                      <PlusIcon className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-slate-900">{formatPrice(subtotal)}</p>
                    {quantity > 1 && <p className="text-xs text-slate-500">{formatPrice(product.price)} each</p>}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Order summary */}
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-bold">Order summary</h2>

          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Items</dt>
              <dd className="font-medium">{cart.totalItems}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Shipping</dt>
              <dd className="font-medium">Calculated at checkout</dd>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-3 text-base">
              <dt className="font-semibold">Total</dt>
              <dd className="font-bold text-indigo-600">{formatPrice(cart.totalPrice)}</dd>
            </div>
          </dl>

          {/* Checkout is not part of the backend yet, so we are honest about it */}
          <Button
            onClick={() => showToast("Checkout is coming soon", "info")}
            className="mt-6 w-full py-3"
          >
            Proceed to checkout
          </Button>
          <Link to="/" className="mt-3 block text-center text-sm font-medium text-indigo-600 hover:underline">
            Continue shopping
          </Link>
        </aside>
      </div>

      <ConfirmDialog
        open={confirmingClear}
        title="Empty your cart?"
        message="All items will be removed from your cart."
        confirmLabel="Empty cart"
        onConfirm={async () => {
          await clearCart();
          setConfirmingClear(false);
        }}
        onCancel={() => setConfirmingClear(false)}
      />
    </div>
  );
}
