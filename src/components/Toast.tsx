import { useTheme } from "@/hooks/Theme/useTheme";

import { Toaster } from "react-hot-toast";

export const Toast = () => {
  const { changeTheme } = useTheme();
  return (
    <Toaster
      position="bottom-right"
      reverseOrder={false}
      toastOptions={{
        style: {
          background: `${changeTheme === "dracula" ? "#1d283a" : changeTheme === "pastel" ? "#021431" : "#021431"}`,
          color: `${changeTheme === "dracula" ? "#eceff4" : changeTheme === "pastel" ? "#eceff4" : "#0f172a"}`,
        },
      }}
    />
  );
};
