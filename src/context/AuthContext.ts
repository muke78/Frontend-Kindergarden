import { createContext } from "react";

interface User {
  id: string;
  nameUser: string;
  email: string;
  role: string;
  lastLogin: string;
  accountStatus: string;
}

interface AuthContextType {
  user: User | null;
}
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
