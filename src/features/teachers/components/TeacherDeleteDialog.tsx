import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useTeacherMutations } from "@/features/teachers/hooks/useTeacherMutations";
import { useTeachersUiStore } from "@/features/teachers/stores/teachersUi.store";

export const TeacherDeleteDialog = () => {
	const dialog = useTeachersUiStore((s) => s.dialog);
	const closeDialog = useTeachersUiStore((s) => s.closeDialog);
	const { remove } = useTeacherMutations();

	const open = dialog?.kind === "delete";
	const teacher = open ? dialog.teacher : null;

	return (
		<Dialog open={open} onOpenChange={(o) => !o && closeDialog()}>
			<DialogContent className="max-w-sm">
				<DialogHeader>
					<DialogTitle>Eliminar maestro</DialogTitle>
				</DialogHeader>
				<p className="text-sm text-muted-foreground">
					¿Eliminar a <span className="font-medium text-foreground">{teacher?.full_name}</span>?
					Esta acción no se puede deshacer.
				</p>
				<DialogFooter>
					<Button variant="outline" onClick={closeDialog} disabled={remove.isPending}>
						Cancelar
					</Button>
					<Button
						variant="destructive"
						disabled={remove.isPending}
						onClick={() => teacher && remove.mutate(teacher.id, { onSuccess: closeDialog })}
					>
						{remove.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						Eliminar
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
