// AuthProvider.tsx
import { ReactNode } from "react";

import { useAuthStore } from "../store/authStore";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuthStore();
  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};
