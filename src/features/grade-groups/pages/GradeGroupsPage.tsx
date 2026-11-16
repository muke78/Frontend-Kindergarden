import { Plus } from "lucide-react";

import { DataTable } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import { PermissionGate } from "@/components/common/PermissionGate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GradeGroupDeleteDialog } from "@/features/grade-groups/components/GradeGroupDeleteDialog";
import { GradeGroupFormDialog } from "@/features/grade-groups/components/GradeGroupFormDialog";
import { gradeGroupsColumns } from "@/features/grade-groups/components/GradeGroupsTableColumns";
import { useGradeGroupsQuery } from "@/features/grade-groups/hooks/useGradeGroupsQuery";
import { useGradeGroupsUiStore } from "@/features/grade-groups/stores/gradeGroupsUi.store";

export const GradeGroupsPage = () => {
	const openCreate = useGradeGroupsUiStore((s) => s.openCreate);
	const setSearch = useGradeGroupsUiStore((s) => s.setSearch);
	const search = useGradeGroupsUiStore((s) => s.filters.search);
	const { data, isLoading } = useGradeGroupsQuery();

	return (
		<div className="space-y-6">
			<PageHeader
				title="Grados y grupos"
				description="Configuración de grupos académicos del kínder"
				actions={
					<PermissionGate module="grade_groups" action="create">
						<Button onClick={openCreate}>
							<Plus className="mr-2 h-4 w-4" /> Nuevo grupo
						</Button>
					</PermissionGate>
				}
			/>

			<Input
				placeholder="Buscar grupo..."
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				className="max-w-sm"
			/>

			<DataTable columns={gradeGroupsColumns} data={data?.rows ?? []} isLoading={isLoading} />
			<GradeGroupFormDialog />
			<GradeGroupDeleteDialog />
		</div>
	);
};
