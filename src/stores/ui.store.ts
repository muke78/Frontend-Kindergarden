import { create } from "zustand";
import { persist } from "zustand/middleware";

type UiState = {
	sidebarOpen: boolean;
	setSidebarOpen: (value: boolean) => void;
	toggleSidebar: () => void;
};

export const useUiStore = create<UiState>()(
	persist(
		(set) => ({
			sidebarOpen: true,
			setSidebarOpen: (value) => set({ sidebarOpen: value }),
			toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
		}),
		{ name: "kinder.ui" },
	),
);
