import { useSidebar } from "@/hooks/Sidebar/useSidebar";

import { NavLink } from "react-router";

import { LinksArray } from "@utils/dataEstatica";

export const SidebarItems = () => {
  const { isMobile, sidebarOpen } = useSidebar();
  return (
    <nav
      className={`flex overflow-y-auto py-4 ${isMobile ? "justify-center" : sidebarOpen ? "justify-start" : "justify-center"}`}
    >
      <ul className="space-y-1 w-full px-2">
        {LinksArray.map((item) => (
          <li key={item.label}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `flex ${
                  sidebarOpen ? "justify-start" : "justify-center"
                } px-2 py-3 rounded-3xl transition-colors duration-200 ${
                  isActive
                    ? "bg-secondary/45"
                    : "hover:bg-secondary hover:text-white"
                }`
              }
              aria-current={item.active ? "page" : undefined}
              aria-label={item.label}
            >
              <span
                className={`flex justify-center items-center text-2xl ${sidebarOpen ? "pl-2" : "pl-0"}`}
              >
                {item.icon}
              </span>
              <span
                className={`ml-3 text-lg ${!sidebarOpen && !isMobile ? "hidden" : "block"}`}
              >
                {item.label}
              </span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};
