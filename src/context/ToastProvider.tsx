import { useCallback, useRef, useState, type ReactNode } from "react";
import { ToastContext, type ToastType } from "./toast-context";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

const TOAST_DURATION_MS = 3500;

const toastStyles: Record<ToastType, string> = {
  success: "bg-emerald-600",
  error: "bg-red-600",
  info: "bg-slate-800",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = nextId.current++;
    setToasts((current) => [...current, { id, message, type }]);

    // Remove this toast automatically after a few seconds
    setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, TOAST_DURATION_MS);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col gap-2" aria-live="polite">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg ${toastStyles[toast.type]}`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
