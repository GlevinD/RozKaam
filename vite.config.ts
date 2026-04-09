import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname, "client"), // ✅ Your React app folder
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  build: {
    outDir: path.resolve(__dirname, "dist/public"), // ✅ Builds output into dist/public
    emptyOutDir: true,
  },
  server: {
    port: 5173, // ✅ Important! So it doesn't conflict with backend (port 3000)
    fs: {
      strict: true,
      deny: ["**/.env", "**/.env.*"],
    },
  },
});
