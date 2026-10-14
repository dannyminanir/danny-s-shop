import { createContext, useContext } from "react";
import type { Cart } from "../types";

export const emptyCart: Cart = { items: [], totalItems: 0, totalPrice: 0 };

export interface CartContextValue {
  cart: Cart;
  loading: boolean;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const CartContext = createContext<CartContextValue | null>(null);

// Use in any component: const { cart, addToCart } = useCart();
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside <CartProvider>");
  }
  return context;
};
