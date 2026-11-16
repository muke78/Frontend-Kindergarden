import { useQuery } from "@tanstack/react-query";

import { api, unwrap } from "@/lib/api";
import { useAuthStore } from "@/stores/auth.store";
import type { UserEffectivePermission } from "@/types/user.types";

const fetchMyPermissions = (userId: string) =>
	api
		.get<{ data: { effective: UserEffectivePermission[] } }>(`/users/${userId}/permissions`)
		.then(unwrap)
		.then((d) => d.effective);

export const useMyPermissions = () => {
	const user = useAuthStore((s) => s.user);
	return useQuery({
		queryKey: ["me", "permissions", user?.id],
		queryFn: () => fetchMyPermissions(user!.id),
		enabled: Boolean(user) && user?.role_code !== "super_admin",
		staleTime: 5 * 60_000,
	});
};

export const usePermission = (moduleCode: string, actionCode: string): boolean => {
	const user = useAuthStore((s) => s.user);
	const { data: permissions } = useMyPermissions();

	if (user?.role_code === "super_admin") return true;
	if (!permissions) return false;

	const denied = permissions.some(
		(p) => p.module_code === moduleCode && p.action_code === actionCode && p.effect === "deny",
	);
	if (denied) return false;

	return permissions.some(
		(p) => p.module_code === moduleCode && p.action_code === actionCode && p.effect === "allow",
	);
};
