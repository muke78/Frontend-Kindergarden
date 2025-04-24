import { useSidebar } from "@/hooks/useSidebar";
import { v } from "@/styles/variables";

export const ImageSidebar = () => {
  const { isMobile, sidebarOpen } = useSidebar();
  return (
    <div className="flex justify-center items-center ">
      <img
        src={v.logoLogin}
        alt="Logo"
        className={`transition-all duration-300 ${sidebarOpen || isMobile ? "w-8" : "w-14"}`}
      />
      <span
        className={`text-2xl font-bold text-base-content pl-2 ${sidebarOpen || isMobile ? "block" : "hidden"}`}
      >
        CRM Kinder
      </span>
    </div>
  );
};
