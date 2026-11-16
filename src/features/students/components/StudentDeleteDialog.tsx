import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useStudentMutations } from "@/features/students/hooks/useStudentMutations";
import { useStudentsUiStore } from "@/features/students/stores/studentsUi.store";

export const StudentDeleteDialog = () => {
	const dialog = useStudentsUiStore((s) => s.dialog);
	const closeDialog = useStudentsUiStore((s) => s.closeDialog);
	const { remove } = useStudentMutations();

	const open = dialog?.kind === "delete";
	const student = open ? dialog.student : null;

	return (
		<Dialog open={open} onOpenChange={(o) => !o && closeDialog()}>
			<DialogContent className="max-w-sm">
				<DialogHeader>
					<DialogTitle>Eliminar alumno</DialogTitle>
				</DialogHeader>
				<p className="text-sm text-muted-foreground">
					¿Eliminar a <span className="font-medium text-foreground">{student?.full_name}</span>?
					Esta acción no se puede deshacer.
				</p>
				<DialogFooter>
					<Button variant="outline" onClick={closeDialog} disabled={remove.isPending}>
						Cancelar
					</Button>
					<Button
						variant="destructive"
						disabled={remove.isPending}
						onClick={() => student && remove.mutate(student.id, { onSuccess: closeDialog })}
					>
						{remove.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						Eliminar
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
