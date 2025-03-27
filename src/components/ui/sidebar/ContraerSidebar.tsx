import { useSidebar } from "@/hooks/useSidebar";

import { v } from "@styles/variables";

export const ContraerSidebar = () => {
  const { isMobile, sidebarOpen, setSidebarOpen } = useSidebar();
  return (
    <button
      onClick={() => setSidebarOpen(!sidebarOpen)}
      className="flex items-center justify-center w-full px-4 py-2 text-sm text-white font-medium btn btn-secondary btn-circle transition-colors duration-200"
      aria-expanded={sidebarOpen}
      aria-controls="sidebar"
      aria-label="Contraer sidebar"
    >
      {sidebarOpen ? (
        <span className="text-lg font-bold">
          <v.iconoContraerMenu />
        </span>
      ) : (
        <span className="text-lg font-bold">
          <v.iconDesplegarMenu />
        </span>
      )}
      <span
        className={`ml-2 ${!sidebarOpen && !isMobile ? "hidden" : "block"}`}
      >
        Contraer menú
      </span>
    </button>
  );
};
