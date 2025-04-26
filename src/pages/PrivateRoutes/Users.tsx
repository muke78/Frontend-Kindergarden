import { Spinner } from "@/components/Spinner";
import { FiltersTableUsers } from "@/components/ui/Users/FiltersTableUsers";
import { TablaUsuarios } from "@/components/ui/Users/TablaUsuarios";
import { useSearch } from "@/hooks/Search/useSearch";
import { useSidebar } from "@/hooks/Sidebar/useSidebar";
import { useTableUsers } from "@/hooks/Users/useTableUsers";

import { useState } from "react";

import { Icon } from "@components/ui/Icon";
import { MobileCard } from "@components/ui/Users/MobileCard";
import { MotionSearch } from "@components/ui/Users/MotionSearch";

export const Users = () => {
  const { isMobile, sidebarOpen } = useSidebar();
  const {
    activeFilter,
    activateFilterCorreo,
    activateFilterRol,
    isLoading,
    error,
    dataToShow,
    pagina,
    setPagina,
    maximo,
    countData,
    eliminar,
    showPassword,
    setShowPassword,
    isModalOpen,
    setIsModalOpen,
    selectedUser,
    setSelectedUser,
    handleOpenModal,
    handleStatusFilter,
    handleStatusFilterCorreo,
    handleStatusFilterRol,
    resetFiltersAll,
  } = useTableUsers();
  const {
    onInputChange,
    onSearchSubmit,
    q,
    searchText,
    showError,
    usersCount,
  } = useSearch();

  const [isOpenModalAddUser, setIsOpenModalAddUser] = useState(false);

  return (
    <main
      className={`min-h-screen transition-all duration-300 ${
        isMobile ? "ml-0 mt-32" : sidebarOpen ? "ml-64" : "ml-20"
      } animate__animated animate__fadeIn`}
    >
      <div className="grid grid-cols-5 grid-rows-5 gap-4 w-full h-screen p-4 md:p-6 max-w-[86rem] mx-auto">
        <div className="col-span-5 flex justify-start items-end">
          <span className="text-6xl font-bold">Usuarios</span>
        </div>

        <div className="col-span-5 row-start-2 h-1/2 flex flex-col gap-4">
          <div className="flex flex-row justify-start items-end join w-full lg:w-3/4">
            <FiltersTableUsers
              onSearchSubmit={onSearchSubmit}
              searchText={searchText}
              onInputChange={onInputChange}
              activeFilter={activeFilter}
              handleStatusFilter={handleStatusFilter}
              activateFilterCorreo={activateFilterCorreo}
              handleStatusFilterCorreo={handleStatusFilterCorreo}
              activateFilterRol={activateFilterRol}
              handleStatusFilterRol={handleStatusFilterRol}
              resetFiltersAll={resetFiltersAll}
            />
            <button
              className="btn btn-warning text-2 rounded-r-lg"
              onClick={() => setIsOpenModalAddUser(!isOpenModalAddUser)}
            >
              <Icon name="iconoCrearButton" size="text-lg" />
              <span>Nuevo usuario</span>
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
        </div>
        <div
          className={`col-span-5 row-span-3 row-start-3  ${isLoading ? "-mt-80" : "-mt-12"}`}
        >
          {isLoading ? (
            <Spinner />
          ) : (
            <TablaUsuarios
              dataToShow={dataToShow}
              pagina={pagina}
              setPagina={setPagina}
              maximo={maximo}
              countData={countData}
              eliminar={eliminar}
              isMobile={isMobile}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
              handleOpenModal={handleOpenModal}
              isOpenModalAddUser={isOpenModalAddUser}
              setIsOpenModalAddUser={setIsOpenModalAddUser}
              isLoading={isLoading}
              error={error}
            />
          )}
          <MobileCard />
        </div>
      </div>
    </main>
  );
};
