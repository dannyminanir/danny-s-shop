import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { checkoutService } from "../services/checkout.service";
import { getErrorMessage } from "../api/client";
import { useAuth } from "../context/auth-context";
import { useCart } from "../context/cart-context";
import Button from "../components/Button";
import PageLoader from "../components/PageLoader";
import { formatPrice } from "../utils/format";

type PaymentState = "idle" | "waiting" | "completed" | "failed" | "unconfirmed";

const POLL_INTERVAL_MS = 3000;
const MAX_POLL_DURATION_MS = 5 * 60 * 1000;

export default function CheckoutPage() {
  const { user } = useAuth();
  const { cart, loading: cartLoading } = useCart();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentState, setPaymentState] = useState<PaymentState>("idle");
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pollWarning, setPollWarning] = useState("");

  useEffect(() => {
    if (!orderId || paymentState !== "waiting") return;

    const controller = new AbortController();
    const deadline = Date.now() + MAX_POLL_DURATION_MS;
    let timer: ReturnType<typeof setTimeout>;

    const checkPayment = async () => {
      try {
        const result = await checkoutService.verifyPaymentStatus(orderId, controller.signal);
        if (controller.signal.aborted) return;

        if (result.paymentStatus === "completed") {
          setPollWarning("");
          setPaymentState("completed");
          return;
        }

        if (result.paymentStatus === "failed") {
          setPollWarning("");
          setPaymentState("failed");
          return;
        }

        if (result.paymentStatus !== "pending") {
          throw new Error("The server returned an unknown payment status.");
        }
        setPollWarning("");
      } catch (err) {
        if (controller.signal.aborted) return;
        setPollWarning(`Could not check payment status: ${getErrorMessage(err)}. Retrying...`);
      }

      if (Date.now() >= deadline) {
        setPaymentState("unconfirmed");
        return;
      }
      timer = setTimeout(checkPayment, POLL_INTERVAL_MS);
    };

    void checkPayment();

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [orderId, paymentState]);

  const handleMomoCheckout = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setPollWarning("");
    setLoading(true);

    try {
      const result = await checkoutService.initiateMomoPayment(phoneNumber.trim());
      if (!result.orderId) {
        throw new Error("The payment service did not return an order reference.");
      }

      setOrderId(result.orderId);
      setPaymentState("waiting");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const retryStatusCheck = () => {
    setPollWarning("");
    setPaymentState("waiting");
  };

  if (cartLoading) return <PageLoader />;

  if (cart.items.length === 0 && paymentState === "idle") {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center sm:py-24">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-slate-500">Add an item to your cart before checking out.</p>
        <Link to="/" className="mt-6 inline-flex rounded-lg bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-700">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:py-14">
      <Link to="/cart" className="text-sm font-medium text-indigo-600 hover:underline">
        Back to cart
      </Link>

      <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight">Mobile money checkout</h1>
        <p className="mt-2 text-sm text-slate-500">
          Enter the MTN Mobile Money number that should receive the payment prompt.
        </p>

        <div className="mt-6 flex items-center justify-between rounded-xl bg-slate-50 p-4">
          <span className="text-sm font-medium text-slate-600">Amount due</span>
          <span className="text-lg font-bold text-indigo-600">{formatPrice(cart.totalPrice)}</span>
        </div>

        {paymentState === "idle" && (
          <form onSubmit={handleMomoCheckout} className="mt-6 space-y-4">
            <div>
              <label htmlFor="phoneNumber" className="mb-1 block text-sm font-medium text-slate-700">
                Payer phone number
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                pattern="[+0-9][0-9 ()-]{7,19}"
                title="Enter a valid phone number, including country code if needed."
                required
                value={phoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
                disabled={loading}
                placeholder="e.g. 0780000000"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-50"
              />
            </div>

            {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

            <Button type="submit" loading={loading} disabled={cart.totalPrice <= 0} className="w-full py-3">
              {loading ? "Starting payment..." : "Pay with MTN Mobile Money"}
            </Button>
          </form>
        )}

        {paymentState === "waiting" && (
          <div role="status" className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
            <p className="font-semibold">Payment request sent</p>
            <p className="mt-1">Approve the prompt on your phone. We’re checking for confirmation.</p>
            <p className="mt-2 break-all text-xs text-blue-700">Order reference: {orderId}</p>
            {pollWarning && <p className="mt-3 text-amber-800">{pollWarning}</p>}
          </div>
        )}

        {paymentState === "completed" && (
          <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
            <p className="font-semibold">Payment confirmed. Thank you for your order!</p>
            {user?.email && <p className="mt-1">The order confirmation email will be sent to {user.email}.</p>}
            <p className="mt-2 break-all text-xs text-emerald-800">Order reference: {orderId}</p>
            <Link to="/" className="mt-4 inline-flex font-semibold text-emerald-800 hover:underline">
              Continue shopping
            </Link>
          </div>
        )}

        {paymentState === "failed" && (
          <div role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <p className="font-semibold">Payment was not completed.</p>
            <p className="mt-1">You can return to your cart and try again.</p>
            <Link to="/cart" className="mt-3 inline-flex font-semibold hover:underline">
              Return to cart
            </Link>
          </div>
        )}

        {paymentState === "unconfirmed" && (
          <div role="alert" className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <p className="font-semibold">Payment status is still unconfirmed.</p>
            <p className="mt-1">
              Your payment may still be processing. Check your phone before retrying to avoid paying twice.
            </p>
            {pollWarning && <p className="mt-2">{pollWarning}</p>}
            <p className="mt-2 break-all text-xs">Order reference: {orderId}</p>
            <Button variant="secondary" onClick={retryStatusCheck} className="mt-4">
              Check status again
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
