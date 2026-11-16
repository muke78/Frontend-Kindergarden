import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";

import { DataTable } from "@/components/common/DataTable";
import { FilterSelect } from "@/components/common/FilterSelect";
import { PageHeader } from "@/components/common/PageHeader";
import { PermissionGate } from "@/components/common/PermissionGate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ParentDeleteDialog } from "@/features/parents/components/ParentDeleteDialog";
import { ParentFormDialog } from "@/features/parents/components/ParentFormDialog";
import { ParentWithChildrenDialog } from "@/features/parents/components/ParentWithChildrenDialog";
import { parentsColumns } from "@/features/parents/components/ParentsTableColumns";
import { useParentsPage } from "@/features/parents/hooks/useParentsPage";
import { useParentsUiStore } from "@/features/parents/stores/parentsUi.store";
import { catalogsService } from "@/services/catalogs.service";

export const ParentsPage = () => {
	const { rows, pagination, isLoading, openCreate } = useParentsPage();
	const filters = useParentsUiStore((s) => s.filters);
	const setSearch = useParentsUiStore((s) => s.setSearch);
	const setStatus = useParentsUiStore((s) => s.setStatus);
	const setPage = useParentsUiStore((s) => s.setPage);
	const setLimit = useParentsUiStore((s) => s.setLimit);

	const statuses = useQuery({ queryKey: ["catalogs", "statuses"], queryFn: catalogsService.statuses });

	return (
		<div className="space-y-6">
			<PageHeader
				title="Tutores"
				description="Padres y tutores de los alumnos"
				actions={
					<PermissionGate module="parents" action="create">
						<Button onClick={openCreate}>
							<Plus className="mr-2 h-4 w-4" /> Nuevo tutor
						</Button>
					</PermissionGate>
				}
			/>

			<div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
				<Input
					placeholder="Buscar tutor..."
					value={filters.search}
					onChange={(e) => setSearch(e.target.value)}
					className="w-full sm:max-w-xs"
				/>
				<FilterSelect
					value={filters.status_id}
					onChange={setStatus}
					options={(statuses.data ?? []).map((s) => ({ value: s.id, label: s.name }))}
					placeholder="Todos los estados"
				/>
			</div>

			<DataTable
				columns={parentsColumns}
				data={rows}
				isLoading={isLoading}
				pagination={pagination}
				onPageChange={setPage}
				onLimitChange={setLimit}
			/>
			<ParentWithChildrenDialog />
			<ParentFormDialog />
			<ParentDeleteDialog />
		</div>
	);
};
