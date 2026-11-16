import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Minus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useRolesUiStore } from "@/features/roles/stores/rolesUi.store";
import { permissionsService } from "@/services/permissions.service";
import { rolesService } from "@/services/roles.service";

export const RolePermissionsDialog = () => {
	const dialog = useRolesUiStore((s) => s.dialog);
	const closeDialog = useRolesUiStore((s) => s.closeDialog);
	const qc = useQueryClient();

	const open = dialog?.kind === "permissions";
	const role = open ? dialog.role : null;

	const matrix = useQuery({
		queryKey: ["permissions", "matrix"],
		queryFn: permissionsService.matrix,
		enabled: open,
	});
	const rolePerms = useQuery({
		queryKey: ["roles", role?.id, "permissions"],
		queryFn: () => rolesService.getPermissions(role!.id),
		enabled: open && Boolean(role),
	});

	const [selected, setSelected] = useState<Set<string>>(new Set());

	useEffect(() => {
		if (rolePerms.data) setSelected(new Set(rolePerms.data.map((p) => p.id)));
	}, [rolePerms.data]);

	const save = useMutation({
		mutationFn: () => rolesService.replacePermissions(role!.id, Array.from(selected)),
		onSuccess: () => {
			toast.success("Permisos actualizados");
			qc.invalidateQueries({ queryKey: ["roles", role?.id, "permissions"] });
			closeDialog();
		},
		onError: () => toast.error("Error al guardar permisos"),
	});

	const toggle = (id: string) =>
		setSelected((prev) => {
			const s = new Set(prev);
			s.has(id) ? s.delete(id) : s.add(id);
			return s;
		});

	const isLoading = matrix.isLoading || rolePerms.isLoading;

	return (
		<Dialog open={open} onOpenChange={(o) => !o && closeDialog()}>
			<DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
				<DialogHeader>
					<DialogTitle>
						Permisos — <span className="text-amber-600">{role?.name}</span>
					</DialogTitle>
					<p className="text-xs text-muted-foreground">Marca los permisos que tendrá este rol.</p>
				</DialogHeader>
				<div className="overflow-y-auto flex-1 pr-1">
					{isLoading && (
						<div className="flex justify-center py-10">
							<Loader2 className="h-6 w-6 animate-spin" />
						</div>
					)}
					{!isLoading && matrix.data && (
						<table className="w-full text-sm border-collapse">
							<thead className="sticky top-0 bg-background z-10">
								<tr className="border-b">
									<th className="text-left py-2 font-medium text-muted-foreground w-40">Módulo</th>
									{matrix.data.actions.map((a) => (
										<th
											key={a.id}
											className="py-2 font-medium text-muted-foreground capitalize text-center px-2"
										>
											{a.name}
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{matrix.data.modules.map((mod) => (
									<tr key={mod.id} className="border-b hover:bg-muted/30">
										<td className="py-2.5 font-medium pl-1">{mod.name}</td>
										{matrix.data.actions.map((act) => {
											const perm = matrix.data.permissions.find(
												(p) => p.module_id === mod.id && p.action_id === act.id,
											);
											if (!perm)
												return (
													<td key={act.id} className="py-2 text-center">
														<Minus className="h-3 w-3 mx-auto text-muted-foreground/30" />
													</td>
												);
											return (
												<td key={act.id} className="py-2 text-center">
													<Checkbox
														checked={selected.has(perm.id)}
														onCheckedChange={() => toggle(perm.id)}
														aria-label={`${mod.name} - ${act.name}`}
													/>
												</td>
											);
										})}
									</tr>
								))}
							</tbody>
						</table>
					)}
				</div>
				<DialogFooter className="pt-2">
					<Button variant="outline" onClick={closeDialog}>
						Cancelar
					</Button>
					<Button onClick={() => save.mutate()} disabled={save.isPending || isLoading}>
						{save.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						Guardar permisos
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
