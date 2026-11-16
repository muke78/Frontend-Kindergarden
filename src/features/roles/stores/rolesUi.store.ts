import { create } from "zustand";
import type { Role } from "@/types/rbac.types";

type Dialog =
	| { kind: "create" }
	| { kind: "edit"; role: Role }
	| { kind: "delete"; role: Role }
	| { kind: "permissions"; role: Role };

type Filters = { page: number; limit: number; search: string };

type RolesUiState = {
	filters: Filters;
	dialog: Dialog | null;
	setSearch: (v: string) => void;
	setPage: (v: number) => void;
	openCreate: () => void;
	openEdit: (r: Role) => void;
	openDelete: (r: Role) => void;
	openPermissions: (r: Role) => void;
	closeDialog: () => void;
};

const def: Filters = { page: 1, limit: 20, search: "" };

export const useRolesUiStore = create<RolesUiState>((set) => ({
	filters: def,
	dialog: null,
	setSearch: (search) => set((s) => ({ filters: { ...s.filters, search, page: 1 } })),
	setPage: (page) => set((s) => ({ filters: { ...s.filters, page } })),
	openCreate: () => set({ dialog: { kind: "create" } }),
	openEdit: (role) => set({ dialog: { kind: "edit", role } }),
	openDelete: (role) => set({ dialog: { kind: "delete", role } }),
	openPermissions: (role) => set({ dialog: { kind: "permissions", role } }),
	closeDialog: () => set({ dialog: null }),
}));
