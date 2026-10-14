import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth-context";
import { getErrorMessage } from "../../api/client";
import Button from "../../components/Button";
import TextInput from "../../components/TextInput";
import { ShopBagIcon } from "../../components/Icons";

export default function AdminLoginPage() {
  const { user, isAdmin, adminLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Already logged in as admin: skip the form
  if (user && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await adminLogin(email, password); // the backend rejects accounts that are not admins
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <ShopBagIcon className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Admin dashboard</h1>
            <p className="text-sm text-slate-500">Danny's Shop</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <p className="rounded bg-red-50 p-2 text-sm text-red-600">{error}</p>}
          {user && !isAdmin && (
            <p className="rounded bg-amber-50 p-2 text-sm text-amber-700">
              You are logged in as a customer. Log in with an admin account to continue.
            </p>
          )}

          <TextInput id="email" label="Admin email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextInput id="password" label="Password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />

          <Button type="submit" loading={loading} className="w-full py-2.5">
            {loading ? "Logging in..." : "Log in to dashboard"}
          </Button>
        </form>

        <Link to="/" className="mt-6 block text-center text-sm text-slate-500 hover:text-indigo-600">
          ← Back to shop
        </Link>
      </div>
    </div>
  );
}
