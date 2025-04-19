import { Paginacion } from "@/components/Paginacion";
import { useSearch } from "@/hooks/useSearch";
import { useSidebar } from "@/hooks/useSidebar";
import { useTheme } from "@/hooks/useTheme";
import { useUsers } from "@/hooks/useUsers";

import { useCallback, useEffect, useMemo, useState } from "react";

import { Icon } from "@components/ui/Icon";
import { formatDate } from "@utils/formatDate";
import { getStatusBadge } from "@utils/statusBadge";
import Swal from "sweetalert2";

import { ModalAgregarUsuario } from "./ModalAgregarUsuario";
import { ModalEditarUsuario } from "./ModalEditarUsuario";

interface PropsModalIsOpen {
  isOpenModalAddUser: boolean;
  setIsOpenModalAddUser: React.Dispatch<React.SetStateAction<boolean>>;
}

interface FormDataEdit {
  id: string;
  nameUser: string;
  email: string;
  password?: string;
  role: string;
  accountStatus: string;
}

export const TablaUsuarios = ({
  isOpenModalAddUser,
  setIsOpenModalAddUser,
}: PropsModalIsOpen) => {
  const { data, deleteUser } = useUsers();
  const { changeTheme } = useTheme();
  const { users } = useSearch();
  const { isMobile } = useSidebar();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<FormDataEdit>();

  // Paginacion para la tabla
  const [pagina, setPagina] = useState<number>(1);
  const [porPagina] = useState<number>(7);
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

  return (
    <>
      <div className="hidden md:block overflow-x-auto rounded-md border-t-4 border-neutral bg-base-100 shadow-sm row-start-3">
        <table className="table table-zebra w-full animate__animated animate__fadeIn">
          <thead>
            <tr className="text-left text-md">
              <th>ID</th>
              <th>Avatar</th>
              <th>Nombre de usuario</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Último inicio</th>
              <th>Creado</th>
              <th>Actualizado</th>
              <th>Tipo</th>
              <th>Status</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody className="animate__animated animate__fadeIn">
            {dataToShow.map((user) => (
              <tr key={user.ID} className="hover:bg-base-300 font-medium">
                <td>{user.ID.slice(0, 6)}</td>
                <td>
                  <div className="w-10 h-10 flex items-center justify-center bg-neutral text-neutral-content rounded-full">
                    <span className="font-bold text-lg">
                      {user?.ProfilePicture ? (
                        <img
                          src={user.ProfilePicture}
                          alt={user.NameUser}
                          className="rounded-full w-full object-cover"
                        />
                      ) : (
                        user?.NameUser?.charAt(0)
                      )}
                    </span>
                  </div>
                </td>
                <td>{user.NameUser}</td>
                <td>{user.Email}</td>
                <td>{user.Role}</td>
                <td>{formatDate(user.LastLogin)}</td>
                <td>{formatDate(user.Created)}</td>
                <td>{formatDate(user.Updated)}</td>
                <td>
                  {user.AccountType === "google" ? (
                    <span
                      className="badge text-white"
                      style={{
                        background:
                          "linear-gradient(90deg, rgba(66, 134, 244, 0.7), rgba(234, 68, 53, 0.726), rgba(251, 189, 5, 0.7), rgba(52, 168, 83, 0.7))",
                      }}
                    >
                      Google
                    </span>
                  ) : (
                    <span className="badge badge-secondary">Email</span>
                  )}
                </td>
                <td>{getStatusBadge(user.AccountStatus)}</td>
                <td>
                  <div className="flex justify-center items-center gap-2">
                    <button
                      className="text-info text-2xl cursor-pointer"
                      aria-label="Boton para editar un usuario"
                      onClick={() =>
                        handleOpenModal({
                          id: user.ID,
                          nameUser: user.NameUser,
                          email: user.Email,
                          role: user.Role,
                          accountStatus: user.AccountStatus,
                        })
                      }
                    >
                      <Icon name="iconoEditarButton" />
                    </button>
                    <button
                      className="text-error text-2xl cursor-pointer"
                      aria-label="Boton para eliminar un usuario"
                      onClick={() => eliminar(user.ID)}
                    >
                      <Icon name="iconoBasuraButton" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Paginacion pagina={pagina} setPagina={setPagina} maximo={maximo} />
      </div>

      <ModalAgregarUsuario
        isOpenModalAddUser={isOpenModalAddUser}
        setIsOpenModalAddUser={setIsOpenModalAddUser}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
      />

      <ModalEditarUsuario
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
      />

      <div
        className={`flex justify-end mt-2 w-full ${isMobile ? "hidden" : "block"}`}
      >
        <span className="badge badge-soft badge-secondary">
          Total de registros {countData}
        </span>
      </div>
    </>
  );
};
