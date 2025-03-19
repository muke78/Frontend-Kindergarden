import React, { useContext } from "react";
import { Navigate } from "react-router";

import { AuthContext } from "../context/AuthContext";

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRouter = ({ children }: PublicRouteProps) => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return <Navigate to="/login" />;
  }

  const { logged } = authContext;

  return logged ? <Navigate to="/home" /> : <>{children}</>;
};
