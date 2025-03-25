import { useUsers } from "@/hooks/useUsers";

import { v } from "../../../styles/variables";

export const MobileCard = () => {
  const { data } = useUsers();
  const countData = data?.metadata?.dataCount ?? 0;
  return (
    <>
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
                    <v.iconoMasOpciones />
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
                  {/* <p>{formatDate(user.LastLogin)}</p> */}
                </div>
                <div>
                  <p className="font-semibold opacity-70">Status</p>
                  <div className="mt-1">
                    {/* {getStatusBadge(user.AccountStatus)} */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
