import { useSidebar } from "@/hooks/useSidebar";

import { v } from "@styles/variables";

export const BtnSidebarMobile = () => {
  const { sidebarOpen, setSidebarOpen } = useSidebar();

  return (
    <button
      id="sidebar-toggle"
      onClick={() => setSidebarOpen(!sidebarOpen)}
      className="fixed top-4 left-4 z-50 p-2 btn btn-secondary btn-circle text-white md:hidden"
      aria-expanded={sidebarOpen}
      aria-controls="sidebar"
    >
      <span className="sr-only">
        {sidebarOpen ? "Cerrar menú" : "Abrir menú"}
      </span>
      {sidebarOpen ? (
        <span className="text-xl">
          <v.iconCerrar />
        </span>
      ) : (
        <span className="text-xl">
          <v.iconoMenu />
        </span>
      )}
    </button>
  );
};
