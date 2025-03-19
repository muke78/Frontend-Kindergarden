import { ReactNode, useReducer } from "react";

import { typeAuth } from "../type/typeAuth";
import { AuthContext } from "./AuthContext";
import { authReducer } from "./authReducer";

export interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  logged: boolean;
  user: User | null;
}

const initialState: AuthState = {
  logged: false,
  user: null,
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = (user: User) => {
    dispatch({ type: typeAuth.login, payload: user });
  };

  const logout = () => {
    dispatch({ type: typeAuth.logout });
  };

  return (
    <AuthContext.Provider
      value={{ state, logged: state.logged, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
