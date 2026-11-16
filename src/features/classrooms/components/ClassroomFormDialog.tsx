import { useQuery } from "@tanstack/react-query";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import { useClassroomForm } from "@/features/classrooms/hooks/useClassroomForm";
import { useClassroomMutations } from "@/features/classrooms/hooks/useClassroomMutations";
import { useClassroomsUiStore } from "@/features/classrooms/stores/classroomsUi.store";
import { catalogsService } from "@/services/catalogs.service";
import type { CreateClassroomPayload } from "@/types/people.types";

export const ClassroomFormDialog = () => {
	const dialog = useClassroomsUiStore((s) => s.dialog);
	const closeDialog = useClassroomsUiStore((s) => s.closeDialog);
	const { create, update } = useClassroomMutations();

	const open = dialog?.kind === "create" || dialog?.kind === "edit";
	const editing = dialog?.kind === "edit" ? dialog.classroom : undefined;
	const loading = create.isPending || update.isPending;

	const roomTypes = useQuery({
		queryKey: ["catalogs", "room-types"],
		queryFn: catalogsService.roomTypes,
	});

	const onSubmit = (values: CreateClassroomPayload) => {
		if (editing) {
			update.mutate({ id: editing.id, payload: values }, { onSuccess: closeDialog });
		} else {
			create.mutate(values, { onSuccess: closeDialog });
		}
	};

	const { form, handleSubmit } = useClassroomForm({ classroom: editing, onSubmit });
	const {
		register,
		formState: { errors },
		watch,
		setValue,
	} = form;

	return (
		<Dialog open={open} onOpenChange={(o) => !o && closeDialog()}>
			<DialogContent className="max-w-sm">
				<DialogHeader>
					<DialogTitle>{editing ? "Editar aula" : "Nueva aula"}</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-3" noValidate>
					<div className="space-y-1">
						<Label>Tipo de aula</Label>
						<Select
							value={watch("room_type_id")}
							onValueChange={(v) => setValue("room_type_id", v)}
						>
							<SelectTrigger>
								<SelectValue placeholder="Selecciona..." />
							</SelectTrigger>
							<SelectContent>
								{roomTypes.data?.map((rt) => (
									<SelectItem key={rt.id} value={rt.id}>
										{rt.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{errors.room_type_id && (
							<p className="text-xs text-destructive">{errors.room_type_id.message}</p>
						)}
					</div>
					<div className="space-y-1">
						<Label>Nombre</Label>
						<Input {...register("name")} autoFocus />
						{errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
					</div>
					<div className="space-y-1">
						<Label>Capacidad (opcional)</Label>
						<Input type="number" min={1} max={500} {...register("capacity")} />
						{errors.capacity && (
							<p className="text-xs text-destructive">{errors.capacity.message}</p>
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
