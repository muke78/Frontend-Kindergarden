import toast from "react-hot-toast";

import { jwtDecode } from "jwt-decode";
import { create } from "zustand";

interface User {
  id: string;
  nameUser: string;
  email: string;
  profilePicture: string;
  role: string;
  accountType: string;
  lastLogin: string;
  accountStatus: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  login: (token: string) => Promise<void>;
  logout: () => void;
  checkTokenExpiration: () => void;
}

interface DecodedToken {
  id: string;
  nameUser: string;
  email: string;
  profilePicture: string;
  role: string;
  accountType: string;
  lastLogin: string;
  accountStatus: string;
  iat: number;
  exp: number;
}

export const useAuthStore = create<AuthState>((set) => {
  const token = localStorage.getItem("token");
  let user: User | null = null;

  if (token) {
    try {
      const decoded: DecodedToken = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp > currentTime) {
        user = {
          id: decoded.id,
          nameUser: decoded.nameUser,
          email: decoded.email,
          profilePicture: decoded.profilePicture,
          role: decoded.role,
          accountType: decoded.accountType,
          lastLogin: decoded.lastLogin,
          accountStatus: decoded.accountStatus,
        };
      } else {
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.error("Error al decodificar el token", error);
    }
  }

  return {
    user,
    token,
    setToken: (token) => set({ token }),
    setUser: (user) => set({ user }),

    login: async (token) => {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        set({
          user: {
            id: decoded.id,
            nameUser: decoded.nameUser,
            email: decoded.email,
            profilePicture: decoded.profilePicture,
            role: decoded.role,
            accountType: decoded.accountType,
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

    checkTokenExpiration: () => {
      const { token } = useAuthStore.getState();
      if (!token) return;

      try {
        const decoded: DecodedToken = jwtDecode(token);
        const currentTime = Date.now();
        const threeHoursInMilliseconds = 12 * 60 * 60 * 1000;

        if (currentTime - decoded.iat * 1000 >= threeHoursInMilliseconds) {
          toast.success(
            "Cerrando sesión por inactividad. El tiempo límite ha sido alcanzado.",
            {
              duration: 15000,
            },
          );
          useAuthStore.setState({ user: null, token: null });
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("Error al decodificar el token", error);
      }
    },
  };
});
