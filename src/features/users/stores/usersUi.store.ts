import { create } from "zustand";

import type { User } from "@/types/user.types";

export type UsersFilters = {
	page: number;
	limit: number;
	search: string;
	roleId?: string;
	statusId?: string;
};

export type UsersDialog =
	| { kind: "create" }
	| { kind: "edit"; user: User }
	| { kind: "delete"; user: User }
	| { kind: "permissions"; user: User }
	| null;

type UsersUiState = {
	filters: UsersFilters;
	dialog: UsersDialog;
	rowSelection: Record<string, boolean>;
	setSearch: (value: string) => void;
	setRole: (value?: string) => void;
	setStatus: (value?: string) => void;
	setPage: (value: number) => void;
	setLimit: (value: number) => void;
	resetFilters: () => void;
	setRowSelection: (v: Record<string, boolean>) => void;
	clearSelection: () => void;
	openCreate: () => void;
	openEdit: (user: User) => void;
	openDelete: (user: User) => void;
	openPermissions: (user: User) => void;
	closeDialog: () => void;
};

const initialFilters: UsersFilters = {
	page: 1,
	limit: 20,
	search: "",
	roleId: undefined,
	statusId: undefined,
};

export const useUsersUiStore = create<UsersUiState>((set) => ({
	filters: initialFilters,
	dialog: null,
	rowSelection: {},
	setSearch: (search) => set((s) => ({ filters: { ...s.filters, search, page: 1 } })),
	setRole: (roleId) => set((s) => ({ filters: { ...s.filters, roleId, page: 1 } })),
	setStatus: (statusId) => set((s) => ({ filters: { ...s.filters, statusId, page: 1 } })),
	setPage: (page) => set((s) => ({ filters: { ...s.filters, page } })),
	setLimit: (limit) => set((s) => ({ filters: { ...s.filters, limit, page: 1 } })),
	resetFilters: () => set({ filters: initialFilters }),
	setRowSelection: (rowSelection) => set({ rowSelection }),
	clearSelection: () => set({ rowSelection: {} }),
	openCreate: () => set({ dialog: { kind: "create" } }),
	openEdit: (user) => set({ dialog: { kind: "edit", user } }),
	openDelete: (user) => set({ dialog: { kind: "delete", user } }),
	openPermissions: (user) => set({ dialog: { kind: "permissions", user } }),
	closeDialog: () => set({ dialog: null }),
}));
