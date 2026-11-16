import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Loader2, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DatePickerField } from "@/components/common/DatePickerField";
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
import { catalogsService } from "@/services/catalogs.service";
import { studentTeacherHistoryService } from "@/services/studentTeacherHistory.service";
import { teachersService } from "@/services/teachers.service";

const fmt = (d: string | null) =>
	d ? format(new Date(d), "d MMM yyyy", { locale: es }) : "actualidad";

export const AssignTeacherDialog = () => {
	const dialog = useStudentsUiStore((s) => s.dialog);
	const closeDialog = useStudentsUiStore((s) => s.closeDialog);
	const qc = useQueryClient();

	const open = dialog?.kind === "assign-teacher";
	const student = open ? dialog.student : null;

	const [teacherId, setTeacherId] = useState("");
	const [gradeGroupId, setGradeGroupId] = useState("");
	const [startDate, setStartDate] = useState("");

	const { data: history = [], isLoading: loadingHistory } = useQuery({
		queryKey: ["student-teacher-history", student?.id],
		queryFn: () => studentTeacherHistoryService.list(student!.id),
		enabled: !!student?.id,
	});

	const { data: teachers } = useQuery({
		queryKey: ["teachers-all"],
		queryFn: () => teachersService.list({ page: 1, limit: 200 }),
	});

	const { data: gradeGroups } = useQuery({
		queryKey: ["catalogs", "grade-groups"],
		queryFn: catalogsService.gradeGroups,
	});

	const inv = () => qc.invalidateQueries({ queryKey: ["student-teacher-history", student?.id] });

	const assign = useMutation({
		mutationFn: () =>
			studentTeacherHistoryService.assign(student!.id, {
				teacher_id: teacherId,
				grade_group_id: gradeGroupId,
				start_date: startDate,
			}),
		onSuccess: () => {
			toast.success("Maestro asignado");
			setTeacherId("");
			setGradeGroupId("");
			setStartDate("");
			inv();
		},
		onError: (e: { response?: { data?: { message?: string } } }) =>
			toast.error(e?.response?.data?.message ?? "Error al asignar"),
	});

	return (
		<Dialog open={open} onOpenChange={(o) => !o && closeDialog()}>
			<DialogContent className="max-w-lg">
				<DialogHeader>
					<DialogTitle>Historial de maestros — {student?.full_name}</DialogTitle>
				</DialogHeader>

				<div className="space-y-4">
					{loadingHistory ? (
						<Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
					) : history.length === 0 ? (
						<p className="text-sm text-muted-foreground">Sin historial de maestros.</p>
					) : (
						<ul className="space-y-2">
							{history.map((h) => (
								<li
									key={h.id}
									className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
								>
									<div>
										<span className="font-medium">{h.teacher_full_name}</span>
										<span className="ml-2 text-xs text-muted-foreground">
											{h.grade_group_label}
										</span>
									</div>
									<div className="flex items-center gap-2 text-xs text-muted-foreground">
										{fmt(h.start_date)} → {fmt(h.end_date)}
										{!h.end_date && (
											<Badge variant="default" className="text-[10px]">
												Actual
											</Badge>
										)}
									</div>
								</li>
							))}
						</ul>
					)}

					<Separator />

					<div className="space-y-3">
						<p className="text-sm font-medium">Asignar nuevo maestro</p>
						<div className="grid gap-2 sm:grid-cols-2">
							<div className="space-y-1">
								<Label className="text-xs">Maestro</Label>
								<Select value={teacherId} onValueChange={setTeacherId}>
									<SelectTrigger>
										<SelectValue placeholder="Selecciona..." />
									</SelectTrigger>
									<SelectContent>
										{teachers?.rows.map((t) => (
											<SelectItem key={t.id} value={t.id}>
												{t.full_name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-1">
								<Label className="text-xs">Grupo</Label>
								<Select value={gradeGroupId} onValueChange={setGradeGroupId}>
									<SelectTrigger>
										<SelectValue placeholder="Selecciona..." />
									</SelectTrigger>
									<SelectContent>
										{gradeGroups?.map((g) => (
											<SelectItem key={g.id} value={g.id}>
												{g.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
						<div className="space-y-1">
							<Label className="text-xs">Fecha de inicio</Label>
							<DatePickerField
								value={startDate}
								onChange={setStartDate}
								placeholder="Selecciona fecha"
							/>
						</div>
						<Button
							size="sm"
							disabled={!teacherId || !gradeGroupId || !startDate || assign.isPending}
							onClick={() => assign.mutate()}
						>
							{assign.isPending ? (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							) : (
								<UserPlus className="mr-2 h-4 w-4" />
							)}
							Asignar maestro
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};
