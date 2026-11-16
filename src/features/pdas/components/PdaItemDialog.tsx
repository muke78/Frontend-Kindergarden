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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { usePdaItemMutations } from "@/features/pdas/hooks/usePdasMutations";
import { usePdaCategories } from "@/features/pdas/hooks/usePdasQueries";
import { usePdasUiStore } from "@/features/pdas/stores/pdasUi.store";

const GRADE_NAMES = ["Primero", "Segundo", "Tercero"];

const schema = z.object({
	category_id: z.string().uuid("Selecciona una categoría"),
	grade_name: z.string().min(1, "Selecciona un grado"),
	description: z.string().min(5, "Mínimo 5 caracteres").max(1000),
	sort_order: z.coerce.number().int().min(0),
});
type FormValues = z.infer<typeof schema>;

export const PdaItemDialog = () => {
	const dialog = usePdasUiStore((s) => s.dialog);
	const close = usePdasUiStore((s) => s.closeDialog);
	const { create, update } = usePdaItemMutations();
	const { data: categories = [] } = usePdaCategories();

	const isCreate = dialog?.kind === "create-item";
	const isEdit = dialog?.kind === "edit-item";
	const open = isCreate || isEdit;
	const editing = isEdit ? dialog.item : undefined;
	const defaultCatId = isCreate ? dialog.categoryId : undefined;

	const {
		register,
		handleSubmit,
		reset,
		watch,
		setValue,
		formState: { errors },
	} = useForm<FormValues>({ resolver: zodResolver(schema) });

	useEffect(() => {
		reset(
			editing
				? {
						category_id: editing.category_id,
						grade_name: editing.grade_name,
						description: editing.description,
						sort_order: editing.sort_order,
					}
				: {
						category_id: defaultCatId ?? "",
						grade_name: "Primero",
						description: "",
						sort_order: 0,
					},
		);
	}, [editing, open, defaultCatId, reset]);

	const isPending = create.isPending || update.isPending;

	const onSubmit = (v: FormValues) => {
		if (editing) update.mutate({ id: editing.id, payload: v });
		else create.mutate(v as Parameters<typeof create.mutate>[0]);
	};

	return (
		<Dialog open={open} onOpenChange={(o) => !o && close()}>
			<DialogContent className="max-w-lg">
				<DialogHeader>
					<DialogTitle>{editing ? "Editar PDA" : "Nuevo PDA"}</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
					<div className="grid grid-cols-2 gap-3">
						<div className="space-y-1">
							<Label>Campo formativo</Label>
							<Select
								value={watch("category_id")}
								onValueChange={(v) => setValue("category_id", v, { shouldValidate: true })}
							>
								<SelectTrigger>
									<SelectValue placeholder="Selecciona..." />
								</SelectTrigger>
								<SelectContent>
									{categories.map((c) => (
										<SelectItem key={c.id} value={c.id}>
											{c.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{errors.category_id && (
								<p className="text-xs text-destructive">{errors.category_id.message}</p>
							)}
						</div>
						<div className="space-y-1">
							<Label>Grado</Label>
							<Select
								value={watch("grade_name")}
								onValueChange={(v) => setValue("grade_name", v, { shouldValidate: true })}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{GRADE_NAMES.map((g) => (
										<SelectItem key={g} value={g}>
											{g}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
					<div className="space-y-1">
						<Label>Descripción del PDA</Label>
						<Textarea
							{...register("description")}
							rows={3}
							autoFocus
							placeholder="Ej: Expresa ideas y sentimientos a través del lenguaje oral..."
						/>
						{errors.description && (
							<p className="text-xs text-destructive">{errors.description.message}</p>
						)}
					</div>
					<div className="space-y-1 w-24">
						<Label>Orden</Label>
						<Input type="number" {...register("sort_order")} min={0} />
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
