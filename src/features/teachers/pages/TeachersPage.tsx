import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";

import { DataTable } from "@/components/common/DataTable";
import { FilterSelect } from "@/components/common/FilterSelect";
import { PageHeader } from "@/components/common/PageHeader";
import { PermissionGate } from "@/components/common/PermissionGate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TeacherDeleteDialog } from "@/features/teachers/components/TeacherDeleteDialog";
import { TeacherFormDialog } from "@/features/teachers/components/TeacherFormDialog";
import { teachersColumns } from "@/features/teachers/components/TeachersTableColumns";
import { useTeachersPage } from "@/features/teachers/hooks/useTeachersPage";
import { useTeachersUiStore } from "@/features/teachers/stores/teachersUi.store";
import { catalogsService } from "@/services/catalogs.service";

export const TeachersPage = () => {
	const { rows, pagination, isLoading, openCreate } = useTeachersPage();
	const filters = useTeachersUiStore((s) => s.filters);
	const setSearch = useTeachersUiStore((s) => s.setSearch);
	const setStatus = useTeachersUiStore((s) => s.setStatus);
	const setWorkShift = useTeachersUiStore((s) => s.setWorkShift);
	const setPage = useTeachersUiStore((s) => s.setPage);
	const setLimit = useTeachersUiStore((s) => s.setLimit);

	const shifts = useQuery({ queryKey: ["catalogs", "work-shifts"], queryFn: catalogsService.workShifts });
	const statuses = useQuery({ queryKey: ["catalogs", "statuses"], queryFn: catalogsService.statuses });

	return (
		<div className="space-y-6">
			<PageHeader
				title="Maestros"
				description="Personal docente del plantel"
				actions={
					<PermissionGate module="teachers" action="create">
						<Button onClick={openCreate}>
							<Plus className="mr-2 h-4 w-4" /> Nuevo maestro
						</Button>
					</PermissionGate>
				}
			/>

			<div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
				<Input
					placeholder="Buscar maestro..."
					value={filters.search}
					onChange={(e) => setSearch(e.target.value)}
					className="w-full sm:max-w-xs"
				/>
				<FilterSelect
					value={filters.work_shift_id}
					onChange={setWorkShift}
					options={(shifts.data ?? []).map((s) => ({ value: s.id, label: s.name }))}
					placeholder="Todos los turnos"
				/>
				<FilterSelect
					value={filters.status_id}
					onChange={setStatus}
					options={(statuses.data ?? []).map((s) => ({ value: s.id, label: s.name }))}
					placeholder="Todos los estados"
				/>
			</div>

			<DataTable
				columns={teachersColumns}
				data={rows}
				isLoading={isLoading}
				pagination={pagination}
				onPageChange={setPage}
				onLimitChange={setLimit}
			/>
			<TeacherFormDialog />
			<TeacherDeleteDialog />
		</div>
	);
};
