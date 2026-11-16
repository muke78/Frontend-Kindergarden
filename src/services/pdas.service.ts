import { api, unwrap } from "@/lib/api";

// ---- Types ----
export type PdaCategory = {
	id: string;
	code: string;
	name: string;
	description: string | null;
	color: string;
	sort_order: number;
};

export type PdaItem = {
	id: string;
	category_id: string;
	grade_name: string;
	description: string;
	sort_order: number;
	is_active: boolean;
	category_name: string;
	category_color: string;
};

export type PdaEvaluation = {
	id: string;
	student_id: string;
	pda_item_id: string;
	teacher_id: string;
	grade_group_id: string;
	school_year: string;
	period: 1 | 2 | 3;
	level: "logrado" | "en_proceso" | "no_logrado";
	notes: string | null;
	evaluated_at: string;
	pda_description: string;
	category_name: string;
	category_color: string;
	teacher_full_name: string;
	grade_group_label: string;
};

export type UpsertEvalPayload = {
	student_id: string;
	pda_item_id: string;
	teacher_id: string;
	grade_group_id: string;
	school_year: string;
	period: 1 | 2 | 3;
	level: "logrado" | "en_proceso" | "no_logrado";
	notes?: string;
	evaluated_at?: string;
};

// ---- Categories ----
export const pdaCategoriesService = {
	list: (params?: { search?: string }) =>
		api.get<{ data: PdaCategory[] }>("/pda-categories", { params }).then(unwrap),
	create: (payload: Partial<PdaCategory>) =>
		api.post<{ data: PdaCategory }>("/pda-categories", payload).then(unwrap),
	update: (id: string, payload: Partial<PdaCategory>) =>
		api.put<{ data: PdaCategory }>(`/pda-categories/${id}`, payload).then(unwrap),
	remove: (id: string) => api.delete(`/pda-categories/${id}`),
};

// ---- Items ----
export const pdaItemsService = {
	list: (params?: { category_id?: string; grade_name?: string; is_active?: boolean }) =>
		api.get<{ data: PdaItem[] }>("/pda-items", { params }).then(unwrap),
	create: (payload: Omit<PdaItem, "id" | "category_name" | "category_color">) =>
		api.post<{ data: PdaItem }>("/pda-items", payload).then(unwrap),
	update: (id: string, payload: Partial<PdaItem>) =>
		api.put<{ data: PdaItem }>(`/pda-items/${id}`, payload).then(unwrap),
	remove: (id: string) => api.delete(`/pda-items/${id}`),
};

// ---- Evaluations ----
export const pdaEvaluationsService = {
	list: (params: { student_id: string; school_year?: string; period?: number }) =>
		api.get<{ data: PdaEvaluation[] }>("/pda-evaluations", { params }).then(unwrap),
	upsert: (payload: UpsertEvalPayload) =>
		api.post<{ data: PdaEvaluation }>("/pda-evaluations", payload).then(unwrap),
	remove: (id: string) => api.delete(`/pda-evaluations/${id}`),
};
