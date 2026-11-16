import { api, unwrap } from "@/lib/api";
import type { Paginated, PaginationQuery } from "@/types/api.types";
import type {
	CreateUserPayload,
	PatchUserStatusPayload,
	UpdateUserPayload,
	User,
	UserPermissionsResponse,
} from "@/types/user.types";

export type ListUsersQuery = PaginationQuery & {
	role_id?: string;
	status_id?: string;
	account_type?: "local" | "external";
};

export const usersService = {
	list: (params: ListUsersQuery) =>
		api.get<{ data: Paginated<User> }>("/users", { params }).then(unwrap),

	get: (id: string) => api.get<{ data: User }>(`/users/${id}`).then(unwrap),

	create: (payload: CreateUserPayload) => api.post<{ data: User }>("/users", payload).then(unwrap),

	update: (id: string, payload: UpdateUserPayload) =>
		api.put<{ data: User }>(`/users/${id}`, payload).then(unwrap),

	patchStatus: (id: string, payload: PatchUserStatusPayload) =>
		api.patch<{ data: User }>(`/users/${id}`, payload).then(unwrap),

	remove: (id: string) => api.delete(`/users/${id}`),

	bulkRemove: (ids: string[]) => api.delete("/users/bulk", { data: { ids } }),

	getPermissions: (id: string) =>
		api.get<{ data: UserPermissionsResponse }>(`/users/${id}/permissions`).then(unwrap),

	replacePermissions: (
		id: string,
		permissions: Array<{ permission_id: string; effect: "allow" | "deny" }>,
	) => api.put(`/users/${id}/permissions`, { permissions }),
};
