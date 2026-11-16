import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

import { DataTable } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { type AuditLog, auditLogsService } from "@/services/auditLogs.service";

const ALL = "__all__";

const ACTIONS = [
	{ code: "create", label: "Crear" },
	{ code: "update", label: "Actualizar" },
	{ code: "patch", label: "Modificar" },
	{ code: "delete", label: "Eliminar" },
	{ code: "read", label: "Leer" },
];

const actionVariant = (code: string | null) => {
	if (code === "delete") return "destructive" as const;
	if (code === "create") return "default" as const;
	return "secondary" as const;
};

const statusColor = (code: number | null) => {
	if (!code) return "text-muted-foreground";
	if (code >= 500) return "text-destructive";
	if (code >= 400) return "text-amber-600 dark:text-amber-400";
	return "text-emerald-600 dark:text-emerald-400";
};

const columns: ColumnDef<AuditLog>[] = [
	{
		accessorKey: "created_at",
		header: "Fecha",
		cell: ({ row }) => (
			<span className="whitespace-nowrap text-xs tabular-nums text-muted-foreground">
				{new Date(row.original.created_at).toLocaleString("es-MX")}
			</span>
		),
	},
	{
		accessorKey: "user_name",
		header: "Usuario",
		cell: ({ row }) => row.original.user_name ?? "—",
	},
	{
		accessorKey: "module_code",
		header: "Módulo",
		cell: ({ row }) => <span className="font-mono text-xs">{row.original.module_code ?? "—"}</span>,
	},
	{
		accessorKey: "action_code",
		header: "Acción",
		cell: ({ row }) => (
			<Badge variant={actionVariant(row.original.action_code)}>
				{row.original.action_code ?? "—"}
			</Badge>
		),
	},
	{
		accessorKey: "status_code",
		header: "Estado",
		cell: ({ row }) => (
			<span className={`font-mono text-xs font-medium ${statusColor(row.original.status_code)}`}>
				{row.original.http_method} {row.original.status_code}
			</span>
		),
	},
	{
		accessorKey: "path",
		header: "Ruta",
		cell: ({ row }) => (
			<span className="font-mono text-xs text-muted-foreground">{row.original.path}</span>
		),
	},
];

export const AuditLogsPage = () => {
	const [action, setAction] = useState<string>(ALL);
	const [page, setPage] = useState(1);

	const listQ = useQuery({
		queryKey: ["audit-logs", { action, page }],
		queryFn: () =>
			auditLogsService.list({
				limit: 30,
				page,
				action_code: action === ALL ? undefined : action,
			}),
		placeholderData: keepPreviousData,
	});

	return (
		<div className="space-y-6">
			<PageHeader title="Auditoría" description="Bitácora de acciones del sistema" />

			<Select
				value={action}
				onValueChange={(v) => {
					setAction(v);
					setPage(1);
				}}
			>
				<SelectTrigger className="w-44">
					<SelectValue placeholder="Todas las acciones" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value={ALL}>Todas las acciones</SelectItem>
					{ACTIONS.map((a) => (
						<SelectItem key={a.code} value={a.code}>
							{a.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			<DataTable columns={columns} data={listQ.data?.rows ?? []} isLoading={listQ.isLoading} />
		</div>
	);
};
