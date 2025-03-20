import { jwtDecode } from "jwt-decode";
import { create } from "zustand";

interface User {
  id: string;
  nameUser: string;
  email: string;
  role: string;
  lastLogin: string;
  accountStatus: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

interface DecodedToken {
  id: string;
  nameUser: string;
  email: string;
  role: string;
  lastLogin: string;
  accountStatus: string;
  exp: number;
}

export const useAuthStore = create<AuthState>((set) => {
  const token = localStorage.getItem("token");
  let user: User | null = null;

  if (token) {
    try {
      const decoded: DecodedToken = jwtDecode(token);
      user = {
        id: decoded.id,
        nameUser: decoded.nameUser,
        email: decoded.email,
        role: decoded.role,
        lastLogin: decoded.lastLogin,
        accountStatus: decoded.accountStatus,
      };
    } catch (error) {
      console.error("Error al decodificar el token", error);
    }
  }

  return {
    user,
    token,

    login: async (token) => {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        set({
          user: {
            id: decoded.id,
            nameUser: decoded.nameUser,
            email: decoded.email,
            role: decoded.role,
            lastLogin: decoded.lastLogin,
            accountStatus: decoded.accountStatus,
          },
          token,
        });
        localStorage.setItem("token", token);
      } catch (error) {
        console.error("Error al decodificar el token", error);
      }
    },

    logout: () => {
      set({ user: null, token: null });
      localStorage.removeItem("token");
    },
  };
});
