import { api } from "@config/api";

interface RegisterResponse {
  success: boolean;
  data: string;
  message: string;
  metadata: {
    timestamp: string;
    requestId: string;
    dataCount: number;
  };
}

export const registerService = async (
  nameUser: string,
  email: string,
  password: string,
): Promise<RegisterResponse> => {
  const response = await api.post<RegisterResponse>("/registrar-usuario", {
    nameUser,
    email,
    password,
  });
  return response.data;
};
