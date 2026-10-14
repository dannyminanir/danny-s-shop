import { createContext, useContext } from "react";

export type ToastType = "success" | "error" | "info";

export interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

// Use in any component: const { showToast } = useToast(); showToast("Saved!", "success");
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside <ToastProvider>");
  }
  return context;
};
