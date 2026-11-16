import { api, unwrap } from "@/lib/api";
import type {
	AuthUser,
	ChangePasswordPayload,
	LoginPayload,
	LoginResponse,
} from "@/types/auth.types";

export const authService = {
	login: (payload: LoginPayload) =>
		api.post<{ data: LoginResponse }>("/auth/login", payload).then(unwrap),

	refresh: () => api.post<{ data: LoginResponse }>("/auth/refresh").then(unwrap),

	logout: () => api.post("/auth/logout"),

	logoutAll: () => api.post("/auth/logout-all"),

	changePassword: (payload: ChangePasswordPayload) => api.post("/auth/change-password", payload),

	me: () => api.get<{ data: AuthUser }>("/auth/me").then(unwrap),

	updateMe: (name: string) => api.put<{ data: AuthUser }>("/auth/me", { name }).then(unwrap),
};
