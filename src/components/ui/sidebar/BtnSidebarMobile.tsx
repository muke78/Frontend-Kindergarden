import { useSidebar } from "@/hooks/useSidebar";
import { useAuthStore } from "@/store/authStore";

import { v } from "@styles/variables";

export const BtnSidebarMobile = () => {
  const { sidebarOpen, setSidebarOpen } = useSidebar();
  const { user, token } = useAuthStore();

  return (
    <button
      id="sidebar-toggle"
      onClick={() => setSidebarOpen(!sidebarOpen)}
      className={`fixed top-4 left-4 z-50 p-2 btn btn-secondary btn-circle text-white md:hidden ${user && token ? "block" : "hidden"}`}
      aria-expanded={sidebarOpen}
      aria-controls="sidebar"
    >
      <span className="sr-only">
        {sidebarOpen ? "Cerrar menú" : "Abrir menú"}
      </span>
      {sidebarOpen ? (
        <span className="text-xl">
          <v.iconoCerrar />
        </span>
      ) : (
        <span className="text-xl">
          <v.iconoMenu />
        </span>
      )}
    </button>
  );
};
