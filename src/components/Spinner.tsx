import { useSidebar } from "@/hooks/useSidebar";

import { HashLoader } from "react-spinners";

export const Spinner = () => {
  const { isMobile, sidebarOpen } = useSidebar();
  return (
    <div
      className={`min-h-screen transition-all duration-300 flex justify-center items-center ${
        isMobile ? "ml-0 mt-32" : sidebarOpen ? "ml-64" : "ml-20"
      } animate__animated animate__fadeIn`}
    >
      <HashLoader color="#5f360f" size={200} />
    </div>
  );
};
