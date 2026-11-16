import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useGradeGroupMutations } from "@/features/grade-groups/hooks/useGradeGroupMutations";
import { useGradeGroupsUiStore } from "@/features/grade-groups/stores/gradeGroupsUi.store";

export const GradeGroupDeleteDialog = () => {
	const dialog = useGradeGroupsUiStore((s) => s.dialog);
	const closeDialog = useGradeGroupsUiStore((s) => s.closeDialog);
	const { remove } = useGradeGroupMutations();

	const open = dialog?.kind === "delete";
	const gradeGroup = open ? dialog.gradeGroup : null;

	return (
		<Dialog open={open} onOpenChange={(o) => !o && closeDialog()}>
			<DialogContent className="max-w-sm">
				<DialogHeader>
					<DialogTitle>Eliminar grupo</DialogTitle>
				</DialogHeader>
				<p className="text-sm text-muted-foreground">
					¿Eliminar <span className="font-medium text-foreground">{gradeGroup?.label}</span>? Esta
					acción no se puede deshacer.
				</p>
				<DialogFooter>
					<Button variant="outline" onClick={closeDialog} disabled={remove.isPending}>
						Cancelar
					</Button>
					<Button
						variant="destructive"
						disabled={remove.isPending}
						onClick={() => gradeGroup && remove.mutate(gradeGroup.id, { onSuccess: closeDialog })}
					>
						{remove.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						Eliminar
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
