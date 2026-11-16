export type Role = {
	id: string;
	code: string;
	name: string;
	description?: string | null;
	is_system: 0 | 1;
	created_at: string;
	updated_at: string;
};

export type Module = {
	id: string;
	code: string;
	name: string;
	description?: string | null;
};

export type Action = {
	id: string;
	code: "read" | "create" | "update" | "patch" | "delete";
	name: string;
};

export type Permission = {
	id: string;
	module_id: string;
	action_id: string;
	module_code: string;
	module_name: string;
	action_code: Action["code"];
	action_name: string;
};

export type PermissionMatrix = {
	modules: Module[];
	actions: Action[];
	permissions: Permission[];
};
