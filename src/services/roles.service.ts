import { api, unwrap } from "@/lib/api";
import type { Paginated, PaginationQuery } from "@/types/api.types";
import type { Permission, Role } from "@/types/rbac.types";

export const rolesService = {
	list: (params: PaginationQuery) =>
		api.get<{ data: Paginated<Role> }>("/roles", { params }).then(unwrap),

	get: (id: string) => api.get<{ data: Role }>(`/roles/${id}`).then(unwrap),

	create: (payload: { code: string; name: string; description?: string }) =>
		api.post<{ data: Role }>("/roles", payload).then(unwrap),

	update: (id: string, payload: { name?: string; description?: string }) =>
		api.put<{ data: Role }>(`/roles/${id}`, payload).then(unwrap),

	remove: (id: string) => api.delete(`/roles/${id}`),

	getPermissions: (id: string) =>
		api.get<{ data: Permission[] }>(`/roles/${id}/permissions`).then(unwrap),

	replacePermissions: (id: string, permission_ids: string[]) =>
		api.put(`/roles/${id}/permissions`, { permission_ids }),
};
