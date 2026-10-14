import { useState, type ReactNode } from "react";
import { AuthContext } from "./auth-context";
import { loginRequest, adminLoginRequest, registerRequest, logoutRequest } from "../api/auth";
import type { AuthResponse, User } from "../types";

// Read the saved user when the app starts
const readStoredUser = (): User | null => {
  try {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(readStoredUser);

  const saveSession = ({ token, user }: AuthResponse) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    return user;
  };

  const clearSession = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const login = async (email: string, password: string) =>
    saveSession(await loginRequest(email, password));

  const adminLogin = async (email: string, password: string) =>
    saveSession(await adminLoginRequest(email, password));

  const register = async (name: string, email: string, password: string) =>
    saveSession(await registerRequest(name, email, password));

  const logout = async () => {
    try {
      await logoutRequest(); // tells the backend to cancel this token
    } catch {
      // If the token already expired the request fails, but we still log out locally
    }
    clearSession();
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin: user?.role === "admin", login, adminLogin, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
