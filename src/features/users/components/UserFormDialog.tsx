import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";

import { PasswordInput } from "@/components/common/PasswordInput";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import { type UserFormValues, useUserForm } from "@/features/users/hooks/useUserForm";
import { useUserMutations } from "@/features/users/hooks/useUserMutations";
import { useUsersUiStore } from "@/features/users/stores/usersUi.store";
import { catalogsService } from "@/services/catalogs.service";
import { rolesService } from "@/services/roles.service";
import type { CreateUserPayload, UpdateUserPayload } from "@/types/user.types";

const Field = ({
	label,
	error,
	children,
}: {
	label: string;
	error?: string;
	children: ReactNode;
}) => (
	<div className="space-y-1">
		<Label>{label}</Label>
		{children}
		{error && <p className="text-xs text-destructive">{error}</p>}
	</div>
);

export const UserFormDialog = () => {
	const dialog = useUsersUiStore((s) => s.dialog);
	const closeDialog = useUsersUiStore((s) => s.closeDialog);
	const { create, update } = useUserMutations();

	const open = dialog?.kind === "create" || dialog?.kind === "edit";
	const editing = dialog?.kind === "edit" ? dialog.user : undefined;
	const isEdit = Boolean(editing);
	const loading = create.isPending || update.isPending;

	const onSubmit = (values: UserFormValues) => {
		if (editing) {
			update.mutate(
				{ id: editing.id, payload: values as UpdateUserPayload },
				{ onSuccess: closeDialog },
			);
		} else {
			create.mutate(values as CreateUserPayload, { onSuccess: closeDialog });
		}
	};

	const { form, handleSubmit } = useUserForm({ user: editing, onSubmit, open });
	const { register, formState, watch, setValue } = form;

	const roles = useQuery({
		queryKey: ["roles", "all"],
		queryFn: () => rolesService.list({ limit: 200 }),
	});
	const statuses = useQuery({
		queryKey: ["catalogs", "statuses"],
		queryFn: catalogsService.statuses,
	});

	return (
		<Dialog open={open} onOpenChange={(o) => !o && closeDialog()}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>{isEdit ? "Editar usuario" : "Crear usuario"}</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-3" noValidate>
					<Field label="Nombre" error={formState.errors.name?.message}>
						<Input {...register("name")} autoFocus />
					</Field>
					<Field label="Email" error={formState.errors.email?.message}>
						<Input type="email" {...register("email")} />
					</Field>
					<Field
						label={isEdit ? "Nueva contraseña (opcional)" : "Contraseña"}
						error={formState.errors.password?.message}
					>
						<PasswordInput {...register("password")} />
					</Field>
					<Field label="Rol" error={formState.errors.role_id?.message}>
						<Select value={watch("role_id")} onValueChange={(v) => setValue("role_id", v)}>
							<SelectTrigger>
								<SelectValue placeholder="Selecciona un rol" />
							</SelectTrigger>
							<SelectContent>
								{roles.data?.rows.map((r) => (
									<SelectItem key={r.id} value={r.id}>
										{r.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</Field>
					<Field label="Estado" error={formState.errors.status_id?.message}>
						<Select value={watch("status_id")} onValueChange={(v) => setValue("status_id", v)}>
							<SelectTrigger>
								<SelectValue placeholder="Selecciona un estado" />
							</SelectTrigger>
							<SelectContent>
								{statuses.data?.map((s) => (
									<SelectItem key={s.id} value={s.id}>
										{s.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</Field>
					<DialogFooter className="pt-2">
						<Button type="button" variant="outline" onClick={closeDialog} disabled={loading}>
							Cancelar
						</Button>
						<Button type="submit" disabled={loading}>
							{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							{isEdit ? "Guardar" : "Crear"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};
