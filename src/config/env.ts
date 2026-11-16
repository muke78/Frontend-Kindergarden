const required = (key: string, value: string | undefined): string => {
	if (!value) throw new Error(`Missing required env var: ${key}`);
	return value;
};

export const env = {
	apiUrl: required("VITE_API_URL", import.meta.env.VITE_API_URL),
	appName: import.meta.env.VITE_APP_NAME ?? "Kinder Management",
	isDev: import.meta.env.DEV,
	isProd: import.meta.env.PROD,
};
