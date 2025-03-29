import { api } from "@config/api";

interface GoogleLoginResponse {
  success: boolean;
  data: {
    token: string;
  };
  message: string;
  metadata: {
    timestamp: string;
    requestId: string;
    dataCount: number;
  };
}

export const googleLoginService = async (
  credential: string,
): Promise<GoogleLoginResponse> => {
  const response = await api.post<GoogleLoginResponse>("/auth/google", {
    credential,
  });
  return response.data;
};
