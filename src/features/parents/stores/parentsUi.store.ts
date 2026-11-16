import { create } from "zustand";

import type { Parent } from "@/types/people.types";

type Dialog =
	| { kind: "create" }
	| { kind: "edit"; parent: Parent }
	| { kind: "delete"; parent: Parent };

type Filters = { page: number; limit: number; search: string; status_id?: string };

type ParentsUiState = {
	filters: Filters;
	dialog: Dialog | null;
	setSearch: (v: string) => void;
	setStatus: (v?: string) => void;
	setPage: (v: number) => void;
	setLimit: (v: number) => void;
	resetFilters: () => void;
	openCreate: () => void;
	openEdit: (p: Parent) => void;
	openDelete: (p: Parent) => void;
	closeDialog: () => void;
};

const def: Filters = { page: 1, limit: 20, search: "" };

export const useParentsUiStore = create<ParentsUiState>((set) => ({
	filters: def,
	dialog: null,
	setSearch: (search) => set((s) => ({ filters: { ...s.filters, search, page: 1 } })),
	setStatus: (status_id) => set((s) => ({ filters: { ...s.filters, status_id, page: 1 } })),
	setPage: (page) => set((s) => ({ filters: { ...s.filters, page } })),
	setLimit: (limit) => set((s) => ({ filters: { ...s.filters, limit, page: 1 } })),
	resetFilters: () => set({ filters: def }),
	openCreate: () => set({ dialog: { kind: "create" } }),
	openEdit: (parent) => set({ dialog: { kind: "edit", parent } }),
	openDelete: (parent) => set({ dialog: { kind: "delete", parent } }),
	closeDialog: () => set({ dialog: null }),
}));
