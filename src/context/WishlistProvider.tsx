import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { WishlistContext } from "./wishlist-context";
import { useAuth } from "./auth-context";
import { useToast } from "./toast-context";
import { getErrorMessage } from "../api/client";
import { fetchWishlist, addToWishlistRequest, removeFromWishlistRequest } from "../api/wishlist";
import type { Product, Wishlist } from "../types";

const noProducts: Product[] = [];

// We remember WHOSE wishlist is stored, so a different user never sees it
interface StoredWishlist {
  userId: string;
  products: Product[];
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const userId = user?.id;
  const [stored, setStored] = useState<StoredWishlist | null>(null);

  const hasListForCurrentUser = stored !== null && stored.userId === userId;
  const products = hasListForCurrentUser ? stored.products : noProducts;
  const loading = Boolean(userId) && !hasListForCurrentUser;

  // Load the wishlist from the backend whenever someone logs in
  useEffect(() => {
    if (!userId) return;

    let cancelled = false;
    fetchWishlist()
      .then((wishlist) => {
        if (!cancelled) setStored({ userId, products: wishlist.products });
      })
      .catch(() => {
        // If loading fails the wishlist simply looks empty
        if (!cancelled) setStored({ userId, products: noProducts });
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const isInWishlist = (productId: string) => products.some((product) => product._id === productId);

  // The heart button: adds the product if it is not saved yet, removes it if it is
  const toggleWishlist = async (product: Product) => {
    if (!userId) {
      showToast("Please log in first", "info");
      navigate("/login", { state: { from: window.location.pathname } });
      return;
    }

    const saved = isInWishlist(product._id);

    try {
      const wishlist: Wishlist = saved
        ? await removeFromWishlistRequest(product._id)
        : await addToWishlistRequest(product._id);
      setStored({ userId, products: wishlist.products });
      showToast(saved ? "Removed from wishlist" : "Saved to wishlist", "success");
    } catch (error) {
      showToast(getErrorMessage(error), "error");
    }
  };

  return (
    <WishlistContext.Provider value={{ products, loading, isInWishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}
