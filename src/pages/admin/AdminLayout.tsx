import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/auth-context";
import { ShopBagIcon } from "../../components/Icons";

// The frame around every admin page: dark top bar with navigation
export default function AdminLayout() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive ? "bg-slate-700 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }`;

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="bg-slate-600">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3 sm:gap-6">
            <Link to="/admin" className="flex min-w-0 items-center gap-2 text-white" onClick={closeMobileMenu}>
              <span className="flex h-20 w-20 items-center justify-center rounded-sm text-white">
                <img src="Danny Logo.png" alt="" />
              </span>
              <span className="truncate font-bold">Danny's Shop Admin</span>
            </Link>

            <nav className="hidden gap-1 sm:flex">
              <NavLink to="/admin" end className={linkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/admin/products" className={linkClass}>
                Products
              </NavLink>
              <NavLink to="/admin/orders" className={linkClass}>
                Orders
              </NavLink>
            </nav>
          </div>

          <div className="hidden items-center gap-4 text-sm sm:flex">
            <Link to="/" className="text-slate-300 hover:text-white">
              View shop
            </Link>
            <span className="hidden text-slate-400 sm:block">{user?.email}</span>
            <button
              onClick={logout}
              className="rounded-lg border border-slate-600 px-3 py-1.5 font-medium text-slate-200 hover:bg-slate-800"
            >
              Log out
            </button>
          </div>

          <button
            type="button"
            aria-label={mobileMenuOpen ? "Close admin menu" : "Open admin menu"}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-700 text-slate-200 hover:bg-slate-800 sm:hidden"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="m6 6 12 12M18 6 6 18" />
              ) : (
                <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-slate-700 px-4 py-3 sm:hidden">
            <nav className="flex flex-col gap-1">
              <NavLink to="/admin" end className={linkClass} onClick={closeMobileMenu}>
                Dashboard
              </NavLink>
              <NavLink to="/admin/products" className={linkClass} onClick={closeMobileMenu}>
                Products
              </NavLink>
              <NavLink to="/admin/orders" className={linkClass} onClick={closeMobileMenu}>
                Orders
              </NavLink>
            </nav>
            <div className="mt-3 flex flex-col gap-3 border-t border-slate-700 pt-3 text-sm">
              {user?.email && <span className="break-all text-slate-400">{user.email}</span>}
              <Link to="/" onClick={closeMobileMenu} className="text-slate-300 hover:text-white">
                View shop
              </Link>
              <button
                type="button"
                onClick={() => {
                  closeMobileMenu();
                  logout();
                }}
                className="self-start rounded-lg border border-slate-600 px-3 py-1.5 font-medium text-slate-200 hover:bg-slate-800"
              >
                Log out
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
