import { useAuthStore } from "@/store/authStore";

import { api } from "@config/api";

interface User {
  message: string;
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

interface UpdateUserPayload {
  id: string;
  nameUser?: string;
  email?: string;
  password?: string;
  role?: string;
  accountStatus?: string;
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
  // Crear un objeto de actualización sin la contraseña
  const updatePayload: UpdateUserPayload = {
    id,
    nameUser: updates.NameUser,
    email: updates.Email,
    role: updates.Role,
    accountStatus: updates.AccountStatus,
  };

  // Solo agregar la contraseña si se proporciona una nueva
  if (updates.Password && updates.Password.trim() !== "") {
    updatePayload.password = updates.Password;
  }

  const response = await api.put<ApiResponse<User>>(
    "/actualizar-usuario",
    updatePayload,
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
