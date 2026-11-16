import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { isTauri, tokenStore } from "@/lib/tauri";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";
import type { LoginPayload } from "@/types/auth.types";

export const useAuth = () => {
	const user = useAuthStore((s) => s.user);
	const setUser = useAuthStore((s) => s.setUser);
	const reset = useAuthStore((s) => s.reset);
	const isHydrated = useAuthStore((s) => s.isHydrated);
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const meQuery = useQuery({
		queryKey: ["auth", "me"],
		queryFn: authService.me,
		enabled: isHydrated && Boolean(user),
		retry: false,
	});

	useEffect(() => {
		if (meQuery.data) setUser(meQuery.data);
	}, [meQuery.data, setUser]);

	useEffect(() => {
		const onLogout = () => {
			reset();
			queryClient.clear();
			navigate("/login", { replace: true });
		};
		window.addEventListener("auth:logout", onLogout);
		return () => window.removeEventListener("auth:logout", onLogout);
	}, [reset, queryClient, navigate]);

	const loginMutation = useMutation({
		mutationFn: (payload: LoginPayload) => authService.login(payload),
		onSuccess: (data) => {
			if (isTauri() && data.access_token && data.refresh_token) {
				tokenStore.set(data.access_token, data.refresh_token);
			}
			setUser(data.user);
			toast.success("Sesión iniciada");
			navigate("/", { replace: true });
		},
		onError: (error: { response?: { data?: { message?: string } } }) => {
			toast.error(error.response?.data?.message ?? "Error al iniciar sesión");
		},
	});

	const logoutMutation = useMutation({
		mutationFn: authService.logout,
		onSettled: () => {
			tokenStore.clear();
			reset();
			queryClient.clear();
			navigate("/login", { replace: true });
		},
	});

	return {
		user,
		isAuthenticated: Boolean(user),
		isHydrated,
		login: loginMutation.mutate,
		isLoggingIn: loginMutation.isPending,
		logout: logoutMutation.mutate,
		isLoggingOut: logoutMutation.isPending,
	};
};
