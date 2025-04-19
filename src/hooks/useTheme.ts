import { useEffect } from "react";

import { useThemeStore } from "@store/useThemeStore";

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
