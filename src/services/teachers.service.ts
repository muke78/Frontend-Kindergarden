import { api, unwrap } from "@/lib/api";
import type { Paginated, PaginationQuery } from "@/types/api.types";
import type { CreateTeacherPayload, Teacher, UpdateTeacherPayload } from "@/types/people.types";

export type ListTeachersQuery = PaginationQuery & {
	gender_id?: string;
	education_level_id?: string;
	work_shift_id?: string;
	status_id?: string;
};

export const teachersService = {
	list: (params: ListTeachersQuery) =>
		api.get<{ data: Paginated<Teacher> }>("/teachers", { params }).then(unwrap),

	get: (id: string) => api.get<{ data: Teacher }>(`/teachers/${id}`).then(unwrap),

	create: (payload: CreateTeacherPayload) =>
		api.post<{ data: Teacher }>("/teachers", payload).then(unwrap),

	update: (id: string, payload: UpdateTeacherPayload) =>
		api.put<{ data: Teacher }>(`/teachers/${id}`, payload).then(unwrap),

	remove: (id: string) => api.delete(`/teachers/${id}`),
};
