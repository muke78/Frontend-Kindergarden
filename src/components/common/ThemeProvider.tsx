import { type ReactNode, useEffect } from "react";

import { resolveTheme, useThemeStore } from "@/stores/theme.store";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
	const theme = useThemeStore((s) => s.theme);

	useEffect(() => {
		const root = document.documentElement;
		const apply = () => {
			const resolved = resolveTheme(theme);
			root.classList.toggle("dark", resolved === "dark");
			root.style.colorScheme = resolved;
		};
		apply();

		if (theme !== "system") return;
		const media = window.matchMedia("(prefers-color-scheme: dark)");
		media.addEventListener("change", apply);
		return () => media.removeEventListener("change", apply);
	}, [theme]);

	return <>{children}</>;
};
