import { Navigate, Outlet } from "react-router";

import { useAuth } from "@/hooks/useAuth";

export const PublicOnlyRoute = () => {
	const { isAuthenticated, isHydrated } = useAuth();
	if (!isHydrated) return null;
	if (isAuthenticated) return <Navigate to="/" replace />;
	return <Outlet />;
};
