import { Paginacion } from "@/components/Paginacion";
import { useSearch } from "@/hooks/useSearch";
import { useUsers } from "@/hooks/useUsers";
import { formatDate } from "@/utils/formatDate";
import { getStatusBadge } from "@/utils/statusBadge";

import { useCallback, useMemo, useState } from "react";

import { Icon } from "@components/ui/Icon";
import { ModalEditarUsuario } from "@components/ui/Users/ModalEditarUsuario";
import Swal from "sweetalert2";

interface FormDataEdit {
  id: string;
  nameUser: string;
  email: string;
  password?: string;
  role: string;
  accountStatus: string;
}

export const MobileCard = () => {
  const { data, deleteUser } = useUsers();
  const { users } = useSearch();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<FormDataEdit>();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Paginacuion para la tabla
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
        theme: "dark",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await deleteUser(p);
        }
      });
    },
    [deleteUser],
  );

  // Callback para abrir modal de edición
  const handleOpenModal = useCallback((user: FormDataEdit) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  }, []);

  return (
    <>
      {/* Mobile Card View (shown only on mobile) */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        <Paginacion pagina={pagina} setPagina={setPagina} maximo={maximo} />
        <div className="badge badge-soft badge-secondary mt-2">
          Total de registros {countData}
        </div>
        {dataToShow.map((user) => (
          <div key={user.ID} className="card bg-base-300 shadow-sm">
            <div className="card-body p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="card-title text-2xl">{user.NameUser}</h3>
                  <p className="text-base opacity-70">{user.Email}</p>
                </div>
                <div className="dropdown dropdown-end">
                  <label tabIndex={0} className="btn btn-ghost btn-xs">
                    <Icon name="iconoMasOpciones" size="text-lg" />
                  </label>
                  <ul
                    tabIndex={0}
                    className="dropdown-content z-[1] menu p-1 shadow bg-base-100 rounded-box w-14 flex gap-1"
                  >
                    <li>
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
                    </li>
                    <li>
                      <button
                        className="text-error text-2xl cursor-pointer"
                        aria-label="Boton para eliminar un usuario"
                        onClick={() => eliminar(user.ID)}
                      >
                        <Icon name="iconoBasuraButton" />
                      </button>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="font-semibold opacity-70 text-base">ID</p>
                  <p>{user.ID.slice(0, 6)}</p>
                </div>
                <div>
                  <p className="font-semibold opacity-70 text-base">Rol</p>
                  <p>{user.Role}</p>
                </div>
                <div>
                  <p className="font-semibold opacity-70 text-base">
                    Último inicio
                  </p>
                  <p>{formatDate(user.LastLogin)}</p>
                </div>
                <div>
                  <p className="font-semibold opacity-70 text-base">Status</p>
                  <div className="mt-1">
                    {getStatusBadge(user.AccountStatus)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <ModalEditarUsuario
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
      />
    </>
  );
};
