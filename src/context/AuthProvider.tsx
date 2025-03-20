// AuthProvider.tsx
import { ReactNode } from "react";

import { AuthContext } from "@context/AuthContext";
import { useAuthStore } from "@store/authStore";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuthStore();
  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};
