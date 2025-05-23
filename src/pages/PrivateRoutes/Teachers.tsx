import { useSidebar } from "@/hooks/Sidebar/useSidebar";

// import { useAuthStore } from "@/store/authStore";
export const Teachers = () => {
  // const { user } = useAuthStore();
  const { isMobile, sidebarOpen } = useSidebar();

  return (
    <main
      className={`min-h-screen transition-all duration-300 ${isMobile ? "ml-0" : sidebarOpen ? "ml-64" : "ml-20"} animate__animated animate__fadeIn`}
    >
      <div className="grid grid-cols-1 grid-rows-5 w-full h-screen">
        <div className="flex justify-center items-center">
          <span className="text-2xl font-bold">Maestros</span>
        </div>
        <div className=" flex justify-center items-center bg-blue-700 row-span-4">
          Contenido de la aplicacion
        </div>
      </div>
    </main>
  );
};
