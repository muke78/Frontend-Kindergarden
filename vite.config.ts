import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src/"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@config": path.resolve(__dirname, "./src/config"),
      "@helpers": path.resolve(__dirname, "./src/helpers"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@routes": path.resolve(__dirname, "./src/routes"),
      "@schemas": path.resolve(__dirname, "./src/schemas"),
      "@services": path.resolve(__dirname, "./src/services"),
      "@store": path.resolve(__dirname, "./src/store"),
      "@styles": path.resolve(__dirname, "./src/styles"),
      "@type": path.resolve(__dirname, "./src/type"),
      "@utils": path.resolve(__dirname, "./src/utils"),
    },
  },
  server: {
    port: 5173,
    open: true,
    proxy: {},
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("@tanstack/react-query")) {
              return "react-query";
            }
            if (id.includes("axios")) {
              return "axios";
            }
            if (id.includes("react-hot-toast")) {
              return "react-hot-toast";
            }
            if (id.includes("react-icons")) {
              return "react-icons";
            }
            if (id.includes("recharts")) {
              return "recharts";
            }
            if (id.includes("sweetalert2")) {
              return "sweetalert2";
            }
            if (id.includes("@react-oauth/google")) {
              return "google-oauth";
            }
            if (id.includes("query-string")) {
              return "query-string";
            }
            if (id.includes("react-spinners")) {
              return "react-spinners";
            }
            // Agrupa las demás dependencias en 'vendors'
            return "vendors";
          }
          if (id.includes("/components/")) {
            return "components";
          }
          if (id.includes("/hooks/")) {
            return "hooks";
          }
          if (id.includes("/services/")) {
            return "services";
          }
          if (id.includes("/styles/")) {
            return "styles";
          }
        },
      },
    },
  },
});
