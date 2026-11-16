import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useUserMutations } from "@/features/users/hooks/useUserMutations";
import { useUsersUiStore } from "@/features/users/stores/usersUi.store";

export const UserDeleteDialog = () => {
	const dialog = useUsersUiStore((s) => s.dialog);
	const closeDialog = useUsersUiStore((s) => s.closeDialog);
	const { remove } = useUserMutations();

	const open = dialog?.kind === "delete";
	const user = open ? dialog.user : undefined;

	return (
		<ConfirmDialog
			open={open}
			onOpenChange={(o) => !o && closeDialog()}
			title="Eliminar usuario"
			description={user ? `¿Eliminar a ${user.name}? Esta acción no se puede deshacer.` : ""}
			destructive
			confirmLabel="Eliminar"
			loading={remove.isPending}
			onConfirm={() => {
				if (!user) return;
				remove.mutate(user.id, { onSuccess: closeDialog });
			}}
		/>
	);
};
