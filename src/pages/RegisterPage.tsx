import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth-context";
import { useToast } from "../context/toast-context";
import { getErrorMessage } from "../api/client";
import AuthCard from "../components/AuthCard";
import Button from "../components/Button";
import TextInput from "../components/TextInput";

export default function RegisterPage() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(name, email, password);
      showToast("Account created. Welcome to Danny's Shop!");
      navigate("/");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Create your account" subtitle="Join Danny's Shop to save favourites and shop faster">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <p className="rounded bg-red-50 p-2 text-sm text-red-600">{error}</p>}

        <TextInput id="name" label="Name" required value={name} onChange={(e) => setName(e.target.value)} />
        <TextInput id="email" label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextInput
          id="password"
          label="Password (min 6 characters)"
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button type="submit" loading={loading} className="w-full py-2.5">
          {loading ? "Creating account..." : "Register"}
        </Button>

        <p className="text-center text-sm">
          Already have an account?{" "}
       

            <Link to="/login" className="text-blue-600 hover:underline cursor-pointer">
            Log in
          </Link> 
         
         
        </p>
      </form>
    </AuthCard>
  );
}
