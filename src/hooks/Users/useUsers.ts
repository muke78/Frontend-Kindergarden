import {
  createUserService,
  deleteUserBulkService,
  deleteUserService,
  updateUserService,
} from "@/services/Users/userService";
import { useUserStore } from "@/store/Users/useUserStore";

import toast from "react-hot-toast";

import { useMutation, useQueryClient } from "@tanstack/react-query";

interface User {
  id: string;
  nameUser: string;
  email: string;
  profilePicture: string;
  role: string;
  accountType: string;
  accountStatus: string;
}

interface UserUpdatePayload {
  NameUser?: string;
  Email?: string;
  Password?: string;
  Role?: string;
  AccountStatus?: string;
}

export const useUsers = () => {
  const { addUser, updateUser, deleteUser } = useUserStore();
  const queryClient = useQueryClient();

  // Crear usuario
  const createUserMutation = useMutation({
    mutationFn: (data: {
      nameUser: string;
      email: string;
      password: string;
      role: string;
      profilePicture: string;
      accountType: string;
    }) =>
      createUserService(data.nameUser, data.email, data.password, data.role),
    onSuccess: (newUser) => {
      const userToAdd: User = {
        id: Date.now().toString(),
        nameUser: newUser.data.NameUser,
        email: newUser.data.Email,
        profilePicture: newUser.data.ProfilePicture,
        role: newUser.data.Role,
        accountType: newUser.data.AccountType,
        accountStatus: newUser.data.AccountStatus,
      };

      addUser(userToAdd);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(
        `Se creo correctamente al usuario ${newUser.data.NameUser}`,
        {
          duration: 5000,
        },
      );
    },
    onError: (error: {
      response?: { data?: { error?: { message?: string } } };
    }) => {
      toast.error(error.response?.data?.error?.message || "An error occurred", {
        duration: 5000,
      });
    },
  });

  // Actualizar usuario
  const updateUserMutation = useMutation({
    mutationFn: (data: {
      id: string;
      nameUser: string;
      email: string;
      password?: string;
      role: string;
      accountStatus: string;
    }) => {
      // Crear un payload condicional
      const payload: UserUpdatePayload = {
        NameUser: data.nameUser,
        Email: data.email,
        Role: data.role,
        AccountStatus: data.accountStatus,
      };

      // Solo agregar la contraseña si existe y no está vacía
      if (data.password && data.password.trim() !== "") {
        payload.Password = data.password;
      }

      return updateUserService(data.id, payload);
    },
    onSuccess: (updatedUser) => {
      updateUser(updatedUser.data.ID, {
        nameUser: updatedUser.data.NameUser,
        email: updatedUser.data.Email,
        role: updatedUser.data.Role,
        accountStatus: updatedUser.data.AccountStatus,
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(`${updatedUser?.data?.message}`, {
        duration: 5000,
      });
    },
    onError: (error: {
      response?: { data?: { error?: { message?: string } } };
    }) => {
      toast.error(error.response?.data?.error?.message || "An error occurred", {
        duration: 5000,
      });
    },
  });

  // Eliminar usuario
  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => deleteUserService(id),
    onSuccess: (data, id) => {
      deleteUser(id);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(data.data.message, {
        duration: 5000,
      });
    },
    onError: (error: {
      response?: { data?: { error?: { message?: string } } };
    }) => {
      toast.error(error.response?.data?.error?.message || "An error occurred", {
        duration: 5000,
      });
    },
  });

  // Eliminacion de usuario por medio de eliminacion masiva
  const deleteTaskBulkMutation = useMutation({
    mutationFn: (ids: string[]) => deleteUserBulkService({ ids }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(data.data.message, {
        duration: 5000,
      });
    },
    onError: (error: {
      response?: { data?: { error?: { message?: string } } };
    }) => {
      toast.error(error.response?.data?.error?.message || "An error occurred", {
        duration: 15000,
      });
    },
  });

  return {
    createUser: createUserMutation.mutate,
    updateUser: updateUserMutation.mutate,
    deleteUser: deleteUserMutation.mutate,
    deleteUserBulk: deleteTaskBulkMutation.mutate,
  };
};
