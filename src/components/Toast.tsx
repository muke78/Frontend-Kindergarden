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
          background: `${changeTheme === "dim" ? "#20252e" : changeTheme === "emerald" ? "#333c4d" : "#333c4d"}`,
          color: `${changeTheme === "dim" ? "#eceff4" : changeTheme === "emerald" ? "#eceff4" : "#0f172a"}`,
        },
      }}
    />
  );
};
