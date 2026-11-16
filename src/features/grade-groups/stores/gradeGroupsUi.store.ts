import { create } from "zustand";

import type { GradeGroup } from "@/types/catalog.types";

type Dialog =
	| { kind: "create" }
	| { kind: "edit"; gradeGroup: GradeGroup }
	| { kind: "delete"; gradeGroup: GradeGroup };

type Filters = { page: number; limit: number; search: string };

type GradeGroupsUiState = {
	filters: Filters;
	dialog: Dialog | null;
	setSearch: (search: string) => void;
	setPage: (page: number) => void;
	openCreate: () => void;
	openEdit: (gradeGroup: GradeGroup) => void;
	openDelete: (gradeGroup: GradeGroup) => void;
	closeDialog: () => void;
};

const defaultFilters: Filters = { page: 1, limit: 50, search: "" };

export const useGradeGroupsUiStore = create<GradeGroupsUiState>((set) => ({
	filters: defaultFilters,
	dialog: null,
	setSearch: (search) => set((s) => ({ filters: { ...s.filters, search, page: 1 } })),
	setPage: (page) => set((s) => ({ filters: { ...s.filters, page } })),
	openCreate: () => set({ dialog: { kind: "create" } }),
	openEdit: (gradeGroup) => set({ dialog: { kind: "edit", gradeGroup } }),
	openDelete: (gradeGroup) => set({ dialog: { kind: "delete", gradeGroup } }),
	closeDialog: () => set({ dialog: null }),
}));
