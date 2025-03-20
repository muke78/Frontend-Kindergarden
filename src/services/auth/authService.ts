import { api } from "../../config/api";

interface LoginResponse {
  success: boolean;
  data: string;
  message: string;
  metadata: {
    timestamp: string;
    requestId: string;
    dataCount: number;
  };
}

export const loginService = async (
  email: string,
  password: string,
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/login", { email, password });
  return response.data;
};
