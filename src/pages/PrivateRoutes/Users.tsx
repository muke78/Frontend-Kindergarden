import { useSidebarStore } from "@/store/sidebarStore";

import { useContext, useEffect, useState } from "react";

import { AuthContext } from "@context/AuthContext";

export const Users = () => {
  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  const { sidebarOpen, setSidebarOpen } = useSidebarStore();
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Detectar si es dispositivo móvil
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Comprobar al cargar y al cambiar el tamaño de la ventana
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  // Cerrar sidebar al hacer clic fuera en móvil
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        isMobile &&
        sidebarOpen &&
        !target.closest("#sidebar") &&
        !target.closest("#sidebar-toggle")
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobile, sidebarOpen, setSidebarOpen]);

  // Prevenir scroll cuando el sidebar está abierto en móvil
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobile, sidebarOpen]);
  return (
    <main
      className={`min-h-screen transition-all duration-300 ${isMobile ? "ml-0" : sidebarOpen ? "ml-64" : "ml-20"} animate__animated animate__fadeIn`}
    >
      <div className="grid grid-rows-4 w-full h-screen">
        <div className="bg-yellow-700 flex justify-center items-center">
          {" "}
          <code>{user?.id}</code>
        </div>
        <div className="bg-red-700 row-start-2 flex justify-center items-center">
          2
        </div>
        <div className="bg-blue-700 row-start-3 flex justify-center items-center">
          3
        </div>
        <div className="bg-green-700 row-start-4 flex justify-center items-center">
          4
        </div>
      </div>
    </main>
  );
};
