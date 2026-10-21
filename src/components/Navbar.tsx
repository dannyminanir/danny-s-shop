import { useState } from "react";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${isActive ? "text-indigo-600" : "text-slate-600 hover:text-indigo-600"}`;

  const iconLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative rounded-full p-2 transition-colors ${
      isActive ? "bg-indigo-50 text-indigo-600" : "text-slate-600 hover:bg-slate-100 hover:text-indigo-600"
    }`;

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2" onClick={closeMobileMenu}>
          <span className="flex h-20 w-20 items-center justify-center rounded-sm text-white">
           <img src="Danny Logo.png" alt="" />
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
            Danny's <span className="text-indigo-600">Shop</span>
          </span>
        </Link>

        <div className="hidden items-center gap-2 sm:flex sm:gap-4">
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
          </nav>

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
        </div>

        <div className="flex items-center gap-2 sm:hidden">
          <NavLink to="/wishlist" className={iconLinkClass} aria-label="Wishlist" onClick={closeMobileMenu}>
            <HeartIcon className="h-5 w-5" />
            <CountBadge count={wishlistProducts.length} />
          </NavLink>

          <NavLink to="/cart" className={iconLinkClass} aria-label="Cart" onClick={closeMobileMenu}>
            <CartIcon className="h-5 w-5" />
            <CountBadge count={cart.totalItems} />
          </NavLink>

          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-slate-100"
          >
            <span className="sr-only">Open menu</span>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white sm:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            <NavLink to="/" end className={({ isActive }) => `rounded-lg px-3 py-2 text-sm font-medium ${isActive ? "bg-indigo-50 text-indigo-600" : "text-slate-700 hover:bg-slate-100"}`} onClick={closeMobileMenu}>
              Shop
            </NavLink>

            {isAdmin && (
              <NavLink to="/admin" className={({ isActive }) => `rounded-lg px-3 py-2 text-sm font-medium ${isActive ? "bg-indigo-50 text-indigo-600" : "text-slate-700 hover:bg-slate-100"}`} onClick={closeMobileMenu}>
                Admin
              </NavLink>
            )}

            {user ? (
              <>
                <div className="flex items-center gap-3 border-t border-slate-200 pt-3 mt-1 px-3 py-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="text-sm font-medium text-slate-700">{user.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    closeMobileMenu();
                  }}
                  className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={({ isActive }) => `rounded-lg px-3 py-2 text-sm font-medium ${isActive ? "bg-indigo-50 text-indigo-600" : "text-slate-700 hover:bg-slate-100"}`} onClick={closeMobileMenu}>
                  Log in
                </NavLink>
                <Link
                  to="/register"
                  onClick={closeMobileMenu}
                  className="rounded-lg bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                >
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
