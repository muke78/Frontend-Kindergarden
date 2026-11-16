import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { useGradeGroupMutations } from "@/features/grade-groups/hooks/useGradeGroupMutations";
import { useGradeGroupsUiStore } from "@/features/grade-groups/stores/gradeGroupsUi.store";

const schema = z.object({
	grade_name: z.string().min(2, "Mínimo 2 caracteres").max(40),
	group_name: z.string().min(1, "Requerido").max(10),
});
type FormValues = z.infer<typeof schema>;

export const GradeGroupFormDialog = () => {
	const dialog = useGradeGroupsUiStore((s) => s.dialog);
	const closeDialog = useGradeGroupsUiStore((s) => s.closeDialog);
	const { create, update } = useGradeGroupMutations();

	const open = dialog?.kind === "create" || dialog?.kind === "edit";
	const editing = dialog?.kind === "edit" ? dialog.gradeGroup : undefined;
	const loading = create.isPending || update.isPending;

	const form = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: { grade_name: "", group_name: "" },
	});

	useEffect(() => {
		if (open) {
			form.reset({
				grade_name: editing?.grade_name ?? "",
				group_name: editing?.group_name ?? "",
			});
		}
	}, [open, editing, form]);

	const onSubmit = (values: FormValues) => {
		if (editing) {
			update.mutate({ id: editing.id, payload: values }, { onSuccess: closeDialog });
		} else {
			create.mutate(values, { onSuccess: closeDialog });
		}
	};

	return (
		<Dialog open={open} onOpenChange={(o) => !o && closeDialog()}>
			<DialogContent className="max-w-sm">
				<DialogHeader>
					<DialogTitle>{editing ? "Editar grupo" : "Nuevo grupo"}</DialogTitle>
				</DialogHeader>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3" noValidate>
					<div className="space-y-1">
						<Label>Grado</Label>
						<Input {...form.register("grade_name")} placeholder="Ej: Primero" autoFocus />
						{form.formState.errors.grade_name && (
							<p className="text-xs text-destructive">{form.formState.errors.grade_name.message}</p>
						)}
					</div>
					<div className="space-y-1">
						<Label>Grupo</Label>
						<Input {...form.register("group_name")} placeholder="Ej: A" />
						{form.formState.errors.group_name && (
							<p className="text-xs text-destructive">{form.formState.errors.group_name.message}</p>
						)}
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
