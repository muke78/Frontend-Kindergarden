import { useSearch } from "@/hooks/useSearch";
import { useTheme } from "@/hooks/useTheme";
import { useUsers } from "@/hooks/useUsers";

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

export const useTableTask = () => {
  const { changeTheme } = useTheme();

  // Estado para el filtro de estado (controlado por el select)
  const [activeFilter, setActiveFilter] = useState<string>("All");

  // Otros estados...
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<FormDataEdit>();
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data, deleteUser, isLoading, error } = useUsers({
    status: activeFilter,
  });

  const { users } = useSearch();

  console.log("Filtro (dentro del hook):", activeFilter);

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

  console.log(dataToShow);

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

  return {
    activeFilter,
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
  };
};
