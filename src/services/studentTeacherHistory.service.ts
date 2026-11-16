import { api, unwrap } from "@/lib/api";

export type TeacherHistoryEntry = {
	id: string;
	student_id: string;
	teacher_id: string;
	grade_group_id: string;
	start_date: string;
	end_date: string | null;
	teacher_full_name: string;
	grade_group_label: string;
};

export type AssignTeacherPayload = {
	teacher_id: string;
	grade_group_id: string;
	start_date: string;
};

export const studentTeacherHistoryService = {
	list: (student_id: string) =>
		api
			.get<{ data: TeacherHistoryEntry[] }>(`/students/${student_id}/teacher-history`)
			.then(unwrap),

	assign: (student_id: string, payload: AssignTeacherPayload) =>
		api
			.post<{ data: TeacherHistoryEntry }>(`/students/${student_id}/teacher-history`, payload)
			.then(unwrap),

	close: (student_id: string, end_date: string) =>
		api.patch(`/students/${student_id}/teacher-history/close`, { end_date }),
};
