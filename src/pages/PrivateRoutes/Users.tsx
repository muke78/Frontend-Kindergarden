import { TablaUsuarios } from "@/components/ui/Users/TablaUsuarios";
import { useSearch } from "@/hooks/useSearch";
import { useSidebar } from "@/hooks/useSidebar";
import { useUsers } from "@/hooks/useUsers";

import { useState } from "react";
import { Toaster } from "react-hot-toast";

import { ControlUserOptions } from "@components/ui/ControlUserOptions";
import { Icon } from "@components/ui/Icon";
import { MobileCard } from "@components/ui/Users/MobileCard";

import { MotionSearch } from "../../components/ui/Users/MotionSearch";

export const Users = () => {
  const { isMobile, sidebarOpen } = useSidebar();
  const {
    onInputChange,
    onSearchSubmit,
    q,
    searchText,
    showError,
    usersCount,
  } = useSearch();
  const { isLoading, error } = useUsers();
  const [isOpenModalAddUser, setIsOpenModalAddUser] = useState(false);

  if (isLoading) return <p>Cargando usuarios...</p>;
  if (error) return <p>Error al cargar usuarios</p>;

  return (
    <main
      className={`min-h-screen transition-all duration-300 ${
        isMobile ? "ml-0 mt-32" : sidebarOpen ? "ml-64" : "ml-20"
      } animate__animated animate__fadeIn`}
    >
      <div className="grid grid-cols-1 grid-rows-5 gap-3 w-full h-screen p-4 md:p-6 max-w-7xl mx-auto">
        <div className="flex justify-start items-end">
          <span className="text-6xl font-bold">Usuarios</span>
          <ControlUserOptions />
        </div>

        <div className="flex flex-row justify-start items-end gap-2 w-full">
          <form className="flex gap-2 w-1/2" onSubmit={onSearchSubmit}>
            <input
              type="text"
              placeholder="Buscar correo"
              className="input input-bordered text-base-content w-full"
              name="searchText"
              autoComplete="off"
              value={searchText}
              onChange={onInputChange}
            />
            <button className="btn btn-primary">Buscar</button>
          </form>

          <button
            className="btn btn-warning text-2"
            onClick={() => setIsOpenModalAddUser(!isOpenModalAddUser)}
          >
            Crear nuevo usuario
            <Icon name="iconoCrearButton" size="text-lg" />
          </button>
        </div>

        <div className="w-full flex flex-row gap-4 animate__animated animate__fadeIn">
          <MotionSearch value={usersCount} showError={showError} />
          <div
            className="badge badge-soft badge-error animate__animated animate__fadeIn"
            style={{ display: showError ? "" : "none" }}
          >
            No se encontro el usuario <b> {q} </b>
          </div>
        </div>
        <div>
          <TablaUsuarios
            isOpenModalAddUser={isOpenModalAddUser}
            setIsOpenModalAddUser={setIsOpenModalAddUser}
          />
          <MobileCard />
        </div>
      </div>
      <Toaster position="bottom-right" reverseOrder={false} />
    </main>
  );
};
