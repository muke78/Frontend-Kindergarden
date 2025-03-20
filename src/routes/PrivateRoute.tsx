import { Navigate, useLocation } from "react-router";

import { useAuthStore } from "../store/authStore";

interface PrivateRouteProps {
  children: React.ReactNode;
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { user, token } = useAuthStore();
  const { pathname, search } = useLocation();

  const lastPath = pathname + search;
  localStorage.setItem("lastPath", lastPath);

  return user && token ? children : <Navigate to="/login" />;
};
