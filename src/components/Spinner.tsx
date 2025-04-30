import { useSidebar } from "@/hooks/Sidebar/useSidebar";

import { HashLoader } from "react-spinners";

import { useTheme } from "@hooks/Theme/useTheme";

export const Spinner = () => {
  const { isMobile, sidebarOpen } = useSidebar();
  const { changeTheme } = useTheme();
  return (
    <div
      className={`min-h-screen transition-all duration-300 flex justify-center items-center ${
        isMobile ? "ml-0 mt-32" : sidebarOpen ? "ml-64" : "ml-20"
      } animate__animated animate__fadeIn`}
    >
      <HashLoader
        color={changeTheme === "night" ? "#818cf8" : "#463aa2"}
        size={200}
      />
    </div>
  );
};
