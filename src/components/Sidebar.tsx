import { useSidebar } from "@/hooks/useSidebar";
import { useAuthStore } from "@/store/authStore";

import { useLocation } from "react-router-dom";

import { BtnSidebarMobile } from "@components/ui/Sidebar/BtnSidebarMobile";
import { ContraerSidebar } from "@components/ui/Sidebar/ContraerSidebar";
import { ImageSidebar } from "@components/ui/Sidebar/ImageSidebar";
import { SidebarItems } from "@components/ui/Sidebar/SidebarItems";
import { ThemeController } from "@components/ui/ThemeController";

export const Sidebar = () => {
  const { user, token } = useAuthStore();
  const { pathname, search } = useLocation();
  const { isMobile, sidebarOpen } = useSidebar();

  const lastPath = pathname + search;
  localStorage.setItem("lastPath", lastPath);

  return (
    <>
      {/* Overlay para móvil */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-opacity-50 z-40 transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        id="sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-base-300 transition-transform duration-400 ease-in-out
          ${isMobile ? (sidebarOpen ? "translate-x-0 shadow-lg" : "-translate-x-full") : sidebarOpen ? "w-64" : "w-20"} 
          ${isMobile ? "w-64" : ""} ${user && token ? "block" : "hidden"}`}
      >
        {/* Logo */}
        <div className="flex justify-center items-center h-16 border-b border-base-content/30">
          <ImageSidebar />
        </div>

        {/* Navegación */}
        <SidebarItems />

        {/* Botón para alternar sidebar en escritorio */}
        <div className="p-4 border-t border-base-content/30">
          <ContraerSidebar />
        </div>
        <div className="p-4 border-t border-base-content/30">
          <ThemeController />
        </div>
      </aside>

      {/* Botón para abrir/cerrar sidebar cuando sean dispositivos mobile*/}
      <BtnSidebarMobile />
    </>
  );
};
