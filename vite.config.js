import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/", // ✅ Required for Vercel deployment
  plugins: [react()],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
});
