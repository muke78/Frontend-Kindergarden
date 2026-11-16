import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useParentMutations } from "@/features/parents/hooks/useParentMutations";
import { useParentsUiStore } from "@/features/parents/stores/parentsUi.store";

export const ParentDeleteDialog = () => {
	const dialog = useParentsUiStore((s) => s.dialog);
	const closeDialog = useParentsUiStore((s) => s.closeDialog);
	const { remove } = useParentMutations();

	const open = dialog?.kind === "delete";
	const parent = open ? dialog.parent : null;

	return (
		<Dialog open={open} onOpenChange={(o) => !o && closeDialog()}>
			<DialogContent className="max-w-sm">
				<DialogHeader>
					<DialogTitle>Eliminar tutor</DialogTitle>
				</DialogHeader>
				<p className="text-sm text-muted-foreground">
					¿Eliminar a <span className="font-medium text-foreground">{parent?.full_name}</span>? Esta
					acción no se puede deshacer.
				</p>
				<DialogFooter>
					<Button variant="outline" onClick={closeDialog} disabled={remove.isPending}>
						Cancelar
					</Button>
					<Button
						variant="destructive"
						disabled={remove.isPending}
						onClick={() => parent && remove.mutate(parent.id, { onSuccess: closeDialog })}
					>
						{remove.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						Eliminar
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
