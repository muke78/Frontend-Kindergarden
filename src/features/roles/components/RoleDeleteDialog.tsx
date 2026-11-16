import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useRoleMutations } from "@/features/roles/hooks/useRoleMutations";
import { useRolesUiStore } from "@/features/roles/stores/rolesUi.store";

export const RoleDeleteDialog = () => {
	const dialog = useRolesUiStore((s) => s.dialog);
	const closeDialog = useRolesUiStore((s) => s.closeDialog);
	const { remove } = useRoleMutations();

	const open = dialog?.kind === "delete";
	const role = open ? dialog.role : undefined;

	return (
		<ConfirmDialog
			open={open}
			onOpenChange={(o) => !o && closeDialog()}
			title="Eliminar rol"
			description={
				role ? `¿Eliminar el rol "${role.name}"? Los usuarios con este rol perderán acceso.` : ""
			}
			destructive
			confirmLabel="Eliminar"
			loading={remove.isPending}
			onConfirm={() => {
				if (role) remove.mutate(role.id, { onSuccess: closeDialog });
			}}
		/>
	);
};
