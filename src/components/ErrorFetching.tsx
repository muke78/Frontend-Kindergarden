import { useSidebar } from "@/hooks/Sidebar/useSidebar";
import { useUsers } from "@/hooks/Users/useUsers";

import { v } from "@styles/variables";

export const ErrorFetching = () => {
  const { isMobile, sidebarOpen } = useSidebar();
  const { error } = useUsers();
  return (
    <main
      className={`min-h-screen transition-all duration-300 ${isMobile ? "ml-0" : sidebarOpen ? "ml-64" : "ml-20"} animate__animated animate__fadeIn`}
    >
      <div className="grid grid-cols-1 grid-rows-5 w-full h-screen">
        <div className="flex justify-center items-center"></div>
        <div className=" flex justify-center items-center row-span-4">
          <div className="flex flex-col justify-center items-center gap-4">
            <img src={v.iconoErrorFetch} alt="Error al cargar la data" />
            <span className="text-2xl">{error?.message}</span>
          </div>
        </div>
      </div>
    </main>
  );
};
