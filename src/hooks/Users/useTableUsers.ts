import { useTheme } from "@/hooks/Theme/useTheme";
import { useListUsers } from "@/hooks/Users/Queries/useListUsers";
import { useUserSearch } from "@/hooks/Users/useUserSearch";
import { useUsers } from "@/hooks/Users/useUsers";

import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

import { useFormSearch } from "@hooks/Search/useFormSearch";
import queryString from "query-string";
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

  // Paginacion para la tabla
  const [pagina, setPagina] = useState<number>(1);
  const [porPagina] = useState<number>(6);

  const { deleteUser, deleteUserBulk } = useUsers();

  const { data, isLoading, error } = useListUsers({
    status: activeFilter,
    correo: activateFilterCorreo,
    rol: activateFilterRol,
  });

  const navigate = useNavigate();
  const location = useLocation();

  const { q = "" } = queryString.parse(location.search) as {
    q: string;
  };

  const { searchText, onInputChange } = useFormSearch({
    searchText: q,
  });

  const { data: searchUserData } = useUserSearch(q);

  const results = searchUserData?.data ?? [];
  const showError = q.length > 0 && results.length === 0;

  const onSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate(`?q=${searchText}`);
  };

  const totalItems =
    (searchUserData?.data.length ?? 0) > 0
      ? searchUserData?.data.length
      : (data?.data?.length ?? 0);

  const maximo = Math.max(1, Math.ceil((totalItems ?? 0) / porPagina));

  // Constantes memoizadas
  const countData = useMemo(() => data?.metadata?.dataCount ?? 0, [data]);

  const dataToShow = useMemo(() => {
    const startIndex = (pagina - 1) * porPagina;
    const endIndex = startIndex + porPagina;

    if (searchUserData) {
      // Si la búsqueda está activa y devolvió un usuario, regresamos un array con ese único usuario
      return searchUserData.data.slice(startIndex, endIndex);
    }

    // Si no hay búsqueda, usamos la lista general paginada
    return data?.data?.slice(startIndex, endIndex) ?? [];
  }, [data, searchUserData, pagina, porPagina]);

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
        theme: changeTheme === "dim" ? "dark" : "light",
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

    // Umbral del tamaño de datos seleccionados maximo para mostrar un segundo
    // mensaje de confirmacion para borrar los datos seleccioandos
    const UMBRAL_DOBLE_CONFIRMACION = 10;

    // Capturamos la cantidad de elementos ANTES de la eliminación y en el filtro actual
    const currentFilteredCount = data?.data?.length ?? 0;
    const deletingAllFiltered =
      selectedIds.length > 0 && selectedIds.length === currentFilteredCount;

    Swal.fire({
      title: "¿Eliminar seleccionados?",
      text: `Eliminarás ${selectedIds.length} registros.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      theme: changeTheme === "dim" ? "dark" : "light",
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
            theme: changeTheme === "dim" ? "dark" : "light",
          }).then(async (resultSegundoSwal) => {
            if (resultSegundoSwal.isConfirmed) {
              await deleteUserBulk(selectedIds);
              setSelectedIds([]);
              setIsChecked(false);

              if (deletingAllFiltered) {
                setActiveFilter("All");
                setActivateFilterCorreo("All");
                setActivateFilterRol("All");
                // Opcional: resetear paginación solo si cambias el filtro principal
                setPagina(1);
              }
            }
          });
        } else {
          await deleteUserBulk(selectedIds);
          setSelectedIds([]);
          setIsChecked(false);
          if (deletingAllFiltered) {
            setActiveFilter("All");
            setActivateFilterCorreo("All");
            setActivateFilterRol("All");
            // Opcional: resetear paginación solo si cambias el filtro principal
            setPagina(1);
          }
        }
      }
    });
  }, [deleteUserBulk, selectedIds, changeTheme, data?.data?.length]);

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

    totalItems,
    onSearchSubmit,
    searchText,
    onInputChange,
    showError,
    q,
  };
};
