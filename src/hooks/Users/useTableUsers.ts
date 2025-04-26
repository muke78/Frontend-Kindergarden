import { useSearch } from "@/hooks/Search/useSearch";
import { useTheme } from "@/hooks/Theme/useTheme";
import { useUsers } from "@/hooks/Users/useUsers";

import { useCallback, useEffect, useMemo, useState } from "react";

import Swal from "sweetalert2";

interface FormDataEdit {
  id: string;
  nameUser: string;
  email: string;
  password?: string;
  role: string;
  accountStatus: string;
}

export const useTableUsers = () => {
  const { changeTheme } = useTheme();

  // Estado para el filtro de estado (controlado por el select)
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [activateFilterCorreo, setActivateFilterCorreo] =
    useState<string>("All");
  const [activateFilterRol, setActivateFilterRol] = useState<string>("All");

  // Otros estados...
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<FormDataEdit>();
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data, deleteUser, isLoading, error } = useUsers({
    status: activeFilter,
    correo: activateFilterCorreo,
    rol: activateFilterRol,
  });

  const { users } = useSearch();

  // Paginacion para la tabla
  const [pagina, setPagina] = useState<number>(1);
  const [porPagina] = useState<number>(6);
  const totalItems =
    users.users.length > 0 ? users.users.length : (data?.data?.length ?? 0);
  const maximo = Math.max(1, Math.ceil(totalItems / porPagina));

  // Constantes memoizadas
  const countData = useMemo(() => data?.metadata?.dataCount ?? 0, [data]);

  const dataToShow = useMemo(() => {
    const startIndex = (pagina - 1) * porPagina;
    const endIndex = startIndex + porPagina;
    return users.users.length > 0
      ? users.users.slice(startIndex, endIndex)
      : (data?.data?.slice(startIndex, endIndex) ?? []);
  }, [data, users, pagina, porPagina]);

  useEffect(() => {
    if (!dataToShow.length) {
      setPagina(1);
    }
  }, [dataToShow]);

  // Callback para eliminar usuario con confirmación
  const eliminar = useCallback(
    (p: string) => {
      Swal.fire({
        title: "¿Estás seguro(a)?",
        text: "Una vez eliminado, ¡no podrá recuperar este registro!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, eliminar",
        theme: changeTheme === "night" ? "dark" : "light",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await deleteUser(p);
        }
      });
    },
    [deleteUser, changeTheme],
  );

  // Callback para abrir modal de edición
  const handleOpenModal = useCallback((user: FormDataEdit) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  }, []);

  const handleStatusFilter = useCallback(
    ({ target }: { target: HTMLSelectElement }) => {
      console.log("handleStatusFilter llamado con valor:", target.value);
      setActiveFilter(target.value);
    },
    [],
  );

  const handleStatusFilterCorreo = useCallback(
    ({ target }: { target: HTMLSelectElement }) => {
      console.log("handleStatusFilter llamado con valor:", target.value);
      setActivateFilterCorreo(target.value);
    },
    [],
  );

  const handleStatusFilterRol = useCallback(
    ({ target }: { target: HTMLSelectElement }) => {
      console.log("handleStatusFilter llamado con valor:", target.value);
      setActivateFilterRol(target.value);
    },
    [],
  );

  const resetFiltersAll = () => {
    setActiveFilter("All");
    setActivateFilterCorreo("All");
    setActivateFilterRol("All");
  };

  return {
    activeFilter,
    activateFilterCorreo,
    activateFilterRol,
    dataToShow,
    pagina,
    setPagina,
    porPagina,
    maximo,
    countData,
    eliminar,
    isLoading,
    error,
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
  };
};
