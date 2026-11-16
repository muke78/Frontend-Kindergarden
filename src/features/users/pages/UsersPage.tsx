import { Plus, Trash2 } from "lucide-react";

import { DataTable } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import { PermissionGate } from "@/components/common/PermissionGate";
import { Button } from "@/components/ui/button";

import { UserDeleteDialog } from "@/features/users/components/UserDeleteDialog";
import { UserFormDialog } from "@/features/users/components/UserFormDialog";
import { UserPermissionsDialog } from "@/features/users/components/UserPermissionsDialog";
import { UsersFilters } from "@/features/users/components/UsersFilters";
import { usersColumns } from "@/features/users/components/UsersTableColumns";
import { useUserMutations } from "@/features/users/hooks/useUserMutations";
import { useUsersPage } from "@/features/users/hooks/useUsersPage";
import { useUsersUiStore } from "@/features/users/stores/usersUi.store";
import type { User } from "@/types/user.types";

export const UsersPage = () => {
	const { rows, pagination, isLoading, openCreate } = useUsersPage();
	const rowSelection = useUsersUiStore((s) => s.rowSelection);
	const setRowSelection = useUsersUiStore((s) => s.setRowSelection);
	const setPage = useUsersUiStore((s) => s.setPage);
	const setLimit = useUsersUiStore((s) => s.setLimit);
	const { bulkRemove } = useUserMutations();

	const selectedIds = Object.keys(rowSelection).filter((k) => rowSelection[k]);

	return (
		<div className="space-y-6">
			<PageHeader
				title="Usuarios"
				description="Gestión de cuentas del sistema"
				actions={
					<PermissionGate module="users" action="create">
						<Button onClick={openCreate}>
							<Plus className="mr-2 h-4 w-4" /> Nuevo usuario
						</Button>
					</PermissionGate>
				}
			/>

			<UsersFilters />

			{selectedIds.length > 0 && (
				<div className="flex items-center gap-3 p-3 rounded-md bg-destructive/10 border border-destructive/20">
					<span className="text-sm font-medium">
						{selectedIds.length} seleccionado{selectedIds.length > 1 ? "s" : ""}
					</span>
					<Button
						size="sm"
						variant="destructive"
						disabled={bulkRemove.isPending}
						onClick={() => bulkRemove.mutate(selectedIds)}
					>
						<Trash2 className="mr-1.5 h-3.5 w-3.5" />
						Eliminar seleccionados
					</Button>
				</div>
			)}

			<DataTable
				columns={usersColumns}
				data={rows}
				isLoading={isLoading}
				enableRowSelection
				rowSelection={rowSelection}
				onRowSelectionChange={(updater) => {
					const next = typeof updater === "function" ? updater(rowSelection) : updater;
					setRowSelection(next as Record<string, boolean>);
				}}
				getRowId={(row: User) => row.id}
				pagination={pagination}
				onPageChange={setPage}
				onLimitChange={setLimit}
			/>

			<UserFormDialog />
			<UserDeleteDialog />
			<UserPermissionsDialog />
		</div>
	);
};
