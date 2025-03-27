import { useSidebarStore } from "@/store/sidebarStore";

import { useEffect, useState } from "react";

export const useSidebar = () => {
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

  return {
    isMobile,
    setIsMobile,
    sidebarOpen,
    setSidebarOpen,
  };
};
