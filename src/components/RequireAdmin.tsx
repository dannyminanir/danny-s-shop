import { Link, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/auth-context";

// Wrap the admin pages. This only hides the screens: the backend also
// checks the admin role on every admin request, so it can't be bypassed.
export default function RequireAdmin() {
  const { user, isAdmin } = useAuth();

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Access denied</h1>
        <p className="mt-2 text-slate-500">Your account doesn't have admin permission.</p>
        <Link to="/" className="mt-6 inline-block font-semibold text-indigo-600 hover:underline">
          Back to shop
        </Link>
      </div>
    );
  }

  return <Outlet />;
}
