import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { forgotPasswordRequest } from "../api/auth";
import { getErrorMessage } from "../api/client";
import { useToast } from "../context/toast-context";
import AuthCard from "../components/AuthCard";
import Button from "../components/Button";
import TextInput from "../components/TextInput";

// Step 1 of resetting a password: the backend emails a 6-digit code
export default function ForgotPasswordPage() {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const message = await forgotPasswordRequest(email);
      showToast(message, "info");
      // Go to step 2 and pass the email along so the user doesn't type it again
      navigate(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Forgot your password?" subtitle="Enter your email and we'll send you a 6-digit reset code.">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <p className="rounded bg-red-50 p-2 text-sm text-red-600">{error}</p>}

        <TextInput id="email" label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />

        <Button type="submit" loading={loading} className="w-full py-2.5">
          {loading ? "Sending..." : "Send reset code"}
        </Button>

        <p className="text-center text-sm">
          <Link to="/login" className="text-indigo-600 hover:underline">
            Back to log in
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}
