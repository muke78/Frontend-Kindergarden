import { Spinner } from "@/components/Spinner";
import { FiltersTableUsers } from "@/components/ui/Users/FiltersTableUsers";
import { TablaUsuarios } from "@/components/ui/Users/TablaUsuarios";
import { useSidebar } from "@/hooks/Sidebar/useSidebar";
import { useTableUsers } from "@/hooks/Users/useTableUsers";

import { useState } from "react";

import { Icon } from "@components/ui/Icon";
// import { MobileCard } from "@components/ui/Users/MobileCard";
import { MotionSearch } from "@components/ui/Users/MotionSearch";

// import { ErrorFetching } from "@/components/ErrorFetching";

export const Users = () => {
  const { isMobile, sidebarOpen } = useSidebar();
  const {
    activeFilter,
    activateFilterCorreo,
    activateFilterRol,
    isLoading,
    dataToShow,
    pagina,
    setPagina,
    maximo,
    countData,
    eliminar,
    eliminarSeleccionados,
    isChecked,
    selectedIds,
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
    handleResetFiltersAll,
    handleCheckUser,
    handleCheckAllUsers,
    onSearchSubmit,
    searchText,
    onInputChange,
    showError,
    q,
    totalItems,
  } = useTableUsers();

  const [isOpenModalAddUser, setIsOpenModalAddUser] = useState(false);

  // if (error)
  //   return (
  //     <>
  //       <ErrorFetching />
  //     </>
  //   );

  return (
    <main
      className={`min-h-screen transition-all duration-300 ${
        isMobile ? "ml-0" : sidebarOpen ? "ml-64" : "ml-20"
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
              handleResetFiltersAll={handleResetFiltersAll}
            />
            {selectedIds.length > 0 && (
              <button
                className="btn btn-error"
                onClick={() => eliminarSeleccionados()}
              >
                <Icon name="iconoEliminacionMasiva" size="text-2xl" /> (
                {selectedIds.length})
              </button>
            )}
            <button
              className="btn btn-warning text-md rounded-r-lg"
              onClick={() => setIsOpenModalAddUser(!isOpenModalAddUser)}
            >
              <Icon name="iconoCrearButton" size="text-lg" />
              <span>Nuevo usuario</span>
            </button>
          </div>

          <div className="w-full flex flex-row gap-4 animate__animated animate__fadeIn">
            <MotionSearch value={totalItems ?? 0} showError={showError} />
            <div
              className="badge badge-soft badge-error animate__animated animate__fadeIn"
              style={{ display: showError ? "" : "none" }}
            >
              No se encontro el usuario <b> {q} </b>
            </div>
          </div>
        </div>

        <div
          className={`gap-4 col-span-5 row-span-3 row-start-3  ${isLoading ? "-mt-80" : "-mt-12"}`}
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
              isChecked={isChecked}
              onCheckAll={handleCheckAllUsers}
              selectedIds={selectedIds}
              onCheckTask={handleCheckUser}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
              handleOpenModal={handleOpenModal}
              isOpenModalAddUser={isOpenModalAddUser}
              setIsOpenModalAddUser={setIsOpenModalAddUser}
            />
          )}
        </div>
      </div>
    </main>
  );
};
