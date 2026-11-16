import { api, unwrap } from "@/lib/api";

export type StudentParent = {
	id: string;
	student_id: string;
	parent_id: string;
	relationship: string;
	is_primary: boolean;
	parent_full_name: string;
	parent_email: string;
	parent_phone: string;
};

export type AssignParentPayload = {
	parent_id: string;
	relationship: string;
	is_primary?: boolean;
};

export const studentParentsService = {
	list: (student_id: string) =>
		api.get<{ data: StudentParent[] }>(`/students/${student_id}/parents`).then(unwrap),

	assign: (student_id: string, payload: AssignParentPayload) =>
		api.post<{ data: StudentParent }>(`/students/${student_id}/parents`, payload).then(unwrap),

	update: (student_id: string, id: string, payload: Partial<AssignParentPayload>) =>
		api.put<{ data: StudentParent }>(`/students/${student_id}/parents/${id}`, payload).then(unwrap),

	remove: (student_id: string, id: string) => api.delete(`/students/${student_id}/parents/${id}`),
};
