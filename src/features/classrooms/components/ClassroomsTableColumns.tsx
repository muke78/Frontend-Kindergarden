import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useClassroomsUiStore } from "@/features/classrooms/stores/classroomsUi.store";
import { usePermission } from "@/hooks/usePermission";
import type { Classroom } from "@/types/people.types";

const RowActions = ({ classroom }: { classroom: Classroom }) => {
	const openEdit = useClassroomsUiStore((s) => s.openEdit);
	const openDelete = useClassroomsUiStore((s) => s.openDelete);
	const canUpdate = usePermission("classrooms", "update");
	const canDelete = usePermission("classrooms", "delete");
	if (!canUpdate && !canDelete) return null;
	return (
		<div className="flex gap-1">
			{canUpdate && (
				<Button size="icon" variant="ghost" onClick={() => openEdit(classroom)}>
					<Pencil className="h-4 w-4" />
				</Button>
			)}
			{canDelete && (
				<Button
					size="icon"
					variant="ghost"
					className="text-destructive hover:text-destructive"
					onClick={() => openDelete(classroom)}
				>
					<Trash2 className="h-4 w-4" />
				</Button>
			)}
		</div>
	);
};

export const classroomsColumns: ColumnDef<Classroom>[] = [
	{ accessorKey: "name", header: "Nombre" },
	{ accessorKey: "room_type_name", header: "Tipo" },
	{ accessorKey: "capacity", header: "Capacidad", cell: ({ row }) => row.original.capacity ?? "—" },
	{ id: "actions", header: "", cell: ({ row }) => <RowActions classroom={row.original} /> },
];
