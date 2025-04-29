import { useSearch } from "@/hooks/Search/useSearch";
import { useTheme } from "@/hooks/Theme/useTheme";
import { useUsers } from "@/hooks/Users/useUsers";

import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import Swal from "sweetalert2";

interface FormDataEdit {
  id: string;
  nameUser: string;
  email: string;
  password?: string;
  role: string;
  accountStatus: string;
}

interface HandleCheckUserParams {
  id: string;
  checked: boolean;
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

  const { data, deleteUser, deleteUserBulk, isLoading, error } = useUsers({
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

  // Callback para manejar el cambio de checkbox
  const handleCheckUser = useCallback(
    ({ id, checked }: HandleCheckUserParams) => {
      setSelectedIds((prev) => {
        if (checked) {
          if (prev.length >= 600) {
            toast.error(
              "Solo puedes seleccionar un máximo de 600 usuarios para la eliminación masiva.",
              {
                duration: 5000,
              },
            );
            return prev;
          }
          return [...prev, id];
        } else {
          return prev.filter((prevId) => prevId !== id);
        }
      });
    },
    [],
  );

  // Callback para manejar el cambio de checkbox "Seleccionar todos"
  const handleCheckAllUsers = useCallback(
    (checked: boolean) => {
      const allChecked = checked;
      setIsChecked(allChecked);
      setSelectedIds(
        allChecked && data?.data
          ? data.data.map((d) => d.ID).slice(0, 600)
          : [],
      );
    },
    [data],
  );

  // Callback para abrir modal de edición
  const handleOpenModal = useCallback((user: FormDataEdit) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  }, []);

  // Callback para cerrar modal de edición
  const handleStatusFilter = useCallback(
    ({ target }: { target: HTMLSelectElement }) => {
      setActiveFilter(target.value);
    },
    [],
  );

  // Callback para filtrar por correo
  const handleStatusFilterCorreo = useCallback(
    ({ target }: { target: HTMLSelectElement }) => {
      setActivateFilterCorreo(target.value);
    },
    [],
  );

  // Callback para filtrar por rol
  const handleStatusFilterRol = useCallback(
    ({ target }: { target: HTMLSelectElement }) => {
      setActivateFilterRol(target.value);
    },
    [],
  );

  // Callback para resetear todos los filtros
  const handleResetFiltersAll = useCallback(() => {
    setActiveFilter("All");
    setActivateFilterCorreo("All");
    setActivateFilterRol("All");
  }, []);

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

  const eliminarSeleccionados = useCallback(() => {
    if (selectedIds.length === 0) return;

    const UMBRAL_DOBLE_CONFIRMACION = 150;
    Swal.fire({
      title: "¿Eliminar seleccionados?",
      text: `Eliminarás ${selectedIds.length} registros.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      theme: changeTheme === "night" ? "dark" : "light",
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (selectedIds.length > UMBRAL_DOBLE_CONFIRMACION) {
          Swal.fire({
            title: "¿Estás MUY seguro?",
            text: `Vas a eliminar permanentemente ${selectedIds.length} registros. Esta acción no se puede deshacer.`,
            icon: "error",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar definitivamente",
            cancelButtonText: "No, prefiero cancelar",
            theme: changeTheme === "night" ? "dark" : "light",
          }).then(async (resultSegundoSwal) => {
            if (resultSegundoSwal.isConfirmed) {
              await deleteUserBulk(selectedIds);
              setSelectedIds([]);
              setIsChecked(false);
            }
          });
        } else {
          await deleteUserBulk(selectedIds);
          setSelectedIds([]);
          setIsChecked(false);
        }
      }
    });
  }, [deleteUserBulk, selectedIds, changeTheme]);

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
    eliminarSeleccionados,
    isChecked,
    selectedIds,
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
    handleResetFiltersAll,
    handleCheckUser,
    handleCheckAllUsers,
  };
};
