import { useAuthStore } from "@/store/authStore";

import { api } from "@config/api";

interface User {
  ID: string;
  NameUser: string;
  Email: string;
  Password?: string;
  Role: string;
  LastLogin: string;
  AccountStatus: string;
  Created: string;
  Updated: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  metadata?: {
    timestamp: string;
    requestId: string;
    dataCount?: number;
  };
}

interface UserUpdatePayload {
  NameUser?: string;
  Email?: string;
  Password?: string;
  Role?: string;
  AccountStatus?: string;
}

// Función para obtener headers con el token
const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${useAuthStore.getState().token}`,
  },
});

// Listar todos los usuarios que hya en la abse de datos
export const listUsersService = async (): Promise<ApiResponse<User[]>> => {
  const response = await api.get<ApiResponse<User[]>>(
    "/lista-de-usuarios",
    getAuthHeaders(),
  );
  return response.data;
};

// Crear un usuario
export const createUserService = async (
  nameUser: string,
  email: string,
  password: string,
  role: string,
): Promise<ApiResponse<User>> => {
  const response = await api.post<ApiResponse<User>>(
    "/crear-usuario",
    { nameUser, email, password, role },
    getAuthHeaders(),
  );
  return response.data;
};

// Actualizar un usuario
export const updateUserService = async (
  id: string,
  updates: UserUpdatePayload,
): Promise<ApiResponse<User>> => {
  const response = await api.put<ApiResponse<User>>(
    "/actualizar-usuario",
    { id, ...updates },
    getAuthHeaders(),
  );
  return response.data;
};

// Eliminar usuario
export const deleteUserService = async (
  id: string,
): Promise<ApiResponse<{ message: string }>> => {
  const response = await api.delete<ApiResponse<{ message: string }>>(
    `/eliminar-usuario/${id}`,
    getAuthHeaders(),
  );
  return response.data;
};
