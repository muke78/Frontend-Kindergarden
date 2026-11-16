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
import { useUsersUiStore } from "@/features/users/stores/usersUi.store";
import { usePermission } from "@/hooks/usePermission";
import type { User } from "@/types/user.types";

const StatusBadge = ({ code, name }: { code: string; name: string }) => {
	const variant: "default" | "secondary" | "destructive" =
		code === "active" ? "default" : code === "blocked" ? "destructive" : "secondary";
	return <Badge variant={variant}>{name}</Badge>;
};

const RowActions = ({ user }: { user: User }) => {
	const openEdit = useUsersUiStore((s) => s.openEdit);
	const openDelete = useUsersUiStore((s) => s.openDelete);
	const openPermissions = useUsersUiStore((s) => s.openPermissions);
	const canUpdate = usePermission("users", "update");
	const canDelete = usePermission("users", "delete");
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
				{canUpdate && (
					<DropdownMenuItem onClick={() => openEdit(user)}>
						<Pencil className="mr-2 h-4 w-4" /> Editar
					</DropdownMenuItem>
				)}
				{canManagePerms && (
					<DropdownMenuItem onClick={() => openPermissions(user)}>
						<ShieldCheck className="mr-2 h-4 w-4" /> Permisos
					</DropdownMenuItem>
				)}
				{canDelete && (
					<>
						{(canUpdate || canManagePerms) && <DropdownMenuSeparator />}
						<DropdownMenuItem
							className="text-destructive focus:text-destructive"
							onClick={() => openDelete(user)}
						>
							<Trash2 className="mr-2 h-4 w-4" /> Eliminar
						</DropdownMenuItem>
					</>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export const usersColumns: ColumnDef<User>[] = [
	{ accessorKey: "name", header: "Nombre" },
	{ accessorKey: "email", header: "Email" },
	{
		accessorKey: "role_name",
		header: "Rol",
		cell: ({ row }) => <Badge variant="outline">{row.original.role_name}</Badge>,
	},
	{
		accessorKey: "status_name",
		header: "Estado",
		cell: ({ row }) => (
			<StatusBadge code={row.original.status_code} name={row.original.status_name} />
		),
	},
	{
		accessorKey: "last_login_at",
		header: "Último login",
		cell: ({ row }) =>
			row.original.last_login_at ? new Date(row.original.last_login_at).toLocaleString() : "—",
	},
	{
		id: "actions",
		header: "",
		cell: ({ row }) => (
			<div className="flex justify-end">
				<RowActions user={row.original} />
			</div>
		),
	},
];
