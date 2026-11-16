import path from "node:path";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// `TAURI_ENV_*` vars are injected by the Tauri CLI at dev/build time
const isTauriBuild = process.env.TAURI_ENV_PLATFORM !== undefined;

export default defineConfig({
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	// Tauri needs a fixed port and no browser-open in desktop mode
	clearScreen: false,
	server: {
		port: 5173,
		strictPort: true,
		open: false,
		watch: {
			// Ignore the Rust source tree so Vite HMR doesn't restart on Cargo changes
			ignored: ["**/src-tauri/**"],
		},
	},
	build: {
		// Tauri uses Chromium on Windows (ES2021+); keep es2022 for web builds too
		target: isTauriBuild ? "es2021" : "es2022",
		sourcemap: false,
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (!id.includes("node_modules")) return;
					if (id.includes("@tanstack/react-query")) return "react-query";
					if (id.includes("@tanstack/react-table")) return "react-table";
					if (id.includes("react-router")) return "react-router";
					if (id.includes("@radix-ui")) return "radix";
					if (id.includes("recharts")) return "recharts";
					if (id.includes("lucide-react")) return "lucide";
					if (
						id.includes("zod") ||
						id.includes("react-hook-form") ||
						id.includes("@hookform/resolvers")
					)
						return "forms";
					return "vendors";
				},
			},
		},
	},
});
