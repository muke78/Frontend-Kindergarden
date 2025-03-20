import { Sidebar } from "@/components/Sidebar";

import { useContext, useState } from "react";

import { AuthContext } from "@context/AuthContext";

export const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={() => setSidebarOpen(!sidebarOpen)}
      />{" "}
      {/* Ajusta el ancho del sidebar según sea necesario */}
      {/* Contenido principal */}
      <div className="flex flex-col items-center justify-start w-full bg-[theme('colors.bgtotal')] text-[theme('colors.text')]">
        {/* Area 1 */}
        <section className="bg-[rgba(229,67,26,0.14)] flex items-center justify-center w-full h-1/4">
          <code>{user?.id}</code>
        </section>

        {/* Area 2 */}
        <section className="bg-[rgba(77,237,106,0.14)] flex items-center justify-center w-full h-1/4">
          <h1>Bienvenido, {user?.nameUser || "Invitado"}!</h1>
        </section>

        {/* Area 2 */}
        <section className="bg-[rgba(77,160,237,0.14)] flex items-center justify-center w-full h-1/4">
          <h1>Bienvenido, {user?.nameUser || "Invitado"}!</h1>
        </section>

        {/* Main */}
        <section className="bg-[rgba(179,46,241,0.14)] p-4 w-full h-1/4">
          <h2>Tu correo es, {user?.email} </h2>
          <h3>Tu role es {user?.role} </h3>
        </section>
      </div>
    </div>
  );
};
