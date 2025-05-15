import { formatDate } from "@/utils/formatDate";
import { getStatusBadge } from "@/utils/statusBadge";

import { Icon } from "../Icon";

interface User {
  message: string;
  ID: string;
  NameUser: string;
  Email: string;
  Password?: string;
  ProfilePicture: string;
  Role: string;
  AccountType: string;
  LastLogin: string;
  AccountStatus: string;
  Created: string;
  Updated: string;
}

interface HandleCheckUserParams {
  id: string;
  checked: boolean;
}

interface FormDataEdit {
  id: string;
  nameUser: string;
  email: string;
  password?: string;
  role: string;
  accountStatus: string;
}

interface PropsMobileUsers {
  dataToShow: User[];
  eliminar: (id: string) => void;
  handleOpenModal: (user: FormDataEdit) => void;
  selectedIds: string[];
  onCheckTask: ({ id, checked }: HandleCheckUserParams) => void;
  isChecked: boolean;
  onCheckAll: (checked: boolean) => void;
}

export const MobileUsers = (props: PropsMobileUsers) => {
  const {
    dataToShow,
    eliminar,
    handleOpenModal,
    isChecked,
    onCheckAll,
    onCheckTask,
    selectedIds,
  } = props;
  return (
    <div className="w-full animate__animated animate__fadeIn">
      {/* Cabecera con selección múltiple y contador */}
      <div className="flex items-center justify-between p-4 rounded-t-lg mb-2">
        <div className="flex items-center space-x-3">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => onCheckAll(e.target.checked)}
              className="checkbox checkbox-error"
              aria-label="Seleccionar todos los usuarios"
            />
            <span className="ml-2 text-sm">Seleccionar todos</span>
          </label>
        </div>
      </div>

      {/* Lista de tarjetas de usuario */}
      <div className="space-y-3">
        {dataToShow.map((user) => (
          <div
            key={user.ID}
            className={`bg-base-300 rounded-lg shadow-sm border transition-all ${
              selectedIds.includes(user.ID)
                ? "border-error bg-base-300/15"
                : "border-none"
            }`}
          >
            {/* // Solución para la tarjeta de usuario con checkbox alineado
            correctamente */}
            <div className="p-4">
              {/* Encabezado con checkbox, avatar e info principal - Estructura modificada */}
              <div className="flex items-start">
                {/* Checkbox siempre a la izquierda y alineado con el inicio del contenido */}
                <div className="mr-3 pt-1.5">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(user.ID)}
                    onChange={(e) =>
                      onCheckTask({ id: user.ID, checked: e.target.checked })
                    }
                    className="checkbox checkbox-error"
                    aria-label={`Seleccionar a ${user.NameUser}`}
                  />
                </div>

                {/* Contenedor flexible para los demás elementos */}
                <div className="flex-1">
                  {/* Información de usuario (ahora sin el checkbox dentro) */}
                  <div className="flex flex-col items-center gap-4 min-[640px]:flex-row">
                    {/* Avatar mejorado */}
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        selectedIds.includes(user.ID)
                          ? "bg-error text-neutral"
                          : "bg-neutral text-white"
                      }`}
                    >
                      {user.ProfilePicture ? (
                        <img
                          src={user.ProfilePicture}
                          alt=""
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <span className="font-bold text-lg">
                          {user.NameUser?.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>

                    {/* Información principal */}
                    <div className="flex-1">
                      <h3 className="text-lg text-center sm:text-left font-semibold">
                        {user.NameUser}
                      </h3>
                      <p className="text-sm text-base-content/50">
                        {user.Email}
                      </p>
                    </div>

                    {/* Acciones rápidas */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          handleOpenModal({
                            id: user.ID,
                            nameUser: user.NameUser,
                            email: user.Email,
                            role: user.Role,
                            accountStatus: user.AccountStatus,
                          })
                        }
                        className="p-1.5 text-info cursor-pointer"
                        aria-label="Editar usuario"
                      >
                        <Icon name="iconoEditarButton" />
                      </button>
                      <button
                        onClick={() => eliminar(user.ID)}
                        className="p-1.5 text-error cursor-pointer"
                        aria-label="Eliminar usuario"
                      >
                        <Icon name="iconoBasuraButton" />
                      </button>
                    </div>
                  </div>

                  {/* Línea divisora */}
                  <div className="divider"></div>

                  {/* Detalles de usuario en grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    {/* Rol */}
                    <div className="flex items-start space-x-2">
                      <Icon name="iconoUsuario" />
                      <div>
                        <span className="block text-gray-500 text-xs">Rol</span>
                        <span className="font-medium">{user.Role}</span>
                      </div>
                    </div>

                    {/* Estado de la cuenta */}
                    <div className="flex items-start space-x-2">
                      <div>
                        <span className="block text-gray-500 text-xs">
                          Estado
                        </span>
                        {getStatusBadge(user.AccountStatus)}
                      </div>
                    </div>

                    {/* Tipo de cuenta */}
                    <div className="flex items-start space-x-2">
                      {user.AccountType === "google" ? (
                        <Icon name="iconoChrome" />
                      ) : (
                        <Icon name="iconoCorreo" />
                      )}
                      <div>
                        <span className="block text-gray-500 text-xs p-1">
                          Tipo de cuenta
                        </span>
                        {user.AccountType === "google" ? (
                          <span
                            className="px-2 py-0.5 text-xs font-medium rounded text-white"
                            style={{
                              background:
                                "linear-gradient(90deg, rgba(66, 134, 244, 0.7), rgba(234, 68, 53, 0.726), rgba(251, 189, 5, 0.7), rgba(52, 168, 83, 0.7))",
                            }}
                          >
                            Google
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-800 rounded">
                            Email
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Último login */}
                    <div className="flex items-start space-x-2">
                      <Icon name="iconoCalendario" />
                      <div>
                        <span className="block text-gray-500 text-xs">
                          Último inicio de sesión
                        </span>
                        <span className="font-medium">
                          {formatDate(user.LastLogin)}
                        </span>
                      </div>
                    </div>

                    {/* Registrado */}
                    <div className="flex items-start space-x-2">
                      <Icon name="iconoCreadoRegistro" />
                      <div>
                        <span className="block text-gray-500 text-xs">
                          Registrado
                        </span>
                        <span className="font-medium">
                          {formatDate(user.Created)}
                        </span>
                      </div>
                    </div>

                    {/* Fecha de registro/actualización */}
                    <div className="flex items-start space-x-2">
                      <Icon name="iconoActualizadoRegistro" />
                      <div>
                        <span className="block text-gray-500 text-xs">
                          Actualizado
                        </span>
                        <span className="font-medium">
                          {formatDate(user.Updated)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
