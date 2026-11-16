import { create } from "zustand";

import type { Asset } from "@/types/asset.types";

type Dialog = { kind: "create" } | { kind: "edit"; asset: Asset } | { kind: "delete"; asset: Asset };

type Filters = { page: number; limit: number; search: string; classroom_id?: string };

type AssetsUiState = {
	filters: Filters;
	dialog: Dialog | null;
	setSearch: (v: string) => void;
	setClassroom: (v?: string) => void;
	setPage: (v: number) => void;
	openCreate: () => void;
	openEdit: (a: Asset) => void;
	openDelete: (a: Asset) => void;
	closeDialog: () => void;
};

const def: Filters = { page: 1, limit: 20, search: "" };

export const useAssetsUiStore = create<AssetsUiState>((set) => ({
	filters: def,
	dialog: null,
	setSearch: (search) => set((s) => ({ filters: { ...s.filters, search, page: 1 } })),
	setClassroom: (classroom_id) => set((s) => ({ filters: { ...s.filters, classroom_id, page: 1 } })),
	setPage: (page) => set((s) => ({ filters: { ...s.filters, page } })),
	openCreate: () => set({ dialog: { kind: "create" } }),
	openEdit: (asset) => set({ dialog: { kind: "edit", asset } }),
	openDelete: (asset) => set({ dialog: { kind: "delete", asset } }),
	closeDialog: () => set({ dialog: null }),
}));
