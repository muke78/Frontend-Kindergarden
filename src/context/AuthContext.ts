import { createContext } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  logged: boolean;
  user: User | null;
}

interface AuthContextProps {
  state: AuthState;
  logged: boolean;
  login: (user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined,
);
