import { api, unwrap } from "@/lib/api";
import type { Paginated, PaginationQuery } from "@/types/api.types";
import type { Classroom } from "@/types/catalog.types";
import type { CreateClassroomPayload, UpdateClassroomPayload } from "@/types/people.types";

export type ListClassroomsQuery = PaginationQuery & {
	room_type_id?: string;
};

export const classroomsService = {
	list: (params?: ListClassroomsQuery) =>
		api.get<{ data: Paginated<Classroom> }>("/classrooms", { params }).then(unwrap),

	get: (id: string) => api.get<{ data: Classroom }>(`/classrooms/${id}`).then(unwrap),

	create: (payload: CreateClassroomPayload) =>
		api.post<{ data: Classroom }>("/classrooms", payload).then(unwrap),

	update: (id: string, payload: UpdateClassroomPayload) =>
		api.put<{ data: Classroom }>(`/classrooms/${id}`, payload).then(unwrap),

	remove: (id: string) => api.delete(`/classrooms/${id}`),
};
