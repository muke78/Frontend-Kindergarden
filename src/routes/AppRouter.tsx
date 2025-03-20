import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";

import { NotFound } from "../pages/NotFound";
import { Home } from "../pages/PrivateRoutes/Home";
import { Login } from "../pages/PublicPages/Login";
import { Register } from "../pages/PublicPages/Register";
import { PrivateRoute } from "../routes/PrivateRoute";
import { PublicRouter } from "../routes/PublicRouter";
import { useAuthStore } from "../store/authStore";

export const AppRouter = () => {
  const { login } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      login(token);
    }
  }, [login]);

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRouter>
            <Login />
          </PublicRouter>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRouter>
            <Register />
          </PublicRouter>
        }
      />
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
