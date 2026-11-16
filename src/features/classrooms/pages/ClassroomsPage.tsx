import { Plus } from "lucide-react";

import { DataTable } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import { PermissionGate } from "@/components/common/PermissionGate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { ClassroomDeleteDialog } from "@/features/classrooms/components/ClassroomDeleteDialog";
import { ClassroomFormDialog } from "@/features/classrooms/components/ClassroomFormDialog";
import { classroomsColumns } from "@/features/classrooms/components/ClassroomsTableColumns";
import { useClassroomsPage } from "@/features/classrooms/hooks/useClassroomsPage";
import { useClassroomsUiStore } from "@/features/classrooms/stores/classroomsUi.store";

export const ClassroomsPage = () => {
	const { rows, isLoading, openCreate } = useClassroomsPage();
	const setSearch = useClassroomsUiStore((s) => s.setSearch);
	const search = useClassroomsUiStore((s) => s.filters.search);

	return (
		<div className="space-y-6">
			<PageHeader
				title="Aulas"
				description="Espacios físicos del plantel"
				actions={
					<PermissionGate module="classrooms" action="create">
						<Button onClick={openCreate}>
							<Plus className="mr-2 h-4 w-4" /> Nueva aula
						</Button>
					</PermissionGate>
				}
			/>

			<Input
				placeholder="Buscar aula..."
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				className="max-w-sm"
			/>

			<DataTable columns={classroomsColumns} data={rows} isLoading={isLoading} />
			<ClassroomFormDialog />
			<ClassroomDeleteDialog />
		</div>
	);
};
