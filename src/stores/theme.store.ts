import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "light" | "dark" | "system";

type ThemeState = {
	theme: Theme;
	setTheme: (theme: Theme) => void;
};

export const useThemeStore = create<ThemeState>()(
	persist(
		(set) => ({
			theme: "system",
			setTheme: (theme) => set({ theme }),
		}),
		{ name: "kinder.theme" },
	),
);

export const resolveTheme = (theme: Theme): "light" | "dark" => {
	if (theme === "system") {
		return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
	}
	return theme;
};
