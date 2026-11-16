import { api, unwrap } from "@/lib/api";
import type { Paginated, PaginationQuery } from "@/types/api.types";
import type {
	CreateParentPayload,
	CreateParentWithChildrenPayload,
	Parent,
	UpdateParentPayload,
} from "@/types/people.types";

export type ListParentsQuery = PaginationQuery & {
	gender_id?: string;
	education_level_id?: string;
	status_id?: string;
};

export type ParentSummary = Pick<
	Parent,
	"id" | "full_name" | "phone" | "state" | "suburb" | "street"
>;

export type FamilyBoardRow = {
	parent_id: string;
	parent_full_name: string;
	parent_phone: string;
	occupation: string | null;
	relation_id: string | null;
	relationship: string | null;
	is_primary: 0 | 1 | null;
	student_id: string | null;
	student_full_name: string | null;
	grade_group_id: string | null;
	grade_group_label: string | null;
	teacher_id: string | null;
	teacher_full_name: string | null;
};

export const parentsService = {
	list: (params: ListParentsQuery) =>
		api.get<{ data: Paginated<Parent> }>("/parents", { params }).then(unwrap),

	all: () => api.get<{ data: ParentSummary[] }>("/parents/all").then(unwrap),

	get: (id: string) => api.get<{ data: Parent }>(`/parents/${id}`).then(unwrap),

	create: (payload: CreateParentPayload) =>
		api.post<{ data: Parent }>("/parents", payload).then(unwrap),

	update: (id: string, payload: UpdateParentPayload) =>
		api.put<{ data: Parent }>(`/parents/${id}`, payload).then(unwrap),

	remove: (id: string) => api.delete(`/parents/${id}`),

	familyBoard: () => api.get<{ data: FamilyBoardRow[] }>("/parents/family-board").then(unwrap),

	createWithChildren: (payload: CreateParentWithChildrenPayload) =>
		api
			.post<{ data: { parent_ids: string[]; student_ids: string[] } }>(
				"/parents/with-children",
				payload,
			)
			.then(unwrap),
};
