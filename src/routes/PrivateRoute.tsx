import { useEffect } from "react";
import { Navigate, useLocation } from "react-router";

import { useAuthStore } from "@store/authStore";

interface PrivateRouteProps {
  children: React.ReactNode;
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { user, token, checkTokenExpiration } = useAuthStore();
  const { pathname, search } = useLocation();

  const lastPath = pathname + search;
  localStorage.setItem("lastPath", lastPath);

  const timeExp = 1 * 60 * 60 * 1000;

  useEffect(() => {
    const interval = setInterval(() => {
      checkTokenExpiration();
    }, timeExp); // Cada hora

    return () => clearInterval(interval);
  }, [checkTokenExpiration, timeExp]);

  return user && token ? children : <Navigate to="/login" />;
};
