import { create } from "zustand";

import type { Teacher } from "@/types/people.types";

type Dialog =
	| { kind: "create" }
	| { kind: "edit"; teacher: Teacher }
	| { kind: "delete"; teacher: Teacher };

type Filters = {
	page: number;
	limit: number;
	search: string;
	status_id?: string;
	work_shift_id?: string;
};

type TeachersUiState = {
	filters: Filters;
	dialog: Dialog | null;
	setSearch: (v: string) => void;
	setStatus: (v?: string) => void;
	setWorkShift: (v?: string) => void;
	setPage: (v: number) => void;
	setLimit: (v: number) => void;
	resetFilters: () => void;
	openCreate: () => void;
	openEdit: (t: Teacher) => void;
	openDelete: (t: Teacher) => void;
	closeDialog: () => void;
};

const def: Filters = { page: 1, limit: 20, search: "" };

export const useTeachersUiStore = create<TeachersUiState>((set) => ({
	filters: def,
	dialog: null,
	setSearch: (search) => set((s) => ({ filters: { ...s.filters, search, page: 1 } })),
	setStatus: (status_id) => set((s) => ({ filters: { ...s.filters, status_id, page: 1 } })),
	setWorkShift: (work_shift_id) =>
		set((s) => ({ filters: { ...s.filters, work_shift_id, page: 1 } })),
	setPage: (page) => set((s) => ({ filters: { ...s.filters, page } })),
	setLimit: (limit) => set((s) => ({ filters: { ...s.filters, limit, page: 1 } })),
	resetFilters: () => set({ filters: def }),
	openCreate: () => set({ dialog: { kind: "create" } }),
	openEdit: (teacher) => set({ dialog: { kind: "edit", teacher } }),
	openDelete: (teacher) => set({ dialog: { kind: "delete", teacher } }),
	closeDialog: () => set({ dialog: null }),
}));
