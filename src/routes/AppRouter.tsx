import { Catalogs } from "@/pages/PrivateRoutes/Catalogs";
import { Confi } from "@/pages/PrivateRoutes/Confi";
import { Evaluations } from "@/pages/PrivateRoutes/Evaluations";
import { Help } from "@/pages/PrivateRoutes/Help";
import { Reports } from "@/pages/PrivateRoutes/Reports";
import { Users } from "@/pages/PrivateRoutes/Users";

// import { Evaluations } from "@/pages/PrivateRoutes/evaluations";

import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { NotFound } from "@pages/NotFound";
import { Home } from "@pages/PrivateRoutes/Home";
import { Login } from "@pages/PublicPages/Login";
import { Register } from "@pages/PublicPages/Register";
import { PrivateRoute } from "@routes/PrivateRoute";
import { PublicRouter } from "@routes/PublicRouter";
import { useAuthStore } from "@store/authStore";

import { Student } from "../pages/PrivateRoutes/Student";
import { Teachers } from "../pages/PrivateRoutes/Teachers";

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
      <Route
        path="/users"
        element={
          <PrivateRoute>
            <Users />
          </PrivateRoute>
        }
      />
      <Route
        path="/teachers"
        element={
          <PrivateRoute>
            <Teachers />
          </PrivateRoute>
        }
      />
      <Route
        path="/students"
        element={
          <PrivateRoute>
            <Student />
          </PrivateRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <PrivateRoute>
            <Reports />
          </PrivateRoute>
        }
      />
      <Route
        path="/evaluations"
        element={
          <PrivateRoute>
            <Evaluations />
          </PrivateRoute>
        }
      />
      <Route
        path="/catalogs"
        element={
          <PrivateRoute>
            <Catalogs />
          </PrivateRoute>
        }
      />
      <Route
        path="/config"
        element={
          <PrivateRoute>
            <Confi />
          </PrivateRoute>
        }
      />
      <Route
        path="/help"
        element={
          <PrivateRoute>
            <Help />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};
