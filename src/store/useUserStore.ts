import { listUsersService } from "@/services/userService";

import { create } from "zustand";

interface User {
  id: string;
  nameUser: string;
  email: string;
  role: string;
  accountType: string;
  accountStatus: string;
}

interface UserState {
  users: User[] | null;
  setUsers: (users: User[]) => void;
  addUser: (user: User) => void;
  updateUser: (id: string, updatedUser: Partial<User>) => void;
  deleteUser: (id: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  setUsers: async () => {
    try {
      const response = await listUsersService();
      set({ users: response.data as unknown as User[] });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  },

  addUser: (user) =>
    set((state) => ({
      users: [...(state.users || []), user],
    })),

  updateUser: (id, updatedUser) =>
    set((state) => ({
      users: (state.users || []).map((user) =>
        user.id === id ? { ...user, ...updatedUser } : user,
      ),
    })),

  deleteUser: (id) =>
    set((state) => ({
      users: (state.users || []).filter((user) => user.id !== id),
    })),
}));
