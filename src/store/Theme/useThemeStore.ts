import { create } from "zustand";

// Define la interfaz
interface ThemeState {
  theme: string;
  setTheme: (newTheme: string | ((prevTheme: string) => string)) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme:
    typeof window !== "undefined"
      ? localStorage.getItem("theme") || "winter"
      : "winter",

  setTheme: (newTheme) => {
    // Determina el tema a establecer, ya sea directamente o usando la función
    const themeToSet =
      typeof newTheme === "function" ? newTheme(get().theme) : newTheme;

    if (typeof window !== "undefined") {
      document.documentElement.setAttribute("data-theme", themeToSet);
      localStorage.setItem("theme", themeToSet);
    }
    set({ theme: themeToSet });
  },

  toggleTheme: () => {
    set((state) => {
      const newTheme = state.theme === "winter" ? "night" : "winter";
      if (typeof window !== "undefined") {
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
      }
      return { theme: newTheme };
    });
  },
}));
