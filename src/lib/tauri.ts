// Tauri runtime detection + token storage abstraction
// Browser: usa cookies httpOnly del backend (no tokens en JS)
// Tauri: usa Authorization header + storage local (idealmente plugin-stronghold)

declare global {
	interface Window {
		__TAURI_INTERNALS__?: unknown;
	}
}

export const isTauri = (): boolean =>
	typeof window !== "undefined" && Boolean(window.__TAURI_INTERNALS__);

const ACCESS_KEY = "kinder.access_token";
const REFRESH_KEY = "kinder.refresh_token";

// TODO Tauri prod: reemplazar con @tauri-apps/plugin-stronghold (keyring OS)
const storage = {
	get: (key: string) => (typeof window === "undefined" ? null : window.localStorage.getItem(key)),
	set: (key: string, value: string) => window.localStorage.setItem(key, value),
	remove: (key: string) => window.localStorage.removeItem(key),
};

export const tokenStore = {
	getAccess: () => storage.get(ACCESS_KEY),
	getRefresh: () => storage.get(REFRESH_KEY),
	set: (access: string, refresh: string) => {
		storage.set(ACCESS_KEY, access);
		storage.set(REFRESH_KEY, refresh);
	},
	clear: () => {
		storage.remove(ACCESS_KEY);
		storage.remove(REFRESH_KEY);
	},
};
