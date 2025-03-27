import { useSidebar } from "@/hooks/useSidebar";
import { useUsers } from "@/hooks/useUsers";

import { useState } from "react";
import { type FieldError, useForm } from "react-hook-form";
import { Toaster } from "react-hot-toast";

import { v } from "@styles/variables";
import Swal from "sweetalert2";

interface PropsModalIsOpen {
  isOpenModal: boolean;
  setIsOpenModal: (isOpen: boolean) => void;
}

interface FormData {
  nameUser: string;
  email: string;
  password: string;
  role: string;
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
  isOpenModal,
  setIsOpenModal,
}: PropsModalIsOpen) => {
  const { data, deleteUser, createUser, updateUser } = useUsers();
  const { isMobile } = useSidebar();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<FormDataEdit>();

  const countData = data?.metadata?.dataCount ?? 0;

  const inputErrorText = "Este campo es obligatorio";
  const invalidPatterEmail = "Formato de correo inválido";

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    await createUser({
      nameUser: data.nameUser,
      email: data.email,
      password: data.password,
      role: data.role,
    });
    reset();
    setIsOpenModal(!isOpenModal);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-MX", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "activo":
        return <span className="badge badge-success">{status}</span>;
      case "inactivo":
        return <span className="badge badge-neutral">{status}</span>;
      case "suspended":
        return <span className="badge badge-error">{status}</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  const eliminar = (p: string) => {
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
  };

  // Abre el modal con la info del usuario seleccionado
  const handleOpenModal = (user: FormDataEdit) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // Cierra el modal
  const handleCloseModal = () => {
    setSelectedUser(undefined);
    setIsModalOpen(false);
  };

  const handleSaveChanges = async () => {
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
  };

  return (
    <>
      <div className="hidden md:block overflow-x-auto rounded-md border border-neutral bg-base-100 shadow-sm row-span-4">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="text-left text-md">
              <th>ID</th>
              <th>Nombre de usuario</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Último inicio</th>
              <th>Creado</th>
              <th>Actualizado</th>
              <th>Status</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data?.data.map((user, index) => (
              <tr key={index + 1} className="hover:bg-base-300 font-medium">
                <td>{index + 1}</td>
                <td>{user.NameUser}</td>
                <td>{user.Email}</td>
                <td>{user.Role}</td>
                <td>{formatDate(user.LastLogin)}</td>
                <td>{formatDate(user.Created)}</td>
                <td>{formatDate(user.Updated)}</td>
                <td>{getStatusBadge(user.AccountStatus)}</td>
                <td>
                  <div className="flex justify-center items-center gap-2">
                    <button
                      className="text-info text-2xl cursor-pointer"
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
                      <v.iconoEditarButton />
                    </button>
                    <button
                      className="text-error text-2xl cursor-pointer"
                      onClick={() => eliminar(user.ID)}
                    >
                      <v.iconoBasuraButton />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Toaster position="bottom-right" reverseOrder={false} />

        {isOpenModal && (
          <div className="modal modal-open">
            <div className="modal-box">
              <div className="border-b border-white/40 p-2">
                <span className="text-3xl font-bold">Crear usuario</span>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} method="POST">
                <div className="grid grid-cols-2 grid-rows-2 gap-4 mt-6">
                  <div>
                    <label className="label">Nombre</label>
                    <input
                      type="text"
                      placeholder="Nombre"
                      className="input input-bordered w-full text-base-content"
                      {...register("nameUser", {
                        required: inputErrorText,
                      })}
                    />

                    {errors.nameUser && (
                      <p className="text-primary p-0">
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
                      {...register("email", {
                        required: inputErrorText,
                        pattern: {
                          value:
                            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                          message: invalidPatterEmail,
                        },
                      })}
                    />
                    {errors.email && (
                      <p className="text-primary p-0">
                        {(errors.email as FieldError)?.message}
                      </p>
                    )}
                  </div>
                  <div className="join w-full h-10 flex flex-col">
                    <label className="">Contraseña</label>
                    <div className="flex flex-row">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Contraseña"
                        className="input input-bordered w-full text-base-content rounded-l-lg"
                        {...register("password", {
                          required: inputErrorText,
                        })}
                      />
                      {errors.password && (
                        <p className="text-primary p-0">
                          {(errors.password as FieldError)?.message}
                        </p>
                      )}

                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="btn btn-secondary text-lg join-item"
                      >
                        {showPassword ? (
                          <v.iconoOjoCerrado />
                        ) : (
                          <v.iconoOjoAbierto />
                        )}
                      </span>
                    </div>
                  </div>
                  {errors.password && (
                    <p className="text-primary p-0">
                      {(errors.password as FieldError)?.message}
                    </p>
                  )}

                  <div>
                    <label className="label">Rol</label>
                    <select
                      className="select"
                      {...register("role", {
                        required: inputErrorText,
                      })}
                    >
                      <option disabled={true}>Elije un rol</option>
                      <option value="admin">Admin</option>
                      <option value="user">User</option>
                    </select>
                  </div>
                  {errors.role && (
                    <p className="text-primary p-0">
                      {(errors.role as FieldError)?.message}
                    </p>
                  )}
                </div>

                <div className="modal-action">
                  <button className="btn" onClick={() => setIsOpenModal(false)}>
                    Cerrar
                  </button>
                  <button className="btn btn-info">Crear usuario</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de Edición */}
        {isModalOpen && selectedUser && (
          <div className="modal modal-open">
            <div className="modal-box">
              <div className="border-b border-white/40 p-2">
                <span className="text-3xl font-bold">Actualizar usuario</span>
              </div>

              <div className="grid grid-cols-2 grid-rows-2 gap-4 mt-6">
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
                    className="select"
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
                <div>
                  <label className="label">Contraseña</label>
                  <input
                    type="password"
                    className="input input-bordered w-full text-base-content"
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        password: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="label">Estatus</label>
                  <select
                    className="select"
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

              {/* Botones */}
              <div className="flex justify-end space-x-2 mt-4">
                <button className="btn" onClick={handleCloseModal}>
                  Cancelar
                </button>
                <button className="btn btn-info" onClick={handleSaveChanges}>
                  Guardar cambios
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div
        className={`flex justify-end w-full ${isMobile ? "hidden" : "block"}`}
      >
        <span className="badge badge-soft badge-secondary">
          Total de registros {countData}
        </span>
      </div>
    </>
  );
};
