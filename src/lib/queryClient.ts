import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 30_000,
			gcTime: 5 * 60_000,
			retry: (failureCount, error) => {
				const status = (error as { response?: { status?: number } })?.response?.status;
				if (status && status >= 400 && status < 500) return false;
				return failureCount < 2;
			},
			refetchOnWindowFocus: false,
		},
		mutations: {
			retry: false,
		},
	},
});
