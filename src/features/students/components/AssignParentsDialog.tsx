import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Star, Trash2, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { ParentSearchCombobox } from "@/components/common/ParentSearchCombobox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useStudentsUiStore } from "@/features/students/stores/studentsUi.store";
import { parentsService } from "@/services/parents.service";
import { studentParentsService } from "@/services/studentParents.service";

const RELATIONSHIPS = ["madre", "padre", "tutor", "abuelo", "abuela", "otro"] as const;

export const AssignParentsDialog = () => {
	const dialog = useStudentsUiStore((s) => s.dialog);
	const closeDialog = useStudentsUiStore((s) => s.closeDialog);
	const qc = useQueryClient();

	const open = dialog?.kind === "assign-parents";
	const student = open ? dialog.student : null;

	const [selectedParent, setSelectedParent] = useState("");
	const [relationship, setRelationship] = useState<string>("madre");
	const [isPrimary, setIsPrimary] = useState(false);

	const { data: assigned = [], isLoading: loadingAssigned } = useQuery({
		queryKey: ["student-parents", student?.id],
		queryFn: () => studentParentsService.list(student!.id),
		enabled: !!student?.id,
	});

	const { data: allParentsRaw = [] } = useQuery({
		queryKey: ["parents-all"],
		queryFn: () => parentsService.all(),
		staleTime: 0,
	});

	const inv = () => qc.invalidateQueries({ queryKey: ["student-parents", student?.id] });

	const assign = useMutation({
		mutationFn: () =>
			studentParentsService.assign(student!.id, {
				parent_id: selectedParent,
				relationship,
				is_primary: isPrimary,
			}),
		onSuccess: () => {
			toast.success("Padre/tutor asignado");
			setSelectedParent("");
			inv();
		},
		onError: (e: { response?: { data?: { message?: string } } }) =>
			toast.error(e?.response?.data?.message ?? "Error al asignar"),
	});

	const remove = useMutation({
		mutationFn: (id: string) => studentParentsService.remove(student!.id, id),
		onSuccess: () => {
			toast.success("Relación eliminada");
			inv();
		},
		onError: () => toast.error("Error al eliminar"),
	});

	const assignedIds = new Set(assigned.map((a) => a.parent_id));
	const availableParents = allParentsRaw.filter((p) => !assignedIds.has(p.id));

	return (
		<Dialog open={open} onOpenChange={(o) => !o && closeDialog()}>
			<DialogContent className="max-w-lg">
				<DialogHeader>
					<DialogTitle>Padres / tutores — {student?.full_name}</DialogTitle>
				</DialogHeader>

				<div className="space-y-4">
					{loadingAssigned ? (
						<Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
					) : assigned.length === 0 ? (
						<p className="text-sm text-muted-foreground">Sin padres/tutores asignados.</p>
					) : (
						<ul className="space-y-2">
							{assigned.map((a) => (
								<li
									key={a.id}
									className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
								>
									<div className="min-w-0">
										<span className="font-medium">{a.parent_full_name}</span>
										<Badge variant="outline" className="ml-2 text-xs">
											{a.relationship}
										</Badge>
										{a.is_primary && <Star className="ml-1 inline h-3 w-3 text-yellow-500" />}
									</div>
									<Button
										size="icon"
										variant="ghost"
										className="shrink-0 text-destructive hover:text-destructive"
										onClick={() => remove.mutate(a.id)}
										disabled={remove.isPending}
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</li>
							))}
						</ul>
					)}

					<Separator />

					<div className="space-y-3">
						<p className="text-sm font-medium">Agregar padre/tutor</p>
						<div className="space-y-1">
							<Label className="text-xs">Padre/Tutor</Label>
							<ParentSearchCombobox
								parents={availableParents}
								value={selectedParent}
								onChange={setSelectedParent}
							/>
						</div>
						<div className="space-y-1">
							<Label className="text-xs">Parentesco</Label>
							<Select value={relationship} onValueChange={setRelationship}>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{RELATIONSHIPS.map((r) => (
										<SelectItem key={r} value={r}>
											{r.charAt(0).toUpperCase() + r.slice(1)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="flex items-center gap-2">
							<input
								type="checkbox"
								id="is-primary"
								checked={isPrimary}
								onChange={(e) => setIsPrimary(e.target.checked)}
								className="h-4 w-4 rounded border"
							/>
							<Label htmlFor="is-primary" className="text-sm cursor-pointer">
								Tutor principal
							</Label>
						</div>
						<Button
							size="sm"
							disabled={!selectedParent || assign.isPending}
							onClick={() => assign.mutate()}
						>
							{assign.isPending ? (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							) : (
								<UserPlus className="mr-2 h-4 w-4" />
							)}
							Asignar
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};
