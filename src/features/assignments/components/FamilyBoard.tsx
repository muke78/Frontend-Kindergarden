import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { GraduationCap, Loader2, Phone, Search, UserRoundX, Users, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { DraggableCard } from "@/features/assignments/components/DraggableCard";
import type { FamilyParent, useFamilyBoard } from "@/features/assignments/hooks/useFamilyBoard";
import {
	DEFAULT_RELATIONSHIP,
	RELATIONSHIP_OPTIONS,
	relationshipLabel,
} from "@/features/parents/relationships";
import { cn } from "@/lib/utils";

const ParentDropCard = ({
	parent,
	onDropStudent,
	onUnlink,
}: {
	parent: FamilyParent;
	onDropStudent: (studentId: string, parentId: string) => void;
	onUnlink: (studentId: string, relationId: string) => void;
}) => {
	const ref = useRef<HTMLDivElement>(null);
	const [isOver, setIsOver] = useState(false);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		return dropTargetForElements({
			element: el,
			canDrop: ({ source }) => source.data.type === "family-student",
			onDragEnter: () => setIsOver(true),
			onDragLeave: () => setIsOver(false),
			onDrop: ({ source }) => {
				setIsOver(false);
				const id = source.data.id;
				if (typeof id === "string") onDropStudent(id, parent.parent_id);
			},
		});
	}, [parent.parent_id, onDropStudent]);

	return (
		<div
			ref={ref}
			className={cn(
				"flex min-w-0 flex-col rounded-xl border bg-card/60 transition-all duration-150",
				isOver && "ring-2 ring-primary border-primary bg-primary/5 scale-[1.01]",
			)}
		>
			<div className="border-b px-3 py-2.5">
				<p className="flex items-center gap-1.5 truncate text-sm font-semibold">
					<Users className="h-3.5 w-3.5 shrink-0 text-primary" />
					{parent.parent_full_name}
				</p>
				<p className="flex items-center gap-1 text-xs text-muted-foreground">
					<Phone className="h-3 w-3" /> {parent.parent_phone}
					{parent.occupation ? ` · ${parent.occupation}` : ""}
				</p>
			</div>
			<div className="flex flex-col gap-2 p-2 min-h-[90px]">
				{parent.children.map((c) => (
					<div
						key={c.relation_id}
						className="flex items-start gap-2 rounded-lg border bg-card px-2.5 py-2 text-sm"
					>
						<div className="min-w-0 flex-1">
							<div className="flex items-center gap-1.5">
								<p className="truncate font-medium">{c.student_full_name}</p>
								{c.is_primary && (
									<Badge variant="secondary" className="h-4 px-1 text-[10px]">
										Principal
									</Badge>
								)}
							</div>
							<p className="truncate text-xs text-muted-foreground">
								{relationshipLabel(c.relationship)} · {c.grade_group_label ?? "Sin grupo"}
							</p>
							{c.teacher_full_name && (
								<p className="flex items-center gap-1 truncate text-xs text-primary">
									<GraduationCap className="h-3 w-3 shrink-0" />
									{c.teacher_full_name}
								</p>
							)}
						</div>
						<Button
							size="icon"
							variant="ghost"
							className="h-6 w-6 shrink-0 text-muted-foreground hover:text-destructive"
							title="Desvincular"
							onClick={() => onUnlink(c.student_id, c.relation_id)}
						>
							<X className="h-3.5 w-3.5" />
						</Button>
					</div>
				))}
				{parent.children.length === 0 && (
					<p className="py-5 text-center text-xs text-muted-foreground">
						Arrastra un alumno aquí para vincularlo
					</p>
				)}
			</div>
		</div>
	);
};

type Props = {
	family: ReturnType<typeof useFamilyBoard>;
};

export const FamilyBoard = ({ family }: Props) => {
	const [relationship, setRelationship] = useState<string>(DEFAULT_RELATIONSHIP);
	const [isPrimary, setIsPrimary] = useState(true);

	if (family.isLoading) {
		return (
			<div className="flex items-center justify-center py-16">
				<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-4 lg:h-[calc(100vh-19rem)] lg:flex-row">
			{/* Pool de alumnos */}
			<div className="flex w-full shrink-0 flex-col rounded-xl border bg-card/60 lg:h-full lg:w-72">
				<div className="space-y-2 border-b p-3">
					<p className="text-sm font-semibold">Alumnos ({family.studentPool.length})</p>
					<div className="relative">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Buscar alumno..."
							className="h-9 pl-8"
							value={family.poolSearch}
							onChange={(e) => family.setPoolSearch(e.target.value)}
						/>
					</div>
				</div>
				<div className="flex max-h-64 flex-1 flex-col gap-2 overflow-y-auto p-2 lg:max-h-none">
					{family.studentPool.map((s) => (
						<DraggableCard key={s.id} itemId={s.id} type="family-student">
							<div className="min-w-0 flex-1">
								<p className="truncate font-medium">{s.full_name}</p>
								<p className="truncate text-xs text-muted-foreground">{s.grade_group_label}</p>
							</div>
						</DraggableCard>
					))}
					{family.studentPool.length === 0 && (
						<p className="py-6 text-center text-xs text-muted-foreground">Sin resultados</p>
					)}
				</div>
			</div>

			{/* Columna de tutores: toolbar fija + grid con scroll propio */}
			<div className="flex min-w-0 flex-1 flex-col gap-3 lg:h-full">
				<div className="flex flex-wrap items-center gap-2">
					<div className="relative min-w-52 flex-1">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Buscar tutor o hijo..."
							className="h-9 pl-8"
							value={family.parentSearch}
							onChange={(e) => family.setParentSearch(e.target.value)}
						/>
					</div>
					<Button
						type="button"
						variant={family.onlyUnlinked ? "default" : "outline"}
						size="sm"
						className="h-9 gap-1.5"
						onClick={() => family.setOnlyUnlinked(!family.onlyUnlinked)}
					>
						<UserRoundX className="h-3.5 w-3.5" />
						Sin hijos
					</Button>
					<span className="ml-auto text-xs text-muted-foreground tabular-nums">
						{family.parents.length} de {family.totalParents} tutores
					</span>
				</div>

				<div className="flex-1 overflow-y-auto rounded-xl">
					<div className="grid content-start gap-3 grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
						{family.parents.map((p) => (
							<ParentDropCard
								key={p.parent_id}
								parent={p}
								onDropStudent={family.handleDropOnParent}
								onUnlink={family.unlink}
							/>
						))}
						{family.parents.length === 0 && (
							<p className="col-span-full py-10 text-center text-sm text-muted-foreground">
								{family.totalParents === 0
									? "Sin tutores registrados. Crea uno desde el módulo Padres/Tutores."
									: "Ningún tutor coincide con el filtro."}
							</p>
						)}
					</div>
				</div>
			</div>

			{/* Confirmación de vínculo */}
			<Dialog open={Boolean(family.pendingLink)} onOpenChange={(o) => !o && family.cancelLink()}>
				<DialogContent className="max-w-sm">
					<DialogHeader>
						<DialogTitle>Vincular hijo</DialogTitle>
					</DialogHeader>
					{family.pendingLink && (
						<div className="space-y-4">
							<p className="text-sm">
								<span className="font-medium">{family.pendingLink.studentName}</span> →{" "}
								<span className="font-medium">{family.pendingLink.parentName}</span>
							</p>
							<div className="space-y-1">
								<Label>Parentesco</Label>
								<Select value={relationship} onValueChange={setRelationship}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{RELATIONSHIP_OPTIONS.map((r) => (
											<SelectItem key={r.value} value={r.value}>
												{r.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="flex items-center gap-2 text-sm">
								<Checkbox
									id="link-primary"
									checked={isPrimary}
									onCheckedChange={(v) => setIsPrimary(Boolean(v))}
								/>
								<Label htmlFor="link-primary" className="cursor-pointer font-normal">
									Contacto principal del alumno
								</Label>
							</div>
						</div>
					)}
					<DialogFooter>
						<Button variant="outline" onClick={family.cancelLink}>
							Cancelar
						</Button>
						<Button
							disabled={family.isPending}
							onClick={() => family.confirmLink(relationship, isPrimary)}
						>
							{family.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							Vincular
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};
