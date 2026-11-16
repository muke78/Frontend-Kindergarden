import { api, unwrap } from "@/lib/api";
import type { Paginated, PaginationQuery } from "@/types/api.types";
import type { GradeGroup } from "@/types/catalog.types";

export type CreateGradeGroupPayload = { grade_name: string; group_name: string };
export type UpdateGradeGroupPayload = Partial<CreateGradeGroupPayload>;

export const gradeGroupsService = {
	list: (params?: PaginationQuery) =>
		api.get<{ data: Paginated<GradeGroup> }>("/grade-groups", { params }).then(unwrap),

	get: (id: string) => api.get<{ data: GradeGroup }>(`/grade-groups/${id}`).then(unwrap),

	create: (payload: CreateGradeGroupPayload) =>
		api.post<{ data: GradeGroup }>("/grade-groups", payload).then(unwrap),

	update: (id: string, payload: UpdateGradeGroupPayload) =>
		api.put<{ data: GradeGroup }>(`/grade-groups/${id}`, payload).then(unwrap),

	remove: (id: string) => api.delete(`/grade-groups/${id}`),
};
