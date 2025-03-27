import { TablaUsuarios } from "@/components/ui/Users/TablaUsuarios";
import { useSidebar } from "@/hooks/useSidebar";
import { useUsers } from "@/hooks/useUsers";

import { useState } from "react";
import { Toaster } from "react-hot-toast";

import { ControlUserOptions } from "@components/ui/ControlUserOptions";
import { Icon } from "@components/ui/Icon";
import { MobileCard } from "@components/ui/Users/MobileCard";

export const Users = () => {
  const { isMobile, sidebarOpen } = useSidebar();
  const { isLoading, error } = useUsers();
  const [isOpenModalAddUser, setIsOpenModalAddUser] = useState(false);

  if (isLoading) return <p>Cargando usuarios...</p>;
  if (error) return <p>Error al cargar usuarios</p>;

  return (
    <main
      className={`min-h-screen transition-all duration-300 ${
        isMobile ? "ml-0" : sidebarOpen ? "ml-64" : "ml-20"
      } animate__animated animate__fadeIn`}
    >
      <div className="grid grid-cols-1 grid-rows-6 gap-3 w-full h-screen p-4 md:p-6 max-w-7xl mx-auto">
        <div className="flex justify-start items-end">
          <span className="text-6xl font-bold">Usuarios</span>
          <ControlUserOptions />
        </div>

        <div className="flex justify-start items-end gap-2">
          <input
            type="text"
            placeholder="Buscar"
            className="input input-bordered text-base-content"
          />
          <button className="btn btn-primary">Buscar</button>
          <button
            className="btn btn-warning text-2"
            onClick={() => setIsOpenModalAddUser(!isOpenModalAddUser)}
          >
            Crear nuevo usuario
            <Icon name="iconoCrearButton" size="text-lg" />
          </button>
        </div>
        <TablaUsuarios
          isOpenModalAddUser={isOpenModalAddUser}
          setIsOpenModalAddUser={setIsOpenModalAddUser}
        />
        <MobileCard />
      </div>
      <Toaster position="bottom-right" reverseOrder={false} />
    </main>
  );
};
