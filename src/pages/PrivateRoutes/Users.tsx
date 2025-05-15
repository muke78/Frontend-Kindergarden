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
      <div className="grid grid-cols-4 grid-rows-5 gap-4 w-full h-screen p-4 md:p-6 max-w-[86rem] mx-auto">
        <div className="col-span-5 flex justify-start items-end">
          <span className="text-6xl font-bold">Usuarios</span>
        </div>

        <div className="col-span-4 row-start-2 h-fit flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-start gap-2 w-full">
            <div className="flex flex-col md:flex-row md:flex-wrap w-full gap-2">
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
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              {selectedIds.length > 0 && (
                <button
                  className="btn btn-error w-full sm:w-auto"
                  onClick={() => eliminarSeleccionados()}
                >
                  <Icon name="iconoEliminacionMasiva" size="text-2xl" /> (
                  {selectedIds.length})
                </button>
              )}
              <button
                className="btn btn-warning w-full sm:w-auto text-md"
                onClick={() => setIsOpenModalAddUser(!isOpenModalAddUser)}
              >
                <Icon name="iconoCrearButton" size="text-lg" />
                <span>Nuevo usuario</span>
              </button>
            </div>
          </div>

          <div className="w-full flex flex-col sm:flex-row gap-4 animate__animated animate__fadeIn">
            <MotionSearch value={totalItems ?? 0} showError={showError} />
            {showError && (
              <div className="badge badge-soft badge-error animate__animated animate__fadeIn">
                No se encontró el usuario <b>{q}</b>
              </div>
            )}
          </div>
        </div>

        <div className="col-span-5 row-span-3 row-start-3 mt-48 md:-mt-14 lg:-mt-7">
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
