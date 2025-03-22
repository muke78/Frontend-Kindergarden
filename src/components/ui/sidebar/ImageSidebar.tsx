import { useSidebar } from "@/hooks/useSidebar";
import { v } from "@/styles/variables";

export const ImageSidebar = () => {
  const { isMobile, sidebarOpen } = useSidebar();
  return (
    <div className="flex justify-center items-center ">
      <img
        src={v.logoLogin}
        alt="Logo"
        className={`transition-all duration-300 ${sidebarOpen || isMobile ? "w-16" : "w-10"}`}
      />
      <span
        className={`text-xl pl-2 text-white ${sidebarOpen || isMobile ? "block" : "hidden"}`}
      >
        Admin Kinder
      </span>
    </div>
  );
};
