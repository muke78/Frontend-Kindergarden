import { useContext } from "react";

import { AuthContext } from "../../context/AuthContext";

export const Home = () => {
  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  return (
    <div>
      <code>{user?.id}</code>
      <h1>Bienvenido, {user?.nameUser || "Invitado"}!</h1>
      <h2>Tu correo es, {user?.email} </h2>
      <h3>Tu role es {user?.role} </h3>
    </div>
  );
};
