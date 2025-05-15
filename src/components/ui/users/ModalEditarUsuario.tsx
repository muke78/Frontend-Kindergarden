import { useUsers } from "@/hooks/Users/useUsers";
import { updateUserSchema } from "@/schemas/Users/updateUserSchema";

import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";

import { Icon } from "@components/ui/Icon";
import { Modal } from "@components/ui/Modal/Modal";
import { zodResolver } from "@hookform/resolvers/zod";

interface UserData {
  id: string;
  nameUser: string;
  email: string;
  role: string;
  accountStatus: string;
  password?: string;
}

// Interface for form data
interface UpdateUserFormData {
  nameUser: string;
  email: string;
  password: string;
  role: string;
  accountStatus: string;
}

// Interface for the data to be sent to the API
interface UpdateUserPayload {
  id: string;
  nameUser: string;
  email: string;
  password?: string;
  role: string;
  accountStatus: string;
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

  // Configurar react-hook-form con el esquema de validación
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setFocus,
    setValue,
  } = useForm({
    resolver: zodResolver(updateUserSchema()),
    defaultValues: {
      nameUser: "",
      email: "",
      password: "",
      role: "user",
      accountStatus: "Activo",
    },
  });

  // Cuando se abre el modal y hay un usuario seleccionado, actualizar los valores del formulario
  useEffect(() => {
    if (isModalOpen && selectedUser) {
      // Configurar los valores del formulario basados en el usuario seleccionado
      setValue("nameUser", selectedUser.nameUser);
      setValue("email", selectedUser.email);
      setValue("role", selectedUser.role);
      setValue("accountStatus", selectedUser.accountStatus);

      // Establecer el foco en el primer campo (nameUser)
      setTimeout(() => {
        setFocus("nameUser");
      }, 100);
    }
  }, [isModalOpen, selectedUser, setValue, setFocus]);

  // Función para manejar el envío del formulario

  const onSubmit = useCallback(
    async (data: UpdateUserFormData): Promise<void> => {
      try {
        const dataToUpdate: UpdateUserPayload = {
          id: selectedUser?.id || "",
          nameUser: data.nameUser,
          email: data.email,
          role: data.role,
          accountStatus: data.accountStatus,
        };

        // Solo agregar la contraseña si fue modificada y no está vacía
        if (data.password && data.password.trim() !== "") {
          dataToUpdate.password = data.password;
        }

        await updateUser(dataToUpdate);
        setIsModalOpen(false);
        reset(); // Limpiar el formulario después de guardar
      } catch (error) {
        console.error("Error al actualizar un usuario", error);
      }
    },
    [selectedUser, updateUser, setIsModalOpen, reset],
  );

  // Cierra el modal
  const handleCloseModal = useCallback(() => {
    setSelectedUser(undefined);
    setIsModalOpen(false);
    reset(); // Limpiar el formulario al cerrar
  }, [setIsModalOpen, setSelectedUser, reset]);

  return (
    <>
      {/* Modal editar un usuario */}
      {isModalOpen && selectedUser && (
        <Modal
          onClose={handleCloseModal}
          title={"Actualizar usuario"}
          onSave={handleSubmit(onSubmit)}
          saveButtonText={"Editar usuario"}
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 grid-rows-4 lg:grid-cols-2 lg:grid-rows-2 gap-4 mt-6"
          >
            {/* Input para actualizar el nombre de usuario */}
            <div>
              <label className="label">Nombre</label>
              <input
                type="text"
                className={`input input-bordered w-full text-base-content ${errors.nameUser ? "input-error" : ""}`}
                {...register("nameUser")}
              />
              {errors.nameUser && (
                <span className="text-error text-sm">
                  {errors.nameUser.message?.toString()}
                </span>
              )}
            </div>

            {/* Input para actualizar el correo de usuario */}
            <div>
              <label className="label">Correo</label>
              <input
                type="email"
                className={`input input-bordered w-full text-base-content ${errors.email ? "input-error" : ""}`}
                {...register("email")}
              />
              {errors.email && (
                <span className="text-error text-sm">
                  {errors.email.message?.toString()}
                </span>
              )}
            </div>

            {/* Input para actualizar la contraseña de usuario */}
            <div className="join w-full h-10 flex flex-col">
              <label className="label">Contraseña</label>
              <div className="flex flex-row">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input input-bordered w-full text-base-content rounded-l-lg ${errors.password ? "input-error" : ""}`}
                  {...register("password")}
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
              {errors.password && (
                <span className="text-error text-sm">
                  {errors.password.message?.toString()}
                </span>
              )}
            </div>

            {/* Select para actualizar el estatus de usuario */}
            <div>
              <label className="label">Estatus</label>
              <select
                className={`select w-full ${errors.accountStatus ? "select-error" : ""}`}
                {...register("accountStatus")}
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
              {errors.accountStatus && (
                <span className="text-error text-sm">
                  {errors.accountStatus.message?.toString()}
                </span>
              )}
            </div>

            {/* Select para actualizar el rol del usuario */}
            <div>
              <label className="label">Rol</label>
              <select
                className={`select w-full ${errors.role ? "select-error" : ""}`}
                {...register("role")}
              >
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
              {errors.role && (
                <span className="text-error text-sm">
                  {errors.role.message?.toString()}
                </span>
              )}
            </div>
          </form>
        </Modal>
      )}
    </>
  );
};
