import { createContext, useContext } from "react";
import type { User } from "../types";

export interface AuthContextValue {
  user: User | null;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<User>;
  adminLogin: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

// Use this in any component: const { user, login, logout } = useAuth();
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return context;
};
