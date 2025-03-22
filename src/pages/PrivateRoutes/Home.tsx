import { useSidebar } from "@/hooks/useSidebar";

import { useContext } from "react";

import { AuthContext } from "@context/AuthContext";

export const Home = () => {
  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  const { isMobile, sidebarOpen } = useSidebar();

  return (
    <main
      className={`min-h-screen transition-all duration-300 ${isMobile ? "ml-0" : sidebarOpen ? "ml-64" : "ml-20"} animate__animated animate__fadeIn`}
    >
      <div className="grid grid-rows-4 w-full h-screen">
        <div className="bg-yellow-700 flex justify-center items-center">
          {" "}
          <code>{user?.id}</code>
        </div>
        <div className="bg-red-700 row-start-2 flex justify-center items-center">
          <code>{user?.email}</code>
        </div>
        <div className="bg-blue-700 row-start-3 flex justify-center items-center">
          3
        </div>
        <div className="bg-green-700 row-start-4 flex justify-center items-center">
          4
        </div>
      </div>
    </main>
  );
};
