import { api } from "../../config/api";

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
  role: string,
): Promise<RegisterResponse> => {
  const response = await api.post<RegisterResponse>("/crear-usuario", {
    nameUser,
    email,
    password,
    role,
  });
  return response.data;
};
