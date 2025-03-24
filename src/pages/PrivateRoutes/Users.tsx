import { useSidebar } from "@/hooks/useSidebar";
import { useUsers } from "@/hooks/useUsers";

import { useState } from "react";
import { Toaster } from "react-hot-toast";

import { ControlUserOptions } from "@components/ui/ControlUserOptions";
import Swal from "sweetalert2";

export const Users = () => {
  const { isMobile, sidebarOpen } = useSidebar();
  const { data, isLoading, error, deleteUser, createUser } = useUsers();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    nameUser: "",
    email: "",
    password: "",
    role: "",
  });

  const countData = data?.metadata?.dataCount ?? 0;

  // Format date for better display
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
  // Función para manejar cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async () => {
    try {
      await createUser(formData); // Llamar a la función de creación de usuario
      setIsOpenModal(false); // Cerrar el modal después de crear el usuario
      setFormData({ nameUser: "", email: "", password: "", role: "" }); // Limpiar el formulario
    } catch (error) {
      console.error("Error al crear usuario:", error);
    }
  };

  // Get status badge color based on account status
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

  if (isLoading) return <p>Cargando usuarios...</p>;
  if (error) return <p>Error al cargar usuarios</p>;

  return (
    <main
      className={`min-h-screen transition-all duration-300 ${
        isMobile ? "ml-0" : sidebarOpen ? "ml-64" : "ml-20"
      } animate__animated animate__fadeIn`}
    >
      <div className="grid grid-cols-1 grid-rows-6 gap-3 w-full h-screen p-4 md:p-6 max-w-7xl mx-auto">
        <div className="flex justify-start items-end">
          <span className="text-6xl font-bold">Usuarios</span>
          <ControlUserOptions />
        </div>

        <div className="flex justify-start items-end gap-2">
          <input
            type="text"
            placeholder="Buscar"
            className="input input-bordered text-base-content"
          />
          <button className="btn btn-primary">Buscar</button>
          <button
            className="btn btn-warning"
            onClick={() => setIsOpenModal(true)}
          >
            Crear
          </button>
        </div>

        {/* Desktop Table View (hidden on mobile) */}
        <div className="hidden md:block overflow-x-auto rounded-md border border-neutral bg-base-100 shadow-sm row-span-4">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="text-left text-lg">
                <th>ID</th>
                <th>Nombre de usuario</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Último inicio</th>
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
                  <td>{getStatusBadge(user.AccountStatus)}</td>
                  <td>
                    <div className="flex justify-center items-center gap-2">
                      <button className="btn btn-info btn-sm">Editar</button>
                      <button
                        className="btn btn-error btn-sm"
                        onClick={() => eliminar(user.ID)}
                      >
                        Eliminar
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

                <div className="grid grid-cols-2 grid-rows-2 gap-4 mt-6">
                  <div>
                    <label htmlFor="">Nombre</label>
                    <input
                      type="text"
                      name="nameUser"
                      value={formData.nameUser}
                      onChange={handleChange}
                      required={true}
                      placeholder="Nombre"
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="">Correo</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required={true}
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="">Contraseña</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required={true}
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="">Role</label>
                    <input
                      type="text"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required={true}
                      className="input w-full"
                    />
                  </div>
                </div>
                {/* Botón para cerrar el modal */}
                <div className="modal-action">
                  <button className="btn btn-info" onClick={handleSubmit}>
                    Crear
                  </button>
                  <button className="btn" onClick={() => setIsOpenModal(false)}>
                    Cerrar
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

        {/* Mobile Card View (shown only on mobile) */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          <div className="badge badge-soft badge-secondary mt-2">
            Total de registros {countData}
          </div>
          {data?.data.map((user, index) => (
            <div key={index + 1} className="card bg-base-300 shadow-sm">
              <div className="card-body p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="card-title text-base">{user.NameUser}</h3>
                    <p className="text-sm opacity-70">{user.Email}</p>
                  </div>
                  <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-ghost btn-xs">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="w-4 h-4 stroke-current"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                        ></path>
                      </svg>
                    </label>
                    <ul
                      tabIndex={0}
                      className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 flex gap-1"
                    >
                      <li>
                        <span className="btn btn-info btn-sm">Editar</span>
                      </li>
                      <li>
                        <span className="btn btn-error btn-sm">Eliminar</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="font-semibold opacity-70">ID</p>
                    <p>{index + 1}</p>
                  </div>
                  <div>
                    <p className="font-semibold opacity-70">Rol</p>
                    <p>{user.Role}</p>
                  </div>
                  <div>
                    <p className="font-semibold opacity-70">Último inicio</p>
                    <p>{formatDate(user.LastLogin)}</p>
                  </div>
                  <div>
                    <p className="font-semibold opacity-70">Status</p>
                    <div className="mt-1">
                      {getStatusBadge(user.AccountStatus)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};
