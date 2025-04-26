import { useAuthStore } from "@/store/Auth/authStore";

import { useEffect } from "react";
import { Navigate, useLocation } from "react-router";

interface PrivateRouteProps {
  children: React.ReactNode;
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { user, token, checkTokenExpiration } = useAuthStore();
  const { pathname, search } = useLocation();

  const lastPath = pathname + search;
  localStorage.setItem("lastPath", lastPath);

  const timeExp = 6 * 60 * 60 * 1000;

  useEffect(() => {
    const interval = setInterval(() => {
      checkTokenExpiration();
    }, timeExp); // Cada 6 horas

    return () => clearInterval(interval);
  }, [checkTokenExpiration, timeExp]);

  return user && token ? children : <Navigate to="/login" />;
};
