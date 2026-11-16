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
import { Textarea } from "@/components/ui/textarea";
import { usePdaCategoryMutations } from "@/features/pdas/hooks/usePdasMutations";
import { usePdasUiStore } from "@/features/pdas/stores/pdasUi.store";

const schema = z.object({
	code: z
		.string()
		.min(2)
		.max(60)
		.regex(/^[a-z0-9_]+$/, "Minúsculas, números o guión_bajo"),
	name: z.string().min(2).max(120),
	description: z.string().max(500).optional().or(z.literal("")),
	color: z.string().regex(/^#[0-9a-f]{6}$/i, "Formato #rrggbb"),
	sort_order: z.coerce.number().int().min(0),
});
type FormValues = z.infer<typeof schema>;

export const PdaCategoryDialog = () => {
	const dialog = usePdasUiStore((s) => s.dialog);
	const close = usePdasUiStore((s) => s.closeDialog);
	const { create, update } = usePdaCategoryMutations();

	const isCreate = dialog?.kind === "create-category";
	const isEdit = dialog?.kind === "edit-category";
	const open = isCreate || isEdit;
	const editing = isEdit ? dialog.category : undefined;

	const form = useForm<FormValues>({ resolver: zodResolver(schema) });
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = form;

	useEffect(() => {
		reset(
			editing
				? {
						code: editing.code,
						name: editing.name,
						description: editing.description ?? "",
						color: editing.color,
						sort_order: editing.sort_order,
					}
				: { code: "", name: "", description: "", color: "#6366f1", sort_order: 0 },
		);
	}, [editing, open, reset]);

	const isPending = create.isPending || update.isPending;

	const onSubmit = (values: FormValues) => {
		if (editing) update.mutate({ id: editing.id, payload: values });
		else create.mutate(values);
	};

	return (
		<Dialog open={open} onOpenChange={(o) => !o && close()}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>{editing ? "Editar campo formativo" : "Nuevo campo formativo"}</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
					<div className="space-y-1">
						<Label>Código</Label>
						<Input {...register("code")} placeholder="lenguajes" />
						{errors.code && <p className="text-xs text-destructive">{errors.code.message}</p>}
					</div>
					<div className="space-y-1">
						<Label>Nombre</Label>
						<Input {...register("name")} autoFocus />
						{errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
					</div>
					<div className="space-y-1">
						<Label>Descripción (optativo)</Label>
						<Textarea {...register("description")} rows={2} />
					</div>
					<div className="grid grid-cols-2 gap-3">
						<div className="space-y-1">
							<Label>Color</Label>
							<div className="flex gap-2">
								<Input type="color" {...register("color")} className="w-12 p-1 cursor-pointer" />
								<Input {...register("color")} className="flex-1" />
							</div>
						</div>
						<div className="space-y-1">
							<Label>Orden</Label>
							<Input type="number" {...register("sort_order")} min={0} />
						</div>
					</div>
					<DialogFooter>
						<Button type="button" variant="outline" onClick={close} disabled={isPending}>
							Cancelar
						</Button>
						<Button type="submit" disabled={isPending}>
							{isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							{editing ? "Guardar" : "Crear"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};
