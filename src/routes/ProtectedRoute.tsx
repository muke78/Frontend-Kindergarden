import { Navigate, Outlet, useLocation } from "react-router";

import { useAuth } from "@/hooks/useAuth";

export const ProtectedRoute = () => {
	const { isAuthenticated, isHydrated } = useAuth();
	const location = useLocation();

	if (!isHydrated) return null;
	if (!isAuthenticated) {
		return <Navigate to="/login" replace state={{ from: location }} />;
	}
	return <Outlet />;
};
