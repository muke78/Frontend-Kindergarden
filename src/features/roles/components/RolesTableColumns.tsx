import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, ShieldCheck, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRolesUiStore } from "@/features/roles/stores/rolesUi.store";
import { usePermission } from "@/hooks/usePermission";
import type { Role } from "@/types/rbac.types";

const RowActions = ({ role }: { role: Role }) => {
	const openEdit = useRolesUiStore((s) => s.openEdit);
	const openDelete = useRolesUiStore((s) => s.openDelete);
	const openPermissions = useRolesUiStore((s) => s.openPermissions);
	const canUpdate = usePermission("roles", "update");
	const canDelete = usePermission("roles", "delete");
	const canManagePerms = usePermission("permissions", "update");

	if (!canUpdate && !canDelete && !canManagePerms) return null;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon">
					<MoreHorizontal className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{canManagePerms && (
					<DropdownMenuItem onClick={() => openPermissions(role)}>
						<ShieldCheck className="mr-2 h-4 w-4" /> Permisos
					</DropdownMenuItem>
				)}
				{!role.is_system && canUpdate && (
					<DropdownMenuItem onClick={() => openEdit(role)}>
						<Pencil className="mr-2 h-4 w-4" /> Editar
					</DropdownMenuItem>
				)}
				{!role.is_system && canDelete && (
					<>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							className="text-destructive focus:text-destructive"
							onClick={() => openDelete(role)}
						>
							<Trash2 className="mr-2 h-4 w-4" /> Eliminar
						</DropdownMenuItem>
					</>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export const rolesColumns: ColumnDef<Role>[] = [
	{
		accessorKey: "code",
		header: "Código",
		cell: ({ row }) => (
			<code className="text-xs bg-muted px-1.5 py-0.5 rounded">{row.original.code}</code>
		),
	},
	{ accessorKey: "name", header: "Nombre" },
	{
		accessorKey: "description",
		header: "Descripción",
		cell: ({ row }) => row.original.description ?? "—",
	},
	{
		accessorKey: "is_system",
		header: "Sistema",
		cell: ({ row }) => (row.original.is_system ? <Badge variant="secondary">Sistema</Badge> : null),
	},
	{
		id: "actions",
		header: "",
		cell: ({ row }) => (
			<div className="flex justify-end">
				<RowActions role={row.original} />
			</div>
		),
	},
];
