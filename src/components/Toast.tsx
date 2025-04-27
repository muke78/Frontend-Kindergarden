import { useTheme } from "@/hooks/Theme/useTheme";

import { Toaster } from "react-hot-toast";

export const Toast = () => {
  const { changeTheme } = useTheme();
  return (
    <Toaster
      position="bottom-center"
      reverseOrder={false}
      toastOptions={{
        style: {
          background: `${changeTheme === "night" ? "#1d283a" : changeTheme === "winter" ? "#021431" : "#021431"}`,
          color: `${changeTheme === "night" ? "#eceff4" : changeTheme === "winter" ? "#eceff4" : "#0f172a"}`,
        },
      }}
    />
  );
};
