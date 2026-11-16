import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type RoleFormValues, useRoleForm } from "@/features/roles/hooks/useRoleForm";
import { useRoleMutations } from "@/features/roles/hooks/useRoleMutations";
import { useRolesUiStore } from "@/features/roles/stores/rolesUi.store";

export const RoleFormDialog = () => {
	const dialog = useRolesUiStore((s) => s.dialog);
	const closeDialog = useRolesUiStore((s) => s.closeDialog);
	const { create, update } = useRoleMutations();

	const open = dialog?.kind === "create" || dialog?.kind === "edit";
	const editing = dialog?.kind === "edit" ? dialog.role : undefined;
	const loading = create.isPending || update.isPending;

	const onSubmit = (values: RoleFormValues) => {
		if (editing)
			update.mutate(
				{ id: editing.id, payload: { name: values.name, description: values.description } },
				{ onSuccess: closeDialog },
			);
		else create.mutate(values, { onSuccess: closeDialog });
	};

	const { form, handleSubmit } = useRoleForm({ role: editing, onSubmit });
	const {
		register,
		formState: { errors },
	} = form;

	return (
		<Dialog open={open} onOpenChange={(o) => !o && closeDialog()}>
			<DialogContent className="max-w-sm">
				<DialogHeader>
					<DialogTitle>{editing ? "Editar rol" : "Nuevo rol"}</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-3" noValidate>
					<div className="space-y-1">
						<Label>Código</Label>
						<Input
							{...register("code")}
							autoFocus
							disabled={Boolean(editing)}
							placeholder="admin_staff"
						/>
						{errors.code && <p className="text-xs text-destructive">{errors.code.message}</p>}
					</div>
					<div className="space-y-1">
						<Label>Nombre</Label>
						<Input {...register("name")} placeholder="Administrador" />
						{errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
					</div>
					<div className="space-y-1">
						<Label>Descripción</Label>
						<Input {...register("description")} placeholder="Acceso completo al sistema" />
					</div>
					<DialogFooter className="pt-2">
						<Button type="button" variant="outline" onClick={closeDialog} disabled={loading}>
							Cancelar
						</Button>
						<Button type="submit" disabled={loading}>
							{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							{editing ? "Guardar" : "Crear"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};
