import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useParentsUiStore } from "@/features/parents/stores/parentsUi.store";
import { usePermission } from "@/hooks/usePermission";
import type { Parent } from "@/types/people.types";

const RowActions = ({ parent }: { parent: Parent }) => {
	const openEdit = useParentsUiStore((s) => s.openEdit);
	const openDelete = useParentsUiStore((s) => s.openDelete);
	const canUpdate = usePermission("parents", "update");
	const canDelete = usePermission("parents", "delete");
	if (!canUpdate && !canDelete) return null;
	return (
		<div className="flex gap-1">
			{canUpdate && (
				<Button size="icon" variant="ghost" onClick={() => openEdit(parent)}>
					<Pencil className="h-4 w-4" />
				</Button>
			)}
			{canDelete && (
				<Button
					size="icon"
					variant="ghost"
					className="text-destructive hover:text-destructive"
					onClick={() => openDelete(parent)}
				>
					<Trash2 className="h-4 w-4" />
				</Button>
			)}
		</div>
	);
};

export const parentsColumns: ColumnDef<Parent>[] = [
	{ accessorKey: "full_name", header: "Nombre completo" },
	{ accessorKey: "email", header: "Email" },
	{ accessorKey: "phone", header: "Teléfono" },
	{
		accessorKey: "occupation",
		header: "Ocupación",
		cell: ({ row }) => row.original.occupation ?? "—",
	},
	{
		accessorKey: "status_name",
		header: "Estado",
		cell: ({ row }) => (
			<Badge variant={row.original.status_code === "active" ? "default" : "secondary"}>
				{row.original.status_name}
			</Badge>
		),
	},
	{ id: "actions", header: "", cell: ({ row }) => <RowActions parent={row.original} /> },
];
