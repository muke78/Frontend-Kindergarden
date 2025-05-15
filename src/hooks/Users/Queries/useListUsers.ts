import { listUsersService } from "@/services/Users/userService";

import { useQuery } from "@tanstack/react-query";

// Interfaz para los parámetros de búsqueda
interface GetUsersParams {
  status: string;
  correo?: string;
  rol?: string;
}

export const useListUsers = (params?: GetUsersParams) => {
  // Obtener usuarios
  const { data, isLoading, error } = useQuery({
    queryKey: ["users", params],
    queryFn: () => listUsersService(params ?? { status: "Activo" }),
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
    enabled: !!params,
  });

  return {
    data,
    isLoading,
    error,
  };
};
