import { create } from "zustand";

import type { Student } from "@/types/people.types";

type Dialog =
	| { kind: "create" }
	| { kind: "edit"; student: Student }
	| { kind: "delete"; student: Student }
	| { kind: "assign-parents"; student: Student }
	| { kind: "assign-teacher"; student: Student };

type Filters = {
	page: number;
	limit: number;
	search: string;
	status_id?: string;
	grade_group_id?: string;
};

type StudentsUiState = {
	filters: Filters;
	dialog: Dialog | null;
	setSearch: (v: string) => void;
	setStatus: (v?: string) => void;
	setGradeGroup: (v?: string) => void;
	setPage: (v: number) => void;
	setLimit: (v: number) => void;
	resetFilters: () => void;
	openCreate: () => void;
	openEdit: (s: Student) => void;
	openDelete: (s: Student) => void;
	openAssignParents: (s: Student) => void;
	openAssignTeacher: (s: Student) => void;
	closeDialog: () => void;
};

const def: Filters = { page: 1, limit: 20, search: "" };

export const useStudentsUiStore = create<StudentsUiState>((set) => ({
	filters: def,
	dialog: null,
	setSearch: (search) => set((s) => ({ filters: { ...s.filters, search, page: 1 } })),
	setStatus: (status_id) => set((s) => ({ filters: { ...s.filters, status_id, page: 1 } })),
	setGradeGroup: (grade_group_id) =>
		set((s) => ({ filters: { ...s.filters, grade_group_id, page: 1 } })),
	setPage: (page) => set((s) => ({ filters: { ...s.filters, page } })),
	setLimit: (limit) => set((s) => ({ filters: { ...s.filters, limit, page: 1 } })),
	resetFilters: () => set({ filters: def }),
	openCreate: () => set({ dialog: { kind: "create" } }),
	openEdit: (student) => set({ dialog: { kind: "edit", student } }),
	openDelete: (student) => set({ dialog: { kind: "delete", student } }),
	openAssignParents: (student) => set({ dialog: { kind: "assign-parents", student } }),
	openAssignTeacher: (student) => set({ dialog: { kind: "assign-teacher", student } }),
	closeDialog: () => set({ dialog: null }),
}));
