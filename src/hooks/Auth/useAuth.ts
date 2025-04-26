import { loginService } from "@/services/Auth/authService";
import { useAuthStore } from "@/store/Auth/authStore";

import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router";

import { useMutation } from "@tanstack/react-query";

export const useLogin = () => {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const { pathname, search } = useLocation();

  const mutation = useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      loginService(data.email, data.password),
    onSuccess: (data) => {
      login(data.data);
      const lastPath = pathname + search;
      localStorage.setItem("lastPath", lastPath);
      navigate(lastPath, { replace: true });
      toast.success(`Bienvenid@, has iniciado sesión correctamente`, {
        duration: 9000,
      });
    },
    onError: (error: {
      response?: { data?: { error?: { message?: string } } };
      message?: string;
    }) => {
      const message =
        error?.response?.data?.error?.message ||
        error?.message ||
        "Ocurrió un error de red";
      toast.error(message, { duration: 5000 });
    },
  });
  return mutation;
};
