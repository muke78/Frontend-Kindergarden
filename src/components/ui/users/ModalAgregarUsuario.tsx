import { useUsers } from "@/hooks/Users/useUsers";
import { createUserSchema } from "@/schemas/Users/createUserSchema";

import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";

import { Icon } from "@components/ui/Icon";
import { Modal } from "@components/ui/Modal/Modal";
import { zodResolver } from "@hookform/resolvers/zod";

interface FormData {
  nameUser: string;
  email: string;
  profilePicture: string;
  password: string;
  role: string;
  accountStatus: string;
}

interface PropsModalAgregarUsuario {
  isOpenModalAddUser: boolean;
  setIsOpenModalAddUser: React.Dispatch<React.SetStateAction<boolean>>;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ModalAgregarUsuario = ({
  isOpenModalAddUser,
  setIsOpenModalAddUser,
  showPassword,
  setShowPassword,
}: PropsModalAgregarUsuario) => {
  const { createUser } = useUsers();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setFocus,
  } = useForm<FormData>({
    resolver: zodResolver(createUserSchema()),
    defaultValues: {
      nameUser: "",
      email: "",
      profilePicture: "",
      password: "",
      role: "",
      accountStatus: "",
    },
  });

  // Establecer el foco en el primer input cuando se abre el modal
  useEffect(() => {
    if (isOpenModalAddUser) {
      // Pequeño timeout para asegurarnos que el DOM está listo
      setTimeout(() => {
        setFocus("nameUser");
      }, 100);
    }
  }, [isOpenModalAddUser, setFocus]);

  // Callback para submit de crear usuario
  const onSubmit = useCallback(
    async (data: FormData) => {
      try {
        await createUser({
          nameUser: data.nameUser,
          email: data.email,
          profilePicture: data.profilePicture,
          password: data.password,
          role: data.role,
          accountStatus: data.accountStatus,
        });
        reset();
        setIsOpenModalAddUser(false);
      } catch (error) {
        console.error("Error al crear usuario:", error);
      }
    },
    [createUser, reset, setIsOpenModalAddUser],
  );

  const handleCloseModal = useCallback(() => {
    setIsOpenModalAddUser(false);
    reset();
  }, [setIsOpenModalAddUser, reset]);

  return (
    <div>
      {/* Modal de Agregar un nuevo usuario*/}
      {isOpenModalAddUser && (
        <Modal
          onClose={handleCloseModal}
          title={"Crear usuario"}
          onSave={handleSubmit(onSubmit)}
          saveButtonText={"Guardar usuario"}
        >
          <form onSubmit={handleSubmit(onSubmit)} method="POST">
            <div className="grid grid-cols-1 grid-rows-4 lg:grid-cols-2 lg:grid-rows-2 gap-4 mt-6">
              {/* Input para insertar el nombre del usuario */}
              <div>
                <label className="label">Nombre</label>
                <input
                  type="text"
                  placeholder="Nombre"
                  className={`input input-bordered w-full text-base-content rounded-l-lg ${errors.nameUser ? "input-error" : ""}`}
                  {...register("nameUser")}
                />
                {errors.nameUser && (
                  <span className="text-error text-sm">
                    {errors.nameUser.message?.toString()}
                  </span>
                )}
              </div>

              {/* Input para insertar el correo del usuario */}
              <div>
                <label className="label">Correo</label>
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  className={`input input-bordered w-full text-base-content rounded-l-lg ${errors.email ? "input-error" : ""}`}
                  {...register("email")}
                />
                {errors.email && (
                  <span className="text-error text-sm">
                    {errors.email.message?.toString()}
                  </span>
                )}
              </div>

              {/* Input para insertar la contraseña del usuario */}
              <div className="join w-full h-10 flex flex-col">
                <label className="label">Contraseña</label>
                <div className="flex flex-row">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Contraseña"
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

              {/* Select para insertar el estatus del usuario */}
              <div>
                <label className="label">Estatus</label>
                <select
                  className={`select w-full ${errors.accountStatus ? "select-error" : ""}`}
                  {...register("accountStatus")}
                >
                  <option disabled={true}>Elije un rol</option>
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
                {errors.accountStatus && (
                  <span className="text-error text-sm">
                    {errors.accountStatus.message?.toString()}
                  </span>
                )}
              </div>

              {/* Select para insertar el rol del usuario */}
              <div>
                <label className="label">Rol</label>
                <select
                  className={`select w-full ${errors.role ? "select-error" : ""}`}
                  {...register("role")}
                >
                  <option disabled={true}>Elije un rol</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
                {errors.role && (
                  <span className="text-error text-sm">
                    {errors.role.message?.toString()}
                  </span>
                )}
              </div>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
