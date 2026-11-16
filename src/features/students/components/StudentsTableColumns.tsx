import type { ColumnDef } from "@tanstack/react-table";
import { BookOpen, BookOpenCheck, MoreHorizontal, Pencil, Trash2, Users2 } from "lucide-react";
import { useNavigate } from "react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useStudentsUiStore } from "@/features/students/stores/studentsUi.store";
import { usePermission } from "@/hooks/usePermission";
import type { Student } from "@/types/people.types";

const RowActions = ({ student }: { student: Student }) => {
	const openEdit = useStudentsUiStore((s) => s.openEdit);
	const openDelete = useStudentsUiStore((s) => s.openDelete);
	const openAssignParents = useStudentsUiStore((s) => s.openAssignParents);
	const openAssignTeacher = useStudentsUiStore((s) => s.openAssignTeacher);
	const canUpdate = usePermission("students", "update");
	const canDelete = usePermission("students", "delete");
	const canManageParents = usePermission("student_parents", "create");
	const canReadPda = usePermission("pda_evaluations", "read");
	const navigate = useNavigate();

	if (!canUpdate && !canDelete && !canManageParents && !canReadPda) return null;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon">
					<MoreHorizontal className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{canUpdate && (
					<DropdownMenuItem onClick={() => openEdit(student)}>
						<Pencil className="mr-2 h-4 w-4" /> Editar
					</DropdownMenuItem>
				)}
				{canManageParents && (
					<DropdownMenuItem onClick={() => openAssignParents(student)}>
						<Users2 className="mr-2 h-4 w-4" /> Padres / tutores
					</DropdownMenuItem>
				)}
				{canUpdate && (
					<DropdownMenuItem onClick={() => openAssignTeacher(student)}>
						<BookOpen className="mr-2 h-4 w-4" /> Historial maestros
					</DropdownMenuItem>
				)}
				{canReadPda && (
					<DropdownMenuItem onClick={() => navigate(`/students/${student.id}/pdas`)}>
						<BookOpenCheck className="mr-2 h-4 w-4" /> Evaluación PDA
					</DropdownMenuItem>
				)}
				{canDelete && (
					<>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							className="text-destructive focus:text-destructive"
							onClick={() => openDelete(student)}
						>
							<Trash2 className="mr-2 h-4 w-4" /> Eliminar
						</DropdownMenuItem>
					</>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export const studentsColumns: ColumnDef<Student>[] = [
	{ accessorKey: "full_name", header: "Nombre completo" },
	{ accessorKey: "curp", header: "CURP" },
	{ accessorKey: "grade_group_label", header: "Grupo" },
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
	{ id: "actions", header: "", cell: ({ row }) => <RowActions student={row.original} /> },
];
