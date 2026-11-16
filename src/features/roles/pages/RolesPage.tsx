import { Plus } from "lucide-react";

import { DataTable } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import { PermissionGate } from "@/components/common/PermissionGate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { RoleDeleteDialog } from "@/features/roles/components/RoleDeleteDialog";
import { RoleFormDialog } from "@/features/roles/components/RoleFormDialog";
import { RolePermissionsDialog } from "@/features/roles/components/RolePermissionsDialog";
import { rolesColumns } from "@/features/roles/components/RolesTableColumns";
import { useRolesPage } from "@/features/roles/hooks/useRolesPage";
import { useRolesUiStore } from "@/features/roles/stores/rolesUi.store";

export const RolesPage = () => {
	const { rows, isLoading, openCreate } = useRolesPage();
	const setSearch = useRolesUiStore((s) => s.setSearch);
	const search = useRolesUiStore((s) => s.filters.search);

	return (
		<div className="space-y-6">
			<PageHeader
				title="Roles"
				description="Gestión de roles y permisos del sistema"
				actions={
					<PermissionGate module="roles" action="create">
						<Button onClick={openCreate}>
							<Plus className="mr-2 h-4 w-4" /> Nuevo rol
						</Button>
					</PermissionGate>
				}
			/>

			<Input
				placeholder="Buscar rol..."
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				className="max-w-sm"
			/>

			<DataTable columns={rolesColumns} data={rows} isLoading={isLoading} />
			<RoleFormDialog />
			<RoleDeleteDialog />
			<RolePermissionsDialog />
		</div>
	);
};
