import { api, unwrap } from "@/lib/api";
import type { Action, Module, Permission, PermissionMatrix } from "@/types/rbac.types";

export const permissionsService = {
	list: () => api.get<{ data: Permission[] }>("/permissions").then(unwrap),
	modules: () => api.get<{ data: Module[] }>("/permissions/modules").then(unwrap),
	actions: () => api.get<{ data: Action[] }>("/permissions/actions").then(unwrap),
	matrix: () => api.get<{ data: PermissionMatrix }>("/permissions/matrix").then(unwrap),
};
