import { ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router";

import { navRoutes } from "@/routes/routes";

export const Breadcrumbs = () => {
	const { pathname } = useLocation();
	const current = navRoutes.find((r) => r.path === pathname);
	const isHome = pathname === "/";

	return (
		<nav className="flex items-center gap-1 text-sm text-muted-foreground" aria-label="Breadcrumb">
			<Link to="/" className="hover:text-foreground transition-colors">
				Inicio
			</Link>
			{!isHome && current && (
				<>
					<ChevronRight className="h-3.5 w-3.5" />
					<span className="text-foreground font-medium">{current.label}</span>
				</>
			)}
		</nav>
	);
};
