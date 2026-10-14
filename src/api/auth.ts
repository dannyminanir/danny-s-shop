import { api } from "./client";
import type { AuthResponse } from "../types";

export const loginRequest = async (email: string, password: string) => {
  const response = await api.post<AuthResponse>("/auth/login", { email, password });
  return response.data;
};

export const adminLoginRequest = async (email: string, password: string) => {
  const response = await api.post<AuthResponse>("/admin/login", { email, password });
  return response.data;
};

export const registerRequest = async (name: string, email: string, password: string) => {
  const response = await api.post<AuthResponse>("/auth/register", { name, email, password });
  return response.data;
};

export const logoutRequest = async () => {
  await api.post("/auth/logout");
};

export const forgotPasswordRequest = async (email: string) => {
  const response = await api.post<{ message: string }>("/auth/forgot-password", { email });
  return response.data.message;
};

export const resetPasswordRequest = async (email: string, code: string, newPassword: string) => {
  const response = await api.post<{ message: string }>("/auth/reset-password", { email, code, newPassword });
  return response.data.message;
};
