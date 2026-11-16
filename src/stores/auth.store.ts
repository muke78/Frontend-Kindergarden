import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { AuthUser } from "@/types/auth.types";

type AuthState = {
	user: AuthUser | null;
	isHydrated: boolean;
	setUser: (user: AuthUser | null) => void;
	setHydrated: (value: boolean) => void;
	reset: () => void;
};

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			user: null,
			isHydrated: false,
			setUser: (user) => set({ user }),
			setHydrated: (value) => set({ isHydrated: value }),
			reset: () => set({ user: null }),
		}),
		{
			name: "kinder.auth",
			partialize: (state) => ({ user: state.user }),
			onRehydrateStorage: () => (state) => state?.setHydrated(true),
		},
	),
);
