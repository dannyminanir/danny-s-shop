import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth-context";
import { getErrorMessage } from "../api/client";
import AuthCard from "../components/AuthCard";
import Button from "../components/Button";
import TextInput from "../components/TextInput";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If the user was sent here from a protected page, go back there after logging in
  const redirectTo = (location.state as { from?: string } | null)?.from;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault(); // stop the browser from reloading the page
    setError("");
    setLoading(true);

    try {
      const user = await login(email, password);
      // Admins land on the dashboard, everyone else goes back to where they were
      navigate(redirectTo ?? (user.role === "admin" ? "/admin" : "/"), { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Welcome back" subtitle="Log in to your Danny's Shop account">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <p className="rounded bg-red-50 p-2 text-sm text-red-600">{error}</p>}

        <TextInput id="email" label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextInput id="password" label="Password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />

        <Button type="submit" loading={loading} className="w-full py-2.5">
          {loading ? "Logging in..." : "Log in"}
        </Button>

        <div className="flex justify-between text-sm">
          <Link to="/forgot-password" className="text-indigo-600 hover:underline">
            Forgot password?
          </Link>
          <Link to="/register" className="text-indigo-600 hover:underline">
            Create account
          </Link>
        </div>
      </form>
    </AuthCard>
  );
}
