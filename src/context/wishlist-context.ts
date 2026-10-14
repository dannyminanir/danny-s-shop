import { createContext, useContext } from "react";
import type { Product } from "../types";

export interface WishlistContextValue {
  products: Product[];
  loading: boolean;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => Promise<void>;
}

export const WishlistContext = createContext<WishlistContextValue | null>(null);

// Use in any component: const { isInWishlist, toggleWishlist } = useWishlist();
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used inside <WishlistProvider>");
  }
  return context;
};
