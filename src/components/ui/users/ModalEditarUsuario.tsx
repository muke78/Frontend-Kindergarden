import { useUsers } from "@/hooks/useUsers";

import { useCallback } from "react";

import { Icon } from "@components/ui/Icon";
import { Modal } from "@components/ui/Modal/Modal";

export interface UserData {
  id: string;
  nameUser: string;
  email: string;
  role: string;
  accountStatus: string;
  password?: string;
}

interface PropsModalEditarUsuario {
  selectedUser: UserData | undefined;
  setSelectedUser: React.Dispatch<React.SetStateAction<UserData | undefined>>;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ModalEditarUsuario = ({
  selectedUser,
  setSelectedUser,
  isModalOpen,
  setIsModalOpen,
  showPassword,
  setShowPassword,
}: PropsModalEditarUsuario) => {
  const { updateUser } = useUsers();

  // Callback para guardar cambios de usuario
  const handleSaveChangesToEdit = useCallback(async () => {
    const dataToUpdate: {
      id: string;
      nameUser: string;
      email: string;
      password?: string;
      role: string;
      accountStatus: string;
    } = {
      id: selectedUser?.id || "",
      nameUser: selectedUser?.nameUser || "",
      email: selectedUser?.email || "",
      role: selectedUser?.role || "",
      accountStatus: selectedUser?.accountStatus || "",
    };

    // Solo agregar la contraseña si fue modificada y no está vacía
    if (selectedUser?.password && selectedUser.password.trim() !== "") {
      dataToUpdate.password = selectedUser.password;
    }
    updateUser(dataToUpdate);
    setIsModalOpen(false);
  }, [selectedUser, updateUser, setIsModalOpen]);

  // Cierra el modal
  const handleCloseModal = useCallback(() => {
    setSelectedUser(undefined);
    setIsModalOpen(false);
  }, [setIsModalOpen, setSelectedUser]);

  return (
    <>
      {/* Modal editar un usuario */}
      {isModalOpen && selectedUser && (
        <Modal
          onClose={handleCloseModal}
          title={"Actualizar usuario"}
          onSave={handleSaveChangesToEdit}
          saveButtonText={"Editar usuario"}
        >
          <div className="grid grid-cols-1 grid-rows-4 lg:grid-cols-2 lg:grid-rows-2 gap-4 mt-6">
            <div>
              <label className="label">Nombre</label>
              <input
                type="text"
                className="input input-bordered w-full text-base-content"
                value={selectedUser.nameUser}
                onChange={(e) =>
                  setSelectedUser({
                    ...selectedUser,
                    nameUser: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className="label">Correo</label>
              <input
                type="email"
                className="input input-bordered w-full text-base-content"
                value={selectedUser.email}
                onChange={(e) =>
                  setSelectedUser({
                    ...selectedUser,
                    email: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className="label">Rol</label>
              <select
                className="select w-full"
                value={selectedUser.role}
                onChange={(e) => ({
                  ...selectedUser,
                  role: e.target.value,
                })}
              >
                <option disabled={true}>Elije un rol</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
            <div className="join w-full h-10 flex flex-col">
              <label className="label">Contraseña</label>
              <div className="flex flex-row">
                <input
                  type={`${showPassword ? "text" : "password"}`}
                  className="input input-bordered w-full text-base-content rounded-l-lg"
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      password: e.target.value,
                    })
                  }
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="btn btn-secondary text-lg join-item"
                >
                  {showPassword ? (
                    <Icon name="iconoOjoCerrado" />
                  ) : (
                    <Icon name="iconoOjoAbierto" />
                  )}
                </span>
              </div>
            </div>
            <div>
              <label className="label">Estatus</label>
              <select
                className="select w-full"
                value={selectedUser.accountStatus}
                onChange={(e) =>
                  setSelectedUser({
                    ...selectedUser,
                    accountStatus: e.target.value,
                  })
                }
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
