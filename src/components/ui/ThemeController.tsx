import { Icon } from "@/components/ui/Icon";
import { useSidebar } from "@/hooks/useSidebar";
import { useTheme } from "@/hooks/useTheme";

export const ThemeController = () => {
  const { changeTheme, toggleTheme } = useTheme();
  const { isMobile, sidebarOpen } = useSidebar();

  return (
    <button
      onClick={toggleTheme}
      className="w-full flex  items-center justify-center text-white font-medium btn btn-neutral btn-circle rounded-full"
      aria-label="Cambio de tema"
    >
      {changeTheme === "night" ? (
        <Icon name="iconoLuna" size="text-xl" />
      ) : (
        <Icon name="iconoSol" size="text-xl" />
      )}
      <span
        className={`ml-2 ${!sidebarOpen && !isMobile ? "hidden" : "block"}`}
      >
        Cambio de tema
      </span>
    </button>
  );
};
