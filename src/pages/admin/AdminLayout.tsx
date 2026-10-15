import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/auth-context";
import { ShopBagIcon } from "../../components/Icons";

// The frame around every admin page: dark top bar with navigation
export default function AdminLayout() {
  const { user, logout } = useAuth();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      isActive ? "bg-slate-700 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"
    }`;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="bg-slate-900">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link to="/admin" className="flex items-center gap-2 text-white">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600">
                <ShopBagIcon />
              </span>
              <span className="font-bold">Danny's Shop Admin</span>
            </Link>

            <nav className="flex gap-1">
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

          <div className="flex items-center gap-4 text-sm">
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
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
