import axios from "axios";

// "/api" is forwarded to the Render backend by the Vite proxy (development)
// and by the rewrite rule in vercel.json (production).
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api",
});

// Before every request, attach the saved token (if the user is logged in)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the server says our token is no longer valid (expired or logged out), clear the session
// and send the user to the login page. Login requests are skipped because a wrong
// password also returns 401 and must just show an error message.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = String(error.config?.url ?? "").includes("/login");
    const hasToken = Boolean(localStorage.getItem("token"));

    if (axios.isAxiosError(error) && error.response?.status === 401 && hasToken && !isLoginRequest) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.assign("/login");
    }
    return Promise.reject(error);
  }
);

// Turns any error into a readable message, e.g. "Invalid email or password"
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? error.message;
  }
  return "Something went wrong";
};
