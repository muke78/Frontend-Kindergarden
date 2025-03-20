import { useAuthStore } from "@/store/authStore";
import { v } from "@/styles/variables";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: () => void;
}

export const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const { logout } = useAuthStore();
  return (
    <div
      className={`h-screen ${sidebarOpen ? "w-64 max-w-full" : "w-16 max-w-full"} bg-neutral transition-all duration-300`}
    >
      <div
        className={`flex justify-center items-center text-white text-3xl ${sidebarOpen ? "block" : "hidden"}`}
      >
        <img src={v.logoLogin} className="w-14" />
      </div>
      <button onClick={logout} className="btn btn-secondary text-white">
        Logout
      </button>
      <button
        onClick={setSidebarOpen}
        className="btn btn-secondary top-4 right-4 text-white bg-gray-800 p-2 rounded-full"
      >
        {sidebarOpen ? "Close" : "Open"}
      </button>
    </div>
  );
};
