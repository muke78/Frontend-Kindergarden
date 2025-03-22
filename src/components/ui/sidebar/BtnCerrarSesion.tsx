import { useSidebar } from "@/hooks/useSidebar";
import { useAuthStore } from "@/store/authStore";

import { v } from "@styles/variables";

export const BtnCerrarSesion = () => {
  const { logout } = useAuthStore();
  const { isMobile, sidebarOpen } = useSidebar();
  return (
    <button
      onClick={logout}
      className="flex items-center justify-center w-full px-4 py-2 text-sm text-white font-medium btn btn-secondary btn-circle transition-colors duration-200"
      aria-label="Cerrar sesion"
    >
      <span className="text-xl">
        <v.iconoCerrarSesion />
      </span>
      <span
        className={`ml-2 ${!sidebarOpen && !isMobile ? "hidden" : "block"}`}
      >
        Cerrar sesión
      </span>
    </button>
  );
};
