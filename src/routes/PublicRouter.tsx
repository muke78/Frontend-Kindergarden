import { Navigate } from "react-router";

import { useAuthStore } from "@store/authStore";

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRouter = ({ children }: PublicRouteProps) => {
  // Obtiene el estado de autenticación desde Zustand
  const { user, token } = useAuthStore();

  // Si el usuario está autenticado (ya sea con el usuario o el token), redirige a /home
  if (user || token) {
    return <Navigate to="/home" />;
  }

  return <>{children}</>;
};
