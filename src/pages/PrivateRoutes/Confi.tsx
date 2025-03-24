import { useSidebar } from "@/hooks/useSidebar";

export const Confi = () => {
  const { isMobile, sidebarOpen } = useSidebar();

  return (
    <main
      className={`min-h-screen transition-all duration-300 ${isMobile ? "ml-0" : sidebarOpen ? "ml-64" : "ml-20"} animate__animated animate__fadeIn`}
    >
      <div className="grid grid-cols-1 grid-rows-5 w-full h-screen">
        <div className="bg-yellow-700 flex justify-center items-center">
          {" "}
          Contenido para el dropdown user options
        </div>
        <div className=" flex justify-center items-center bg-blue-700 row-span-4">
          Contenido de la aplicacion
        </div>
      </div>
    </main>
  );
};
