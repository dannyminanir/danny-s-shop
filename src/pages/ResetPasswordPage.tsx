import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { resetPasswordRequest } from "../api/auth";
import { getErrorMessage } from "../api/client";
import { useToast } from "../context/toast-context";
import AuthCard from "../components/AuthCard";
import Button from "../components/Button";
import TextInput from "../components/TextInput";

// Step 2 of resetting a password: enter the emailed code and choose a new password
export default function ResetPasswordPage() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("The two passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const message = await resetPasswordRequest(email, code.trim(), newPassword);
      showToast(message);
      navigate("/login");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Reset your password" subtitle="Enter the 6-digit code we emailed you (valid for 10 minutes).">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <p className="rounded bg-red-50 p-2 text-sm text-red-600">{error}</p>}

        <TextInput id="email" label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextInput
          id="code"
          label="Reset code"
          required
          inputMode="numeric"
          maxLength={6}
          placeholder="123456"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <TextInput
          id="newPassword"
          label="New password (min 6 characters)"
          type="password"
          required
          minLength={6}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <TextInput
          id="confirmPassword"
          label="Confirm new password"
          type="password"
          required
          minLength={6}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <Button type="submit" loading={loading} className="w-full py-2.5">
          {loading ? "Saving..." : "Reset password"}
        </Button>

        <p className="text-center text-sm">
          <Link to="/forgot-password" className="text-indigo-600 hover:underline">
            Send a new code
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}
