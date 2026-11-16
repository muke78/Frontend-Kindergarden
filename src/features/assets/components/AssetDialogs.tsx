import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { DatePickerField } from "@/components/common/DatePickerField";
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
import type { useAssetsPage } from "@/features/assets/hooks/useAssetsPage";
import { useAssetsUiStore } from "@/features/assets/stores/assetsUi.store";

const NONE = "__none__";

const schema = z.object({
	name: z.string().min(2, "Mínimo 2 caracteres").max(120),
	condition_id: z.string().uuid("Selecciona condición"),
	status_id: z.string().uuid("Selecciona estado"),
	classroom_id: z.string().optional(),
	serial_number: z.string().max(100).optional().or(z.literal("")),
	cost: z.coerce.number().min(0).optional(),
	purchase_date: z.string().optional().or(z.literal("")),
	description: z.string().max(500).optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

const empty: FormValues = {
	name: "",
	condition_id: "",
	status_id: "",
	classroom_id: NONE,
	serial_number: "",
	cost: 0,
	purchase_date: "",
	description: "",
};

type PageApi = ReturnType<typeof useAssetsPage>;

export const AssetFormDialog = ({ page }: { page: PageApi }) => {
	const dialog = useAssetsUiStore((s) => s.dialog);
	const closeDialog = useAssetsUiStore((s) => s.closeDialog);
	const open = dialog?.kind === "create" || dialog?.kind === "edit";
	const editing = dialog?.kind === "edit" ? dialog.asset : undefined;
	const isPending = page.create.isPending || page.update.isPending;

	const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: empty });
	const {
		register,
		formState: { errors },
		watch,
		setValue,
		reset,
		handleSubmit,
	} = form;

	useEffect(() => {
		reset(
			editing
				? {
						name: editing.name,
						condition_id: editing.condition_id,
						status_id: editing.status_id,
						classroom_id: editing.classroom_id ?? NONE,
						serial_number: editing.serial_number ?? "",
						cost: Number(editing.cost) || 0,
						purchase_date: editing.purchase_date?.split("T")[0] ?? "",
						description: editing.description ?? "",
					}
				: empty,
		);
	}, [editing, reset]);

	const onSubmit = handleSubmit((v) => {
		const payload = {
			name: v.name,
			condition_id: v.condition_id,
			status_id: v.status_id,
			classroom_id: v.classroom_id === NONE ? null : v.classroom_id,
			serial_number: v.serial_number || null,
			cost: v.cost ?? 0,
			purchase_date: v.purchase_date || null,
			description: v.description || null,
		};
		if (editing) page.update.mutate({ id: editing.id, payload }, { onSuccess: closeDialog });
		else page.create.mutate(payload, { onSuccess: closeDialog });
	});

	const sel = (f: "condition_id" | "status_id" | "classroom_id") => (v: string) =>
		setValue(f, v, { shouldValidate: true });

	return (
		<Dialog open={open} onOpenChange={(o) => !o && closeDialog()}>
			<DialogContent className="max-w-lg">
				<DialogHeader>
					<DialogTitle>{editing ? "Editar activo" : "Nuevo activo"}</DialogTitle>
				</DialogHeader>
				<div className="space-y-3">
					<div className="space-y-1">
						<Label>Nombre</Label>
						<Input {...register("name")} autoFocus />
						{errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
					</div>

					<div className="grid grid-cols-2 gap-3">
						<div className="space-y-1">
							<Label>Condición</Label>
							<Select value={watch("condition_id")} onValueChange={sel("condition_id")}>
								<SelectTrigger>
									<SelectValue placeholder="Selecciona..." />
								</SelectTrigger>
								<SelectContent>
									{page.catalogs.conditions.map((c) => (
										<SelectItem key={c.id} value={c.id}>
											{c.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{errors.condition_id && (
								<p className="text-xs text-destructive">{errors.condition_id.message}</p>
							)}
						</div>
						<div className="space-y-1">
							<Label>Estado</Label>
							<Select value={watch("status_id")} onValueChange={sel("status_id")}>
								<SelectTrigger>
									<SelectValue placeholder="Selecciona..." />
								</SelectTrigger>
								<SelectContent>
									{page.catalogs.statuses.map((s) => (
										<SelectItem key={s.id} value={s.id}>
											{s.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{errors.status_id && (
								<p className="text-xs text-destructive">{errors.status_id.message}</p>
							)}
						</div>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<div className="space-y-1">
							<Label>Aula (opt.)</Label>
							<Select value={watch("classroom_id")} onValueChange={sel("classroom_id")}>
								<SelectTrigger>
									<SelectValue placeholder="Sin aula" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value={NONE}>Sin aula</SelectItem>
									{page.catalogs.classrooms.map((c) => (
										<SelectItem key={c.id} value={c.id}>
											{c.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-1">
							<Label>No. de serie (opt.)</Label>
							<Input {...register("serial_number")} />
						</div>
					</div>

					<div className="grid grid-cols-2 gap-3">
						<div className="space-y-1">
							<Label>Costo MXN</Label>
							<Input type="number" step="0.01" min="0" {...register("cost")} />
						</div>
						<div className="space-y-1">
							<Label>Fecha de compra (opt.)</Label>
							<DatePickerField
								value={watch("purchase_date") ?? ""}
								onChange={(v) => setValue("purchase_date", v)}
							/>
						</div>
					</div>

					<div className="space-y-1">
						<Label>Descripción (opt.)</Label>
						<Textarea rows={2} {...register("description")} />
					</div>
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={closeDialog} disabled={isPending}>
						Cancelar
					</Button>
					<Button onClick={onSubmit} disabled={isPending}>
						{isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						Guardar
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export const AssetDeleteDialog = ({ page }: { page: PageApi }) => {
	const dialog = useAssetsUiStore((s) => s.dialog);
	const closeDialog = useAssetsUiStore((s) => s.closeDialog);
	const open = dialog?.kind === "delete";
	const asset = dialog?.kind === "delete" ? dialog.asset : undefined;

	return (
		<Dialog open={open} onOpenChange={(o) => !o && closeDialog()}>
			<DialogContent className="max-w-sm">
				<DialogHeader>
					<DialogTitle>Eliminar activo</DialogTitle>
				</DialogHeader>
				<p className="text-sm text-muted-foreground">
					¿Eliminar <span className="font-medium text-foreground">{asset?.name}</span>? Se puede
					recuperar desde base de datos (borrado suave).
				</p>
				<DialogFooter>
					<Button variant="outline" onClick={closeDialog}>
						Cancelar
					</Button>
					<Button
						variant="destructive"
						disabled={page.remove.isPending}
						onClick={() =>
							asset && page.remove.mutate(asset.id, { onSuccess: closeDialog })
						}
					>
						{page.remove.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						Eliminar
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
