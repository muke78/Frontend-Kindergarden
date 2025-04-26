import { googleLoginService } from "@/services/Auth/googleLoginService";
import { useAuthStore } from "@/store/Auth/authStore";

import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router";

import { useMutation } from "@tanstack/react-query";

export const useAuthGoogleLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { pathname, search } = useLocation();

  const mutation = useMutation({
    mutationFn: (credential: string) => googleLoginService(credential),
    onSuccess: (data) => {
      login(data.data.token);
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
