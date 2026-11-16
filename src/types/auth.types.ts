export type AuthUser = {
	id: string;
	name: string;
	email: string;
	role_id: string;
	role_code: string;
	status_code: string;
	profile_picture?: string | null;
	last_login_at?: string | null;
};

export type LoginPayload = {
	email: string;
	password: string;
};

export type LoginResponse = {
	user: AuthUser;
	access_token?: string;
	refresh_token?: string;
	expires_at?: string;
};

export type ChangePasswordPayload = {
	current_password: string;
	new_password: string;
};
