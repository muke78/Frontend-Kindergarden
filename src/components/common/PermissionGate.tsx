import type { ReactNode } from "react";

import { usePermission } from "@/hooks/usePermission";

type Props = {
	module: string;
	action: "read" | "create" | "update" | "patch" | "delete";
	fallback?: ReactNode;
	children: ReactNode;
};

export const PermissionGate = ({ module, action, fallback = null, children }: Props) => {
	const allowed = usePermission(module, action);
	if (!allowed) return <>{fallback}</>;
	return <>{children}</>;
};
