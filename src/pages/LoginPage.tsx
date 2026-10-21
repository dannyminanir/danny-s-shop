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

  // Redirect the user to their previous page after login
  const redirectTo = (location.state as { from?: string } | null)?.from;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loading) return;

    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    // Validate empty fields
    if (!normalizedEmail && !password) {
      setError("Please enter your email address and password.");
      return;
    }

    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }

    // Validate email format
    if (normalizedEmail.length > 254) {
      setError("Email address is too long.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Validate password
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    if (!password.trim()) {
      setError("Password cannot contain only spaces.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password.length > 128) {
      setError("Password cannot exceed 128 characters.");
      return;
    }

    setLoading(true);

    try {
      const user = await login(normalizedEmail, password);

      // Admins go to the admin dashboard; other users follow the redirect
      navigate(
        redirectTo ?? (user.role === "admin" ? "/admin" : "/"),
        { replace: true }
      );
    } catch (err) {
      setError(getErrorMessage(err) || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Log in to your Danny's Shop account"
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {error && (
          <p
            role="alert"
            aria-live="polite"
            className="rounded bg-red-50 p-3 text-sm text-red-600"
          >
            {error}
          </p>
        )}

        <TextInput
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError("");
          }}
        />

        <TextInput
          id="password"
          label="Password (6–128 characters)"
          type="password"
          autoComplete="current-password"
          required
          minLength={6}
          maxLength={128}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (error) setError("");
          }}
        />

        <Button
          type="submit"
          loading={loading}
          disabled={loading}
          className="w-full py-2.5 cursor-pointer"
        >
          {loading ? "Logging in..." : "Log in"}
        </Button>

        <div className="flex justify-between text-sm">
          <Link
            to="/forgot-password"
            className="text-indigo-600 hover:underline"
          >
            Forgot password?
          </Link>

          <Link
            to="/register"
            className="text-indigo-600 hover:underline"
          >
            Create account
          </Link>
        </div>
      </form>
    </AuthCard>
  );
}