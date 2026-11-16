import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTeachersUiStore } from "@/features/teachers/stores/teachersUi.store";
import { usePermission } from "@/hooks/usePermission";
import type { Teacher } from "@/types/people.types";

const RowActions = ({ teacher }: { teacher: Teacher }) => {
	const openEdit = useTeachersUiStore((s) => s.openEdit);
	const openDelete = useTeachersUiStore((s) => s.openDelete);
	const canUpdate = usePermission("teachers", "update");
	const canDelete = usePermission("teachers", "delete");
	if (!canUpdate && !canDelete) return null;
	return (
		<div className="flex gap-1">
			{canUpdate && (
				<Button size="icon" variant="ghost" onClick={() => openEdit(teacher)}>
					<Pencil className="h-4 w-4" />
				</Button>
			)}
			{canDelete && (
				<Button
					size="icon"
					variant="ghost"
					className="text-destructive hover:text-destructive"
					onClick={() => openDelete(teacher)}
				>
					<Trash2 className="h-4 w-4" />
				</Button>
			)}
		</div>
	);
};

export const teachersColumns: ColumnDef<Teacher>[] = [
	{ accessorKey: "full_name", header: "Nombre completo" },
	{ accessorKey: "email", header: "Email" },
	{ accessorKey: "phone", header: "Teléfono" },
	{ accessorKey: "work_shift_name", header: "Turno" },
	{
		accessorKey: "status_name",
		header: "Estado",
		cell: ({ row }) => (
			<Badge variant={row.original.status_code === "active" ? "default" : "secondary"}>
				{row.original.status_name}
			</Badge>
		),
	},
	{ id: "actions", header: "", cell: ({ row }) => <RowActions teacher={row.original} /> },
];
