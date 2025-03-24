import { useSidebar } from "@/hooks/useSidebar";
import { useAuthStore } from "@/store/authStore";

import { useLocation } from "react-router-dom";

import { BtnSidebarMobile } from "@components//ui/sidebar/BtnSidebarMobile";
import { ImageSidebar } from "@components//ui/sidebar/ImageSidebar";
import { ContraerSidebar } from "@components/ui/sidebar/ContraerSidebar";
import { SidebarItems } from "@components/ui/sidebar/SidebarItems";

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
          className="fixed inset-0  bg-opacity-50 z-40 transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        id="sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-neutral text-white transition-all duration-300 ease-in-out rounded-r-lg
          ${isMobile ? (sidebarOpen ? "translate-x-0 shadow-lg" : "-translate-x-full") : sidebarOpen ? "w-64" : "w-20"} 
          ${isMobile ? "w-64" : ""} ${user && token ? "block" : "hidden"}`}
      >
        {/* Logo */}
        <div className="flex justify-center items-center h-16 border-b border-base-300/40">
          <ImageSidebar />
        </div>

        {/* Navegación */}
        <SidebarItems />

        {/* Botón para alternar sidebar en escritorio */}
        <div className="p-4 border-t border-base-300/40">
          <ContraerSidebar />
        </div>
      </aside>

      {/* Botón para abrir/cerrar sidebar cuando sean dispositivos mobile*/}
      <BtnSidebarMobile />
    </>
  );
};
