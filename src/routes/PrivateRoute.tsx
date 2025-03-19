import { useContext } from "react";
import { Navigate, useLocation } from "react-router";

import { AuthContext } from "../context/AuthContext";

interface PrivateRouteProps {
  children: React.ReactNode;
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const authContext = useContext(AuthContext);
  const { pathname, search } = useLocation();

  if (!authContext) {
    return <Navigate to="/login" />;
  }
  const { logged } = authContext;

  const lastPath = pathname + search;
  localStorage.setItem("lastPath", lastPath);

  return logged ? <>{children}</> : <Navigate to="/login" />;
};
