import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";

import { DataTable } from "@/components/common/DataTable";
import { FilterSelect } from "@/components/common/FilterSelect";
import { PageHeader } from "@/components/common/PageHeader";
import { PermissionGate } from "@/components/common/PermissionGate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AssignParentsDialog } from "@/features/students/components/AssignParentsDialog";
import { AssignTeacherDialog } from "@/features/students/components/AssignTeacherDialog";
import { StudentDeleteDialog } from "@/features/students/components/StudentDeleteDialog";
import { StudentFormDialog } from "@/features/students/components/StudentFormDialog";
import { studentsColumns } from "@/features/students/components/StudentsTableColumns";
import { useStudentsPage } from "@/features/students/hooks/useStudentsPage";
import { useStudentsUiStore } from "@/features/students/stores/studentsUi.store";
import { catalogsService } from "@/services/catalogs.service";

export const StudentsPage = () => {
	const { rows, pagination, isLoading, openCreate } = useStudentsPage();
	const filters = useStudentsUiStore((s) => s.filters);
	const setSearch = useStudentsUiStore((s) => s.setSearch);
	const setStatus = useStudentsUiStore((s) => s.setStatus);
	const setGradeGroup = useStudentsUiStore((s) => s.setGradeGroup);
	const setPage = useStudentsUiStore((s) => s.setPage);
	const setLimit = useStudentsUiStore((s) => s.setLimit);

	const groups = useQuery({ queryKey: ["catalogs", "grade-groups"], queryFn: catalogsService.gradeGroups });
	const statuses = useQuery({ queryKey: ["catalogs", "statuses"], queryFn: catalogsService.statuses });

	return (
		<div className="space-y-6">
			<PageHeader
				title="Alumnos"
				description="Estudiantes inscritos en el plantel"
				actions={
					<PermissionGate module="students" action="create">
						<Button onClick={openCreate}>
							<Plus className="mr-2 h-4 w-4" /> Nuevo alumno
						</Button>
					</PermissionGate>
				}
			/>

			<div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
				<Input
					placeholder="Buscar alumno..."
					value={filters.search}
					onChange={(e) => setSearch(e.target.value)}
					className="w-full sm:max-w-xs"
				/>
				<FilterSelect
					value={filters.grade_group_id}
					onChange={setGradeGroup}
					options={(groups.data ?? []).map((g) => ({ value: g.id, label: g.label }))}
					placeholder="Todos los grupos"
				/>
				<FilterSelect
					value={filters.status_id}
					onChange={setStatus}
					options={(statuses.data ?? []).map((s) => ({ value: s.id, label: s.name }))}
					placeholder="Todos los estados"
				/>
			</div>

			<DataTable
				columns={studentsColumns}
				data={rows}
				isLoading={isLoading}
				pagination={pagination}
				onPageChange={setPage}
				onLimitChange={setLimit}
			/>
			<StudentFormDialog />
			<StudentDeleteDialog />
			<AssignParentsDialog />
			<AssignTeacherDialog />
		</div>
	);
};
