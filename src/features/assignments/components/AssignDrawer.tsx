import { useQuery } from "@tanstack/react-query";
import { ArrowRight, GraduationCap, Loader2, Phone, UserX } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import {
	UNASSIGNED,
	type useAssignmentsBoard,
} from "@/features/assignments/hooks/useAssignmentsBoard";
import { studentParentsService } from "@/services/studentParents.service";

type Board = ReturnType<typeof useAssignmentsBoard>;

const Row = ({ label, value }: { label: string; value?: string | number | null }) => (
	<div className="flex justify-between gap-3 text-sm">
		<span className="shrink-0 text-muted-foreground">{label}</span>
		<span className="truncate text-right font-medium">{value || "—"}</span>
	</div>
);

export const AssignDrawer = ({ board }: { board: Board }) => {
	const { drawerEntity, closeDrawer, groups, classrooms, titularByGroup, isPending } = board;
	const [targetGroup, setTargetGroup] = useState("");
	const [targetRoom, setTargetRoom] = useState("");

	const student = drawerEntity?.kind === "student" ? drawerEntity.student : null;
	const teacher = drawerEntity?.kind === "teacher" ? drawerEntity.teacher : null;

	// Reset selects al abrir otra entidad
	useEffect(() => {
		setTargetGroup(
			teacher ? (teacher.grade_group_id ?? UNASSIGNED) : (student?.grade_group_id ?? ""),
		);
		setTargetRoom(teacher?.classroom_id ?? UNASSIGNED);
	}, [student, teacher]);

	const parentsQ = useQuery({
		queryKey: ["student-parents", student?.id],
		queryFn: () => studentParentsService.list(student?.id ?? ""),
		enabled: Boolean(student),
	});

	const titular = student ? titularByGroup.get(student.grade_group_id) : null;

	return (
		<Sheet open={Boolean(drawerEntity)} onOpenChange={(o) => !o && closeDrawer()}>
			<SheetContent className="w-full overflow-y-auto sm:max-w-md">
				{student && (
					<>
						<SheetHeader>
							<SheetTitle className="truncate">{student.full_name}</SheetTitle>
							<SheetDescription>Alumno · {student.curp}</SheetDescription>
						</SheetHeader>

						<div className="space-y-5 px-4 pb-6">
							<div className="flex flex-wrap gap-1.5">
								<Badge>{student.grade_group_label}</Badge>
								<Badge variant="secondary">{student.work_shift_name}</Badge>
								<Badge variant="outline">{student.status_name}</Badge>
							</div>

							<div className="space-y-1.5">
								<Row label="Nacimiento" value={student.date_of_birth?.split("T")[0]} />
								<Row label="Inscripción" value={student.enrollment_date?.split("T")[0]} />
								<Row label="Alergias" value={student.allergies} />
								<Row
									label="Domicilio"
									value={`${student.street}, ${student.suburb}, ${student.state}`}
								/>
								<Row label="Emergencia" value={student.emergency_contact} />
							</div>

							<Separator />

							<div className="space-y-1.5">
								<p className="text-sm font-semibold">Maestra actual</p>
								{titular ? (
									<p className="flex items-center gap-1.5 text-sm text-primary">
										<GraduationCap className="h-4 w-4" /> {titular.full_name}
									</p>
								) : (
									<p className="text-sm text-muted-foreground">
										El grupo no tiene maestra titular
									</p>
								)}
							</div>

							<div className="space-y-1.5">
								<p className="text-sm font-semibold">Tutores</p>
								{parentsQ.isLoading && (
									<Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
								)}
								{(parentsQ.data ?? []).map((p) => (
									<div key={p.id} className="rounded-lg border px-3 py-2 text-sm">
										<p className="font-medium">{p.parent_full_name}</p>
										<p className="flex items-center gap-1 text-xs text-muted-foreground">
											{p.relationship}
											{p.is_primary ? " · Principal" : ""} <Phone className="ml-1 h-3 w-3" />
											{p.parent_phone}
										</p>
									</div>
								))}
								{!parentsQ.isLoading && (parentsQ.data ?? []).length === 0 && (
									<p className="text-sm text-muted-foreground">
										Sin tutores vinculados. Usa la pestaña Familias.
									</p>
								)}
							</div>

							<Separator />

							<div className="space-y-2">
								<Label>Mover a otro grupo</Label>
								<div className="flex gap-2">
									<Select value={targetGroup} onValueChange={setTargetGroup}>
										<SelectTrigger className="flex-1">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{groups.map((g) => (
												<SelectItem key={g.id} value={g.id}>
													{g.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<Button
										disabled={isPending || targetGroup === student.grade_group_id}
										onClick={() => board.handleDropStudent(student.id, targetGroup)}
									>
										{isPending ? (
											<Loader2 className="h-4 w-4 animate-spin" />
										) : (
											<ArrowRight className="h-4 w-4" />
										)}
									</Button>
								</div>
								<p className="text-xs text-muted-foreground">
									Al mover, el historial de maestra se actualiza solo.
								</p>
							</div>
						</div>
					</>
				)}

				{teacher && (
					<>
						<SheetHeader>
							<SheetTitle className="truncate">{teacher.full_name}</SheetTitle>
							<SheetDescription>Maestra · {teacher.curp}</SheetDescription>
						</SheetHeader>

						<div className="space-y-5 px-4 pb-6">
							<div className="flex flex-wrap gap-1.5">
								<Badge>{teacher.grade_group_label ?? "Sin grupo"}</Badge>
								<Badge variant="secondary">{teacher.work_shift_name}</Badge>
								<Badge variant="outline">
									{teacher.students_in_charge} alumno(s)
								</Badge>
							</div>

							<div className="space-y-1.5">
								<Row label="Email" value={teacher.email} />
								<Row label="Teléfono" value={teacher.phone} />
								<Row label="Ciclo" value={teacher.school_year} />
								<Row label="Nivel" value={teacher.education_level_name} />
							</div>

							<Separator />

							<div className="space-y-2">
								<Label>Grupo titular</Label>
								<div className="flex gap-2">
									<Select value={targetGroup} onValueChange={setTargetGroup}>
										<SelectTrigger className="flex-1">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value={UNASSIGNED}>
												<span className="flex items-center gap-1.5">
													<UserX className="h-3.5 w-3.5" /> Sin grupo
												</span>
											</SelectItem>
											{groups.map((g) => (
												<SelectItem key={g.id} value={g.id}>
													{g.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<Button
										disabled={
											isPending || targetGroup === (teacher.grade_group_id ?? UNASSIGNED)
										}
										onClick={() => board.handleDropTeacher(teacher.id, targetGroup)}
									>
										{isPending ? (
											<Loader2 className="h-4 w-4 animate-spin" />
										) : (
											<ArrowRight className="h-4 w-4" />
										)}
									</Button>
								</div>
							</div>

							<div className="space-y-2">
								<Label>Aula asignada</Label>
								<div className="flex gap-2">
									<Select value={targetRoom} onValueChange={setTargetRoom}>
										<SelectTrigger className="flex-1">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value={UNASSIGNED}>
												<span className="flex items-center gap-1.5">
													<UserX className="h-3.5 w-3.5" /> Sin aula
												</span>
											</SelectItem>
											{classrooms.map((c) => (
												<SelectItem key={c.id} value={c.id}>
													{c.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<Button
										disabled={isPending || targetRoom === (teacher.classroom_id ?? UNASSIGNED)}
										onClick={() => board.handleDropClassroom(teacher.id, targetRoom)}
									>
										{isPending ? (
											<Loader2 className="h-4 w-4 animate-spin" />
										) : (
											<ArrowRight className="h-4 w-4" />
										)}
									</Button>
								</div>
								<p className="text-xs text-muted-foreground">
									Los activos e inventario del aula se consultan en sus módulos filtrando por
									aula.
								</p>
							</div>
						</div>
					</>
				)}
			</SheetContent>
		</Sheet>
	);
};
