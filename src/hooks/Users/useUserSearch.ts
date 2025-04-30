import { searchUserService } from "@/services/Users/userService";

import { useQuery } from "@tanstack/react-query";

export const useUserSearch = (correo: string) => {
  // Buscar un usuario por su correo electrónico
  const { data } = useQuery({
    queryKey: ["userSearch", correo],
    queryFn: () => searchUserService(correo),
    enabled: !!correo,
    staleTime: 0,
    refetchOnWindowFocus: false,
    retry: false,
  });

  return {
    data,
  };
};
