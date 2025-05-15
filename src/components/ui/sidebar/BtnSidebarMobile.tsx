import { useSidebar } from "@/hooks/Sidebar/useSidebar";
import { useAuthStore } from "@/store/Auth/authStore";

import { Icon } from "@components/ui/Icon";

export const BtnSidebarMobile = () => {
  const { sidebarOpen, setSidebarOpen } = useSidebar();
  const { user, token } = useAuthStore();

  return (
    <button
      id="sidebar-toggle"
      onClick={() => setSidebarOpen(!sidebarOpen)}
      className={`fixed flex justify-center top-4 left-4 z-50 p-2 btn btn-secondary btn-circle text-white min-[1243px]:hidden ${user && token ? "block" : "hidden"}`}
      aria-expanded={sidebarOpen}
      aria-controls="sidebar"
    >
      <span className="sr-only">
        {sidebarOpen ? "Cerrar menú" : "Abrir menú"}
      </span>
      {sidebarOpen ? (
        <Icon name="iconoCerrar" size="text-xl" />
      ) : (
        <Icon name="iconoMenu" size="text-xl" />
      )}
    </button>
  );
};
