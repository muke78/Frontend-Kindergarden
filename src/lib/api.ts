import axios, {
	type AxiosInstance,
	type AxiosResponse,
	type InternalAxiosRequestConfig,
} from "axios";

import { env } from "@/config/env";
import { isTauri, tokenStore } from "@/lib/tauri";

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

export const api: AxiosInstance = axios.create({
	baseURL: env.apiUrl,
	withCredentials: true,
	timeout: 30_000,
	headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
	if (isTauri()) {
		config.headers.set("X-Client-Type", "tauri");
		const access = tokenStore.getAccess();
		if (access) config.headers.set("Authorization", `Bearer ${access}`);
	}
	return config;
});

// Refresh queue: single-flight refresh. Si varios requests fallan 401, refrescamos UNA vez.
let refreshing: Promise<string | null> | null = null;

const callRefresh = async (): Promise<string | null> => {
	try {
		const body = isTauri() ? { refresh_token: tokenStore.getRefresh() } : {};
		const { data } = await axios.post<{ data?: { access_token?: string; refresh_token?: string } }>(
			`${env.apiUrl}/auth/refresh`,
			body,
			{
				withCredentials: true,
				headers: isTauri() ? { "X-Client-Type": "tauri" } : undefined,
			},
		);
		if (isTauri() && data.data?.access_token && data.data?.refresh_token) {
			tokenStore.set(data.data.access_token, data.data.refresh_token);
			return data.data.access_token;
		}
		return "browser_cookie";
	} catch {
		tokenStore.clear();
		return null;
	}
};

api.interceptors.response.use(
	(response: AxiosResponse) => response,
	async (error) => {
		const original = error.config as RetryConfig | undefined;
		const status = error.response?.status;

		if (!original || status !== 401 || original._retry || original.url?.includes("/auth/")) {
			return Promise.reject(error);
		}
		original._retry = true;

		if (!refreshing) {
			refreshing = callRefresh().finally(() => {
				refreshing = null;
			});
		}
		const newToken = await refreshing;

		if (!newToken) {
			window.dispatchEvent(new CustomEvent("auth:logout"));
			return Promise.reject(error);
		}

		if (isTauri()) original.headers.set("Authorization", `Bearer ${newToken}`);
		return api(original);
	},
);

// Helper para extraer .data del wrapper estándar { success, data }
export const unwrap = <T>(response: AxiosResponse<{ data: T }>): T => response.data.data;
