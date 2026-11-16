export type User = {
	id: string;
	name: string;
	email: string;
	role_id: string;
	role_code: string;
	role_name: string;
	status_id: string;
	status_code: string;
	status_name: string;
	account_type: "local" | "external";
	profile_picture?: string | null;
	last_login_at?: string | null;
	created_at: string;
	updated_at: string;
};

export type CreateUserPayload = {
	name: string;
	email: string;
	password: string;
	role_id: string;
	status_id: string;
	account_type?: "local" | "external";
};

export type UpdateUserPayload = Partial<Omit<CreateUserPayload, "account_type">>;

export type PatchUserStatusPayload = {
	status_id: string;
};

export type UserPermissionOverride = {
	permission_id: string;
	effect: "allow" | "deny";
	module_code: string;
	action_code: string;
};

export type UserEffectivePermission = {
	module_code: string;
	action_code: string;
	effect: "allow" | "deny";
	origin: "role" | "override";
};

export type UserPermissionsResponse = {
	overrides: UserPermissionOverride[];
	effective: UserEffectivePermission[];
};
