import { create } from "zustand";

import type { Classroom } from "@/types/people.types";

type Dialog =
	| { kind: "create" }
	| { kind: "edit"; classroom: Classroom }
	| { kind: "delete"; classroom: Classroom };

type Filters = { page: number; limit: number; search: string };

type ClassroomsUiState = {
	filters: Filters;
	dialog: Dialog | null;
	setSearch: (search: string) => void;
	setPage: (page: number) => void;
	resetFilters: () => void;
	openCreate: () => void;
	openEdit: (classroom: Classroom) => void;
	openDelete: (classroom: Classroom) => void;
	closeDialog: () => void;
};

const defaultFilters: Filters = { page: 1, limit: 20, search: "" };

export const useClassroomsUiStore = create<ClassroomsUiState>((set) => ({
	filters: defaultFilters,
	dialog: null,
	setSearch: (search) => set((s) => ({ filters: { ...s.filters, search, page: 1 } })),
	setPage: (page) => set((s) => ({ filters: { ...s.filters, page } })),
	resetFilters: () => set({ filters: defaultFilters }),
	openCreate: () => set({ dialog: { kind: "create" } }),
	openEdit: (classroom) => set({ dialog: { kind: "edit", classroom } }),
	openDelete: (classroom) => set({ dialog: { kind: "delete", classroom } }),
	closeDialog: () => set({ dialog: null }),
}));
