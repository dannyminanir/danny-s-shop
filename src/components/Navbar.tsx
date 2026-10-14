import { Link, NavLink } from "react-router-dom";
import { CartIcon, HeartIcon, ShopBagIcon } from "./Icons";
import { useAuth } from "../context/auth-context";
import { useCart } from "../context/cart-context";
import { useWishlist } from "../context/wishlist-context";

// The small number bubble on top of the cart / wishlist icons
function CountBadge({ count }: { count: number }) {
  if (count === 0) return null;

  return (
    <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1 text-xs font-bold text-white">
      {count > 99 ? "99+" : count}
    </span>
  );
}

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const { cart } = useCart();
  const { products: wishlistProducts } = useWishlist();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${isActive ? "text-indigo-600" : "text-slate-600 hover:text-indigo-600"}`;

  const iconLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative rounded-full p-2 transition-colors ${
      isActive ? "bg-indigo-50 text-indigo-600" : "text-slate-600 hover:bg-slate-100 hover:text-indigo-600"
    }`;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <ShopBagIcon />
          </span>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Danny's <span className="text-indigo-600">Shop</span>
          </span>
        </Link>

        {/* Links + account */}
        <nav className="flex items-center gap-2 sm:gap-4">
          <NavLink to="/" end className={linkClass}>
            Shop
          </NavLink>

          {isAdmin && (
            <NavLink to="/admin" className={linkClass}>
              Admin
            </NavLink>
          )}

          <NavLink to="/wishlist" className={iconLinkClass} aria-label="Wishlist">
            <HeartIcon className="h-6 w-6" />
            <CountBadge count={wishlistProducts.length} />
          </NavLink>

          <NavLink to="/cart" className={iconLinkClass} aria-label="Cart">
            <CartIcon className="h-6 w-6" />
            <CountBadge count={cart.totalItems} />
          </NavLink>

          {user ? (
            <div className="flex items-center gap-3 border-l border-slate-200 pl-3 sm:pl-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
                {user.name.charAt(0).toUpperCase()}
              </span>
              <span className="hidden text-sm font-medium text-slate-700 md:block">{user.name}</span>
              <button
                onClick={logout}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 border-l border-slate-200 pl-3 sm:pl-4">
              <NavLink to="/login" className={linkClass}>
                Log in
              </NavLink>
              <Link
                to="/register"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
              >
                Sign up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
