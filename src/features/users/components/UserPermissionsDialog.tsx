import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Loader2, MinusCircle, XCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useUsersUiStore } from "@/features/users/stores/usersUi.store";
import { permissionsService } from "@/services/permissions.service";
import { usersService } from "@/services/users.service";
import type { Action, Module, Permission } from "@/types/rbac.types";

type Effect = "allow" | "deny" | null;

// Cycles: null → allow → deny → null
const nextEffect = (e: Effect): Effect => (e === null ? "allow" : e === "allow" ? "deny" : null);

const PermCell = ({
	effect,
	fromRole,
	onClick,
}: {
	effect: Effect;
	fromRole: boolean;
	onClick: () => void;
}) => {
	if (effect === "allow")
		return (
			<button
				type="button"
				onClick={onClick}
				title="Override: Permitir → click para denegar"
				className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 text-xs font-medium transition-colors"
			>
				<CheckCircle2 className="h-3.5 w-3.5" /> Allow
			</button>
		);
	if (effect === "deny")
		return (
			<button
				type="button"
				onClick={onClick}
				title="Override: Denegar → click para quitar"
				className="flex items-center gap-1 px-2 py-1 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 hover:bg-rose-500/25 text-xs font-medium transition-colors"
			>
				<XCircle className="h-3.5 w-3.5" /> Deny
			</button>
		);
	// No override — show role baseline hint
	return (
		<button
			type="button"
			onClick={onClick}
			title={fromRole ? "Del rol (click para override)" : "Sin permiso (click para allow)"}
			className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors border
        ${
					fromRole
						? "border-sky-400/30 bg-sky-500/10 text-sky-600 dark:text-sky-400 hover:bg-sky-500/20"
						: "border-muted-foreground/20 bg-muted/30 text-muted-foreground/50 hover:bg-muted/60"
				}`}
		>
			<MinusCircle className="h-3.5 w-3.5" />
			{fromRole ? "Rol" : "—"}
		</button>
	);
};

const Legend = () => (
	<div className="flex items-center gap-4 text-xs text-muted-foreground py-2 px-1">
		<span className="font-medium">Leyenda:</span>
		<span className="flex items-center gap-1">
			<span className="inline-block w-3 h-3 rounded-full bg-sky-500/30 border border-sky-400/30" />{" "}
			Del rol (sin override)
		</span>
		<span className="flex items-center gap-1">
			<span className="inline-block w-3 h-3 rounded-full bg-emerald-500/30 border border-emerald-400/30" />{" "}
			Override Allow
		</span>
		<span className="flex items-center gap-1">
			<span className="inline-block w-3 h-3 rounded-full bg-rose-500/30 border border-rose-400/30" />{" "}
			Override Deny
		</span>
		<span className="flex items-center gap-1">
			<span className="inline-block w-3 h-3 rounded-full bg-muted border border-muted-foreground/20" />{" "}
			Sin permiso
		</span>
	</div>
);

const MatrixTable = ({
	modules,
	actions,
	permissions,
	overrides,
	roleSet,
	onToggle,
}: {
	modules: Module[];
	actions: Action[];
	permissions: Permission[];
	overrides: Record<string, Effect>;
	roleSet: Set<string>;
	onToggle: (permId: string) => void;
}) => (
	<div className="overflow-x-auto">
		<table className="w-full text-sm border-separate border-spacing-0">
			<thead className="sticky top-0 z-10">
				<tr>
					<th className="text-left py-2.5 px-3 font-semibold text-xs uppercase tracking-wide text-muted-foreground bg-muted/60 rounded-tl-lg border-b border-border w-36">
						Módulo
					</th>
					{actions.map((a) => (
						<th
							key={a.id}
							className="py-2.5 px-2 font-semibold text-xs uppercase tracking-wide text-muted-foreground bg-muted/60 border-b border-border text-center capitalize last:rounded-tr-lg"
						>
							{a.name}
						</th>
					))}
				</tr>
			</thead>
			<tbody>
				{modules.map((mod, i) => (
					<tr
						key={mod.id}
						className={`group ${i % 2 === 0 ? "bg-background" : "bg-muted/20"} hover:bg-accent/30 transition-colors`}
					>
						<td className="py-2.5 px-3 font-medium text-sm border-b border-border/50 align-middle">
							{mod.name}
						</td>
						{actions.map((act) => {
							const perm = permissions.find(
								(p) => p.module_id === mod.id && p.action_id === act.id,
							);
							return (
								<td
									key={act.id}
									className="py-2 px-2 text-center border-b border-border/50 align-middle"
								>
									{perm ? (
										<div className="flex justify-center">
											<PermCell
												effect={overrides[perm.id] ?? null}
												fromRole={roleSet.has(`${mod.code}.${act.code}`)}
												onClick={() => onToggle(perm.id)}
											/>
										</div>
									) : (
										<span className="text-muted-foreground/30 text-base">·</span>
									)}
								</td>
							);
						})}
					</tr>
				))}
			</tbody>
		</table>
	</div>
);

export const UserPermissionsDialog = () => {
	const dialog = useUsersUiStore((s) => s.dialog);
	const closeDialog = useUsersUiStore((s) => s.closeDialog);
	const qc = useQueryClient();

	const open = dialog?.kind === "permissions";
	const user = open ? dialog.user : null;

	const matrix = useQuery({
		queryKey: ["permissions", "matrix"],
		queryFn: permissionsService.matrix,
		enabled: open,
	});
	const userPerms = useQuery({
		queryKey: ["users", user?.id, "permissions"],
		queryFn: () => usersService.getPermissions(user!.id),
		enabled: open && Boolean(user),
	});

	const [overrides, setOverrides] = useState<Record<string, Effect>>({});

	useEffect(() => {
		if (!userPerms.data) return;
		const map: Record<string, Effect> = {};
		for (const o of userPerms.data.overrides) map[o.permission_id] = o.effect;
		setOverrides(map);
	}, [userPerms.data]);

	const roleSet = new Set(
		userPerms.data?.effective
			.filter((e) => e.origin === "role" && e.effect === "allow")
			.map((e) => `${e.module_code}.${e.action_code}`) ?? [],
	);

	const toggle = useCallback((permId: string) => {
		setOverrides((prev) => ({ ...prev, [permId]: nextEffect(prev[permId] ?? null) }));
	}, []);

	const overrideCount = Object.values(overrides).filter(Boolean).length;

	const save = useMutation({
		mutationFn: () => {
			const payload = Object.entries(overrides)
				.filter(([, e]) => e !== null)
				.map(([permission_id, effect]) => ({ permission_id, effect: effect as "allow" | "deny" }));
			return usersService.replacePermissions(user!.id, payload);
		},
		onSuccess: () => {
			toast.success("Permisos guardados");
			qc.invalidateQueries({ queryKey: ["users", user?.id, "permissions"] });
			closeDialog();
		},
		onError: () => toast.error("Error al guardar permisos"),
	});

	const isLoading = matrix.isLoading || userPerms.isLoading;

	return (
		<Dialog open={open} onOpenChange={(o) => !o && closeDialog()}>
			<DialogContent className="max-w-4xl max-h-[90vh] flex flex-col gap-0 p-0 overflow-hidden">
				{/* Header */}
				<div className="px-6 pt-6 pb-3 border-b border-border">
					<DialogTitle className="text-lg font-semibold">
						Permisos de <span className="text-amber-600 dark:text-amber-400">{user?.name}</span>
					</DialogTitle>
					<p className="text-xs text-muted-foreground mt-0.5">
						Los overrides sobreescriben lo que da el rol. Click en cada celda para ciclar: Rol →
						Allow → Deny → Rol.
					</p>
					<Legend />
				</div>

				{/* Body */}
				<div className="flex-1 overflow-y-auto px-6 py-3">
					{isLoading && (
						<div className="flex flex-col items-center justify-center py-16 gap-3">
							<Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
							<p className="text-sm text-muted-foreground">Cargando permisos...</p>
						</div>
					)}
					{!isLoading && matrix.data && (
						<MatrixTable
							modules={matrix.data.modules}
							actions={matrix.data.actions}
							permissions={matrix.data.permissions}
							overrides={overrides}
							roleSet={roleSet}
							onToggle={toggle}
						/>
					)}
				</div>

				{/* Footer */}
				<div className="px-6 py-4 border-t border-border bg-muted/30 flex items-center justify-between">
					<span className="text-xs text-muted-foreground">
						{overrideCount > 0 ? (
							<span className="text-foreground font-medium">
								{overrideCount} override{overrideCount > 1 ? "s" : ""} activo
								{overrideCount > 1 ? "s" : ""}
							</span>
						) : (
							"Sin overrides — hereda todo del rol"
						)}
					</span>
					<div className="flex gap-2">
						<Button variant="outline" onClick={closeDialog} disabled={save.isPending}>
							Cancelar
						</Button>
						<Button onClick={() => save.mutate()} disabled={save.isPending || isLoading}>
							{save.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							Guardar cambios
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};
