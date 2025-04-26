import { useThemeStore } from "@/store/Theme/useThemeStore";

import { useEffect } from "react";

export const useTheme = () => {
  const { theme, setTheme, toggleTheme } = useThemeStore();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return {
    changeTheme: theme,
    setChangeTheme: setTheme,
    toggleTheme,
    mounted: true,
  };
};
