import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext, emptyCart } from "./cart-context";
import { useAuth } from "./auth-context";
import { useToast } from "./toast-context";
import { getErrorMessage } from "../api/client";
import {
  fetchCart,
  addToCartRequest,
  updateCartItemRequest,
  removeCartItemRequest,
  clearCartRequest,
} from "../api/cart";
import type { Cart } from "../types";

// We remember WHOSE cart is stored. If the logged-in user changes (or logs out),
// the stored cart no longer matches and is ignored, so one user never sees another's cart.
interface StoredCart {
  userId: string;
  cart: Cart;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const userId = user?.id;
  const [stored, setStored] = useState<StoredCart | null>(null);

  const hasCartForCurrentUser = stored !== null && stored.userId === userId;
  const cart = hasCartForCurrentUser ? stored.cart : emptyCart;
  const loading = Boolean(userId) && !hasCartForCurrentUser;

  // Load the cart from the backend whenever someone logs in
  useEffect(() => {
    if (!userId) return;

    let cancelled = false;
    fetchCart()
      .then((loadedCart) => {
        if (!cancelled) setStored({ userId, cart: loadedCart });
      })
      .catch(() => {
        // If loading fails the cart simply looks empty
        if (!cancelled) setStored({ userId, cart: emptyCart });
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  // Every cart action works the same way:
  // 1. make sure the user is logged in  2. call the backend  3. save the new cart  4. show a message
  const runAction = async (request: () => Promise<Cart>, successMessage?: string) => {
    if (!userId) {
      showToast("Please log in first", "info");
      navigate("/login", { state: { from: window.location.pathname } });
      return;
    }

    try {
      setStored({ userId, cart: await request() });
      if (successMessage) showToast(successMessage, "success");
    } catch (error) {
      showToast(getErrorMessage(error), "error");
    }
  };

  const addToCart = (productId: string, quantity = 1) =>
    runAction(() => addToCartRequest(productId, quantity), "Added to cart");

  const updateQuantity = (productId: string, quantity: number) =>
    runAction(() => updateCartItemRequest(productId, quantity));

  const removeFromCart = (productId: string) =>
    runAction(() => removeCartItemRequest(productId), "Removed from cart");

  const clearCart = () => runAction(() => clearCartRequest(), "Cart emptied");

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, updateQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}
