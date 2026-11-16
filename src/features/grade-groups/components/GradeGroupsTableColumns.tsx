import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useGradeGroupsUiStore } from "@/features/grade-groups/stores/gradeGroupsUi.store";
import { usePermission } from "@/hooks/usePermission";
import type { GradeGroup } from "@/types/catalog.types";

const RowActions = ({ gradeGroup }: { gradeGroup: GradeGroup }) => {
	const openEdit = useGradeGroupsUiStore((s) => s.openEdit);
	const openDelete = useGradeGroupsUiStore((s) => s.openDelete);
	const canUpdate = usePermission("grade_groups", "update");
	const canDelete = usePermission("grade_groups", "delete");
	if (!canUpdate && !canDelete) return null;
	return (
		<div className="flex gap-1">
			{canUpdate && (
				<Button size="icon" variant="ghost" onClick={() => openEdit(gradeGroup)}>
					<Pencil className="h-4 w-4" />
				</Button>
			)}
			{canDelete && (
				<Button
					size="icon"
					variant="ghost"
					className="text-destructive hover:text-destructive"
					onClick={() => openDelete(gradeGroup)}
				>
					<Trash2 className="h-4 w-4" />
				</Button>
			)}
		</div>
	);
};

export const gradeGroupsColumns: ColumnDef<GradeGroup>[] = [
	{ accessorKey: "grade_name", header: "Grado" },
	{ accessorKey: "group_name", header: "Grupo" },
	{ accessorKey: "label", header: "Etiqueta" },
	{
		id: "actions",
		header: "",
		cell: ({ row }) => <RowActions gradeGroup={row.original} />,
	},
];
