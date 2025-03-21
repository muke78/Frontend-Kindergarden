import { useAuthStore } from "@/store/authStore";
import { useSidebarStore } from "@/store/sidebarStore";
import { v } from "@/styles/variables";

import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

// import { Icon } from "./ui/Icon";

export const Sidebar = () => {
  const { logout } = useAuthStore();
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

  // Elementos de navegación
  const navItems = [
    {
      name: "Inicio",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
      href: "/home",
      active: true,
    },
    {
      name: "Estadísticas",
      icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
      href: "/estadisticas",
    },
    {
      name: "Usuarios",
      icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
      href: "/users",
    },
    {
      name: "Maestros",
      icon: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      href: "/teachers",
    },
    {
      name: "Alumnos",
      icon: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      href: "/students",
    },
    {
      name: "Reportes",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
      href: "/reports",
    },
    {
      name: "Evaluaciones",
      icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
      href: "/evaluations",
    },
    {
      name: "Catalogos",
      icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
      href: "/catalogs",
    },

    {
      name: "Configuración",
      icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
      href: "/config",
    },
    {
      name: "Ayuda",
      icon: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      href: "/help",
    },
  ];

  return (
    <>
      {/* Overlay para móvil */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0  bg-opacity-50 z-40 transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        id="sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-neutral text-white transition-all duration-300 ease-in-out
          ${isMobile ? (sidebarOpen ? "translate-x-0 shadow-lg" : "-translate-x-full") : sidebarOpen ? "w-64" : "w-20"} 
          ${isMobile ? "w-64" : ""}`}
      >
        {/* Logo */}
        <div className="flex justify-center items-center p-4 h-16 border-b border-base-100">
          <img
            src={v.logoLogin}
            alt="Logo"
            className={`transition-all duration-300 ${sidebarOpen || isMobile ? "w-20" : "w-10"}`}
          />
        </div>

        {/* Navegación */}
        <nav
          className={`flex overflow-y-auto  py-4 ${isMobile ? "justify-center" : sidebarOpen ? "justify-start" : "justify-center"}`}
        >
          <ul className="space-y-1 w-full px-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    `flex ${
                      sidebarOpen ? "justify-start" : "justify-center"
                    } px-2 py-3 rounded-lg transition-colors duration-200 ${
                      isActive
                        ? "bg-secondary text-white"
                        : "text-gray-300 hover:bg-secondary hover:text-white"
                    }`
                  }
                  aria-current={item.active ? "page" : undefined}
                >
                  <svg
                    className={`w-6 h-6 ${item.active ? "text-white" : "text-white group-hover:text-white"}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={item.icon}
                    />
                  </svg>
                  <span
                    className={`ml-3 ${!sidebarOpen && !isMobile ? "hidden" : "block"}`}
                  >
                    {item.name}
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-base-100">
          {/* Botón para alternar sidebar en escritorio */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium btn btn-primary btn-circle transition-colors duration-200"
            aria-expanded={sidebarOpen}
            aria-controls="sidebar"
          >
            <span
              className={`ml-2 ${!sidebarOpen && !isMobile ? "hidden" : "block"}`}
            >
              Contraer menú
            </span>
            {sidebarOpen ? (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
          </button>
        </div>
        {/* Botón de cerrar sesión */}
        <div className="p-4 border-t border-base-100">
          <button
            onClick={logout}
            className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium btn btn-primary btn-circle transition-colors duration-200"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span
              className={`ml-2 ${!sidebarOpen && !isMobile ? "hidden" : "block"}`}
            >
              Cerrar sesión
            </span>
          </button>
        </div>
      </aside>

      {/* Botón para abrir/cerrar sidebar cuando sean dispositivos mobile*/}
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
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>
    </>
  );
};
