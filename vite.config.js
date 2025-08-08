import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const repoName = "Kaamya-Where-Goals-Meet-Execution"; // GitHub repo name

export default defineConfig({
  base: `/${repoName}/`, // Required for GitHub Pages
  plugins: [react()],
  optimizeDeps: {
    exclude: ["lucide-react"],
  },
});
