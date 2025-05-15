import { formatDate } from "@/utils/formatDate";
import { getStatusBadge } from "@/utils/statusBadge";

import { Icon } from "@components/ui/Icon";

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

interface PropsTableRow {
  dataToShow: User[];
  eliminar: (id: string) => void;
  handleOpenModal: (user: FormDataEdit) => void;
  selectedIds: string[];
  onCheckTask: ({ id, checked }: HandleCheckUserParams) => void;
}

export const TableRow = (props: PropsTableRow) => {
  const { dataToShow, eliminar, handleOpenModal, onCheckTask, selectedIds } =
    props;
  return (
    <tbody className="animate__animated animate__fadeIn">
      {dataToShow.map((user) => (
        <tr key={user.ID} className="hover:bg-base-300 font-medium">
          <td>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedIds.includes(user.ID)}
                onChange={(e) =>
                  onCheckTask({ id: user.ID, checked: e.target.checked })
                }
                className="checkbox checkbox-error"
                aria-label="Seleccionar todos los usuarios"
              />
            </label>
          </td>
          <td>
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                selectedIds.includes(user.ID)
                  ? "bg-error text-neutral"
                  : "bg-neutral text-white"
              }`}
            >
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
          <td>
            <div className="flex flex-col">
              <span> {user.NameUser}</span>
              <span className="text-sm text-base-content/70">{user.Email}</span>
            </div>
          </td>
          <td>{user.Role}</td>
          <td>{formatDate(user.LastLogin)}</td>
          <td>
            <div className="flex flex-col space-y-1">
              <div className="flex items-center text-sm">
                <Icon
                  name="iconoCreadoRegistro"
                  size="text-sm"
                  className="mr-2"
                />
                <span className="mr-1">Registrado:</span>
                <span className="font-semibold">
                  {formatDate(user.Created)}
                </span>
              </div>
              <div className="flex items-center text-sm text-base-content/70">
                <Icon
                  name="iconoActualizadoRegistro"
                  size="text-sm"
                  className="mr-2"
                />
                <span className="mr-1">Actualizado:</span>
                <span className="font-semibold">
                  {formatDate(user.Updated)}
                </span>
              </div>
            </div>
          </td>
          <td>
            {user.AccountType === "google" ? (
              <span
                className="px-2 py-0.5 text-xs font-medium rounded text-white w-full"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(66, 134, 244, 0.7), rgba(234, 68, 53, 0.726), rgba(251, 189, 5, 0.7), rgba(52, 168, 83, 0.7))",
                }}
              >
                Google
              </span>
            ) : (
              <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-800 rounded w-full">
                Email
              </span>
            )}
          </td>
          <td>{getStatusBadge(user.AccountStatus)}</td>
          <td>
            <div className="flex justify-center items-center gap-2">
              <button
                className="btn btn-info text-base"
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
                className="btn btn-error text-base"
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
  );
};
