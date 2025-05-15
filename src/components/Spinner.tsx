import { useSidebar } from "@/hooks/Sidebar/useSidebar";

import { HashLoader } from "react-spinners";

import { useTheme } from "@hooks/Theme/useTheme";

export const Spinner = () => {
  const { isMobile, sidebarOpen } = useSidebar();
  const { changeTheme } = useTheme();
  return (
    <div
      className={`min-h-1/2 transition-all duration-300 flex justify-center items-center ${
        isMobile ? "ml-0 mt-32" : sidebarOpen ? "ml-64" : "ml-20"
      } animate__animated animate__fadeIn`}
    >
      <HashLoader
        color={changeTheme === "dim" ? "#ff7d5d" : "#377cfb"}
        size={200}
      />
    </div>
  );
};
