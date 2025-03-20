import toast from "react-hot-toast";
import { useNavigate } from "react-router";

import { registerService } from "@services/register/registerService";
import { useMutation } from "@tanstack/react-query";

export const useRegister = () => {
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: (data: {
      nameUser: string;
      email: string;
      password: string;
      role: string;
    }) => registerService(data.nameUser, data.email, data.password, data.role),
    onSuccess: (_, variables) => {
      toast.success(
        `Se registro exitosamente el usuario ${variables.nameUser}`,
        {
          duration: 7000,
        },
      );
      navigate("/login");
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
