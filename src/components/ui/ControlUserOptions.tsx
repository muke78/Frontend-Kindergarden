import { useAuthStore } from "@/store/Auth/authStore";
import { controlOptionsuserArray } from "@/utils/dataEstatica";

import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router";

import { Icon } from "@components/ui/Icon";

export const ControlUserOptions = () => {
  const { user, logout } = useAuthStore();
  const [openDropDownUser, setOpenDropDownUser] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropDownUser(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <div ref={dropdownRef} className="absolute right-7 top-7 z-10">
      <div
        className={`flex items-center gap-4 p-2 bg-base-300
                  ${openDropDownUser ? "rounded-t-4xl" : "rounded-4xl"} shadow-lg`}
      >
        {/* Avatar */}
        <div className="w-12 h-12 flex items-center justify-center bg-neutral text-neutral-content rounded-full">
          <span className="font-bold text-lg">
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.nameUser}
                className="rounded-full w-full object-cover"
              />
            ) : (
              user?.nameUser?.charAt(0)
            )}
          </span>
        </div>
        {/* Botón para abrir el dropdown */}
        <button
          className="p-2 cursor-pointer flex gap-2"
          onClick={() => setOpenDropDownUser(!openDropDownUser)}
          aria-label="Abrir menú de usuario"
        >
          {/* Nombre */}
          <span aria-label="Saludo del usuario">
            Hola, {user?.nameUser || "Invitado"}!
          </span>

          {openDropDownUser ? (
            <Icon name="iconoFlechaDerecha" size="text-2xl" />
          ) : (
            <Icon name="iconoFlechaAbajo" size="text-2xl" />
          )}
        </button>
      </div>

      {/* Dropdown */}
      {openDropDownUser && (
        <div>
          <ul className="min-w-[200px] max-w-xs  bg-base-300 rounded-b-3xl border-t border-neutral-500/50 shadow-lg">
            {controlOptionsuserArray.map((item) => (
              <li key={item.label} className="p-2">
                {item.to ? (
                  <NavLink
                    to={item.to}
                    aria-label={item.label}
                    className="flex items-center gap-2 p-1 rounded-lg transition-all"
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span>{item.label}</span>
                  </NavLink>
                ) : (
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 btn btn-soft btn-error hover:text-white p-1 rounded-3xl w-full transition-all"
                    aria-label="Cerrar sesión"
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
