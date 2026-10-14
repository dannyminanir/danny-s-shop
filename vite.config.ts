import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Requests starting with /api are forwarded to your hosted backend on Render.
    // Because the request is sent by the Vite server, you don't need CORS in development.
    proxy: {
      "/api": {
        target: "https://e-commerce-b-b0i6.onrender.com",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});