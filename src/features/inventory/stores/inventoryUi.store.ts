import { create } from "zustand";

import type { InventoryItem } from "@/types/asset.types";

type Dialog =
	| { kind: "create" }
	| { kind: "edit"; item: InventoryItem }
	| { kind: "delete"; item: InventoryItem };

type Filters = { page: number; limit: number; search: string; classroom_id?: string };

type InventoryUiState = {
	filters: Filters;
	dialog: Dialog | null;
	setSearch: (v: string) => void;
	setClassroom: (v?: string) => void;
	setPage: (v: number) => void;
	openCreate: () => void;
	openEdit: (i: InventoryItem) => void;
	openDelete: (i: InventoryItem) => void;
	closeDialog: () => void;
};

const def: Filters = { page: 1, limit: 20, search: "" };

export const useInventoryUiStore = create<InventoryUiState>((set) => ({
	filters: def,
	dialog: null,
	setSearch: (search) => set((s) => ({ filters: { ...s.filters, search, page: 1 } })),
	setClassroom: (classroom_id) => set((s) => ({ filters: { ...s.filters, classroom_id, page: 1 } })),
	setPage: (page) => set((s) => ({ filters: { ...s.filters, page } })),
	openCreate: () => set({ dialog: { kind: "create" } }),
	openEdit: (item) => set({ dialog: { kind: "edit", item } }),
	openDelete: (item) => set({ dialog: { kind: "delete", item } }),
	closeDialog: () => set({ dialog: null }),
}));
