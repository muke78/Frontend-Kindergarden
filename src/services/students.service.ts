import { api, unwrap } from "@/lib/api";
import type { Paginated, PaginationQuery } from "@/types/api.types";
import type { CreateStudentPayload, Student, UpdateStudentPayload } from "@/types/people.types";

export type ListStudentsQuery = PaginationQuery & {
	gender_id?: string;
	grade_group_id?: string;
	work_shift_id?: string;
	status_id?: string;
};

export type StudentsByGroup = { grupo: string; total: number };
export type StudentsByGender = { name: string; value: number };

export const studentsService = {
	list: (params: ListStudentsQuery) =>
		api.get<{ data: Paginated<Student> }>("/students", { params }).then(unwrap),

	get: (id: string) => api.get<{ data: Student }>(`/students/${id}`).then(unwrap),

	create: (payload: CreateStudentPayload) =>
		api.post<{ data: Student }>("/students", payload).then(unwrap),

	update: (id: string, payload: UpdateStudentPayload) =>
		api.put<{ data: Student }>(`/students/${id}`, payload).then(unwrap),

	remove: (id: string) => api.delete(`/students/${id}`),

	statsByGroup: () => api.get<{ data: StudentsByGroup[] }>("/students/stats/by-group").then(unwrap),

	statsByGender: () =>
		api.get<{ data: StudentsByGender[] }>("/students/stats/by-gender").then(unwrap),

	bulkAssignGroup: (payload: { student_ids: string[]; grade_group_id: string }) =>
		api
			.post<{ data: { moved: number; teacher_id: string | null } }>(
				"/students/bulk-assign",
				payload,
			)
			.then(unwrap),
};
