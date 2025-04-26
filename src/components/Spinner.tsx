import { useSidebar } from "@/hooks/Sidebar/useSidebar";

import { HashLoader } from "react-spinners";

export const Spinner = () => {
  const { isMobile, sidebarOpen } = useSidebar();
  return (
    <div
      className={`min-h-screen transition-all duration-300 flex justify-center items-center ${
        isMobile ? "ml-0 mt-32" : sidebarOpen ? "ml-64" : "ml-20"
      } animate__animated animate__fadeIn`}
    >
      <HashLoader color="#818cf8" size={200} />
    </div>
  );
};

// Color de modo claro #c93400
