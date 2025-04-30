import { useUsers } from "@/hooks/Users/useUsers";
import { createUserSchema } from "@/schemas/Users/createUserSchema";

import { useCallback } from "react";
import { type FieldError, useForm } from "react-hook-form";

import { Icon } from "@components/ui/Icon";
import { Modal } from "@components/ui/Modal/Modal";
import { zodResolver } from "@hookform/resolvers/zod";

interface FormData {
  nameUser: string;
  email: string;
  profilePicture: string;
  password: string;
  role: string;
  accountType: string;
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
  } = useForm<FormData>({
    resolver: zodResolver(createUserSchema()),
  });

  // Callback para submit de crear usuario
  const onSubmit = useCallback(
    async (data: FormData) => {
      await createUser({
        nameUser: data.nameUser,
        email: data.email,
        profilePicture: data.profilePicture,
        password: data.password,
        role: data.role,
        accountType: data.accountType,
      });
      reset();
      setIsOpenModalAddUser(!isOpenModalAddUser);
    },
    [createUser, reset, setIsOpenModalAddUser, isOpenModalAddUser],
  );
  return (
    <div>
      {/* Modal de Agregar un nuevo usuario*/}
      {isOpenModalAddUser && (
        <Modal
          onClose={() => setIsOpenModalAddUser(!isOpenModalAddUser)}
          title={"Crear usuario"}
          onSave={handleSubmit(onSubmit)}
          saveButtonText={"Guardar usuario"}
        >
          <form onSubmit={handleSubmit(onSubmit)} method="POST">
            <div className="grid grid-cols-1 grid-rows-4 lg:grid-cols-2 lg:grid-rows-2 gap-4 mt-6">
              <div>
                <label className="label">Nombre</label>
                <input
                  type="text"
                  placeholder="Nombre"
                  className="input input-bordered w-full text-base-content"
                  {...register("nameUser")}
                />

                {errors.nameUser && (
                  <p className="text-red-500 p-0">
                    {(errors.nameUser as FieldError)?.message}
                  </p>
                )}
              </div>

              <div>
                <label className="label">Correo</label>
                <input
                  type="email"
                  placeholder="email"
                  className="input input-bordered w-full text-base-content"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-500 p-0">
                    {(errors.email as FieldError)?.message}
                  </p>
                )}
              </div>
              <div className="join w-full h-10 flex flex-col">
                <label className="label">Contraseña</label>
                <div className="flex flex-row">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Contraseña"
                    className="input w-full text-base-content rounded-l-lg"
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
                  <p className="text-red-500 p-0">
                    {(errors.password as FieldError)?.message}
                  </p>
                )}
              </div>

              <div>
                <label className="label">Rol</label>
                <select className="select w-full" {...register("role")}>
                  <option disabled={true}>Elije un rol</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>
              {errors.role && (
                <p className="text-red-500 p-0">
                  {(errors.role as FieldError)?.message}
                </p>
              )}
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
