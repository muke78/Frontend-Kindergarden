import { create } from "zustand";

import type { PdaCategory, PdaItem } from "@/services/pdas.service";

type Dialog =
	| { kind: "create-category" }
	| { kind: "edit-category"; category: PdaCategory }
	| { kind: "create-item"; categoryId: string }
	| { kind: "edit-item"; item: PdaItem }
	| { kind: "delete-category"; category: PdaCategory }
	| { kind: "delete-item"; item: PdaItem };

type State = {
	dialog: Dialog | null;
	openCreateCategory: () => void;
	openEditCategory: (c: PdaCategory) => void;
	openDeleteCategory: (c: PdaCategory) => void;
	openCreateItem: (categoryId: string) => void;
	openEditItem: (item: PdaItem) => void;
	openDeleteItem: (item: PdaItem) => void;
	closeDialog: () => void;
};

export const usePdasUiStore = create<State>((set) => ({
	dialog: null,
	openCreateCategory: () => set({ dialog: { kind: "create-category" } }),
	openEditCategory: (category) => set({ dialog: { kind: "edit-category", category } }),
	openDeleteCategory: (category) => set({ dialog: { kind: "delete-category", category } }),
	openCreateItem: (categoryId) => set({ dialog: { kind: "create-item", categoryId } }),
	openEditItem: (item) => set({ dialog: { kind: "edit-item", item } }),
	openDeleteItem: (item) => set({ dialog: { kind: "delete-item", item } }),
	closeDialog: () => set({ dialog: null }),
}));
