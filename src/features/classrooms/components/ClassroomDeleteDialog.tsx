import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

import { useClassroomMutations } from "@/features/classrooms/hooks/useClassroomMutations";
import { useClassroomsUiStore } from "@/features/classrooms/stores/classroomsUi.store";

export const ClassroomDeleteDialog = () => {
	const dialog = useClassroomsUiStore((s) => s.dialog);
	const closeDialog = useClassroomsUiStore((s) => s.closeDialog);
	const { remove } = useClassroomMutations();

	const open = dialog?.kind === "delete";
	const classroom = open ? dialog.classroom : null;

	return (
		<Dialog open={open} onOpenChange={(o) => !o && closeDialog()}>
			<DialogContent className="max-w-sm">
				<DialogHeader>
					<DialogTitle>Eliminar aula</DialogTitle>
				</DialogHeader>
				<p className="text-sm text-muted-foreground">
					¿Eliminar <span className="font-medium text-foreground">{classroom?.name}</span>? Esta
					acción no se puede deshacer.
				</p>
				<DialogFooter>
					<Button variant="outline" onClick={closeDialog} disabled={remove.isPending}>
						Cancelar
					</Button>
					<Button
						variant="destructive"
						disabled={remove.isPending}
						onClick={() => classroom && remove.mutate(classroom.id, { onSuccess: closeDialog })}
					>
						{remove.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						Eliminar
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
