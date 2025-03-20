import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router";

import { useMutation } from "@tanstack/react-query";

import { loginService } from "../services/authService";
import { useAuthStore } from "../store/authStore";

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
    },
    onError: (error: {
      response?: { data?: { error?: { message?: string } } };
    }) => {
      toast.error(error.response?.data?.error?.message || "An error occurred", {
        duration: 5000,
      });
    },
  });
  return mutation;
};
