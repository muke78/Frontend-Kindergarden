import { api, unwrap } from "@/lib/api";
import type { Paginated, PaginationQuery } from "@/types/api.types";

export type AuditLog = {
	id: string;
	user_id: string | null;
	user_name: string | null;
	user_email: string | null;
	module_code: string | null;
	action_code: string | null;
	entity_id: string | null;
	http_method: string | null;
	path: string | null;
	status_code: number | null;
	ip: string | null;
	created_at: string;
};

export type ListAuditLogsQuery = PaginationQuery & {
	module_code?: string;
	action_code?: string;
};

export const auditLogsService = {
	list: (params: ListAuditLogsQuery) =>
		api.get<{ data: Paginated<AuditLog> }>("/audit-logs", { params }).then(unwrap),
};
