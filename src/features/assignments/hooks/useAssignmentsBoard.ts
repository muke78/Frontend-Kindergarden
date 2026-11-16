import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

import { catalogsService } from "@/services/catalogs.service";
import { studentsService } from "@/services/students.service";
import { teachersService } from "@/services/teachers.service";
import type { Student, Teacher } from "@/types/people.types";

type AxiosLikeError = { response?: { data?: { message?: string } } };
const msg = (e: unknown, fallback: string) =>
	(e as AxiosLikeError | undefined)?.response?.data?.message ?? fallback;

export const UNASSIGNED = "__unassigned__";

export type DrawerEntity =
	| { kind: "student"; student: Student }
	| { kind: "teacher"; teacher: Teacher }
	| null;

export const useAssignmentsBoard = () => {
	const qc = useQueryClient();
	const [selected, setSelected] = useState<Set<string>>(new Set());
	const [drawerEntity, setDrawerEntity] = useState<DrawerEntity>(null);

	const groupsQ = useQuery({
		queryKey: ["catalogs", "grade-groups"],
		queryFn: catalogsService.gradeGroups,
	});
	const classroomsQ = useQuery({
		queryKey: ["catalogs", "classrooms"],
		queryFn: catalogsService.classrooms,
	});
	const teachersQ = useQuery({
		queryKey: ["teachers", { limit: 200, board: true }],
		queryFn: () => teachersService.list({ limit: 200 }),
	});
	const studentsQ = useQuery({
		queryKey: ["students", { limit: 200, board: true }],
		queryFn: () => studentsService.list({ limit: 200 }),
	});

	const invalidate = () => {
		qc.invalidateQueries({ queryKey: ["teachers"] });
		qc.invalidateQueries({ queryKey: ["students"] });
	};

	const assignTeacher = useMutation({
		mutationFn: ({ teacherId, groupId }: { teacherId: string; groupId: string | null }) =>
			teachersService.update(teacherId, { grade_group_id: groupId }),
		onSuccess: (_, { groupId }) => {
			toast.success(groupId ? "Maestra asignada al grupo" : "Maestra sin grupo");
			invalidate();
		},
		onError: (e) => toast.error(msg(e, "Error al asignar maestra")),
	});

	const assignClassroom = useMutation({
		mutationFn: ({ teacherId, classroomId }: { teacherId: string; classroomId: string | null }) =>
			teachersService.update(teacherId, { classroom_id: classroomId }),
		onSuccess: (_, { classroomId }) => {
			toast.success(classroomId ? "Aula asignada" : "Maestra sin aula");
			invalidate();
		},
		onError: (e) => toast.error(msg(e, "Error al asignar aula")),
	});

	const moveStudents = useMutation({
		mutationFn: ({ studentIds, groupId }: { studentIds: string[]; groupId: string }) =>
			studentsService.bulkAssignGroup({ student_ids: studentIds, grade_group_id: groupId }),
		onSuccess: (data) => {
			toast.success(`${data.moved} alumno(s) movido(s)`);
			setSelected(new Set());
			setDrawerEntity(null);
			invalidate();
		},
		onError: (e) => toast.error(msg(e, "Error al mover alumnos")),
	});

	const groups = groupsQ.data ?? [];
	const classrooms = useMemo(
		() => (classroomsQ.data ?? []).filter((c) => c.room_type_code === "classroom"),
		[classroomsQ.data],
	);
	const teachers: Teacher[] = teachersQ.data?.rows ?? [];
	const students: Student[] = studentsQ.data?.rows ?? [];

	const teachersByGroup = useMemo(() => {
		const map = new Map<string, Teacher[]>();
		for (const t of teachers) {
			const key = t.grade_group_id ?? UNASSIGNED;
			map.set(key, [...(map.get(key) ?? []), t]);
		}
		return map;
	}, [teachers]);

	const teachersByClassroom = useMemo(() => {
		const map = new Map<string, Teacher[]>();
		for (const t of teachers) {
			const key = t.classroom_id ?? UNASSIGNED;
			map.set(key, [...(map.get(key) ?? []), t]);
		}
		return map;
	}, [teachers]);

	const studentsByGroup = useMemo(() => {
		const map = new Map<string, Student[]>();
		for (const s of students) {
			map.set(s.grade_group_id, [...(map.get(s.grade_group_id) ?? []), s]);
		}
		return map;
	}, [students]);

	const titularByGroup = useMemo(() => {
		const map = new Map<string, Teacher>();
		for (const t of teachers) {
			if (t.grade_group_id) map.set(t.grade_group_id, t);
		}
		return map;
	}, [teachers]);

	const handleDropTeacher = useCallback(
		(teacherId: string, groupId: string) => {
			const teacher = teachers.find((t) => t.id === teacherId);
			if (!teacher) return;
			const target = groupId === UNASSIGNED ? null : groupId;
			if (teacher.grade_group_id === target) return;
			assignTeacher.mutate({ teacherId, groupId: target });
		},
		[teachers, assignTeacher],
	);

	const handleDropClassroom = useCallback(
		(teacherId: string, classroomId: string) => {
			const teacher = teachers.find((t) => t.id === teacherId);
			if (!teacher) return;
			const target = classroomId === UNASSIGNED ? null : classroomId;
			if (teacher.classroom_id === target) return;
			assignClassroom.mutate({ teacherId, classroomId: target });
		},
		[teachers, assignClassroom],
	);

	const handleDropStudent = useCallback(
		(studentId: string, groupId: string) => {
			if (groupId === UNASSIGNED) return;
			const student = students.find((s) => s.id === studentId);
			if (!student || student.grade_group_id === groupId) return;
			// Si el arrastrado forma parte de la selección → mueve todos los seleccionados
			const ids = selected.has(studentId) ? [...selected] : [studentId];
			moveStudents.mutate({ studentIds: ids, groupId });
		},
		[students, selected, moveStudents],
	);

	const toggleSelect = useCallback((studentId: string) => {
		setSelected((prev) => {
			const next = new Set(prev);
			if (next.has(studentId)) next.delete(studentId);
			else next.add(studentId);
			return next;
		});
	}, []);

	const clearSelection = useCallback(() => setSelected(new Set()), []);

	const bulkMove = useCallback(
		(groupId: string) => {
			if (selected.size === 0) return;
			moveStudents.mutate({ studentIds: [...selected], groupId });
		},
		[selected, moveStudents],
	);

	const openStudentDrawer = useCallback(
		(studentId: string) => {
			const student = students.find((s) => s.id === studentId);
			if (student) setDrawerEntity({ kind: "student", student });
		},
		[students],
	);

	const openTeacherDrawer = useCallback(
		(teacherId: string) => {
			const teacher = teachers.find((t) => t.id === teacherId);
			if (teacher) setDrawerEntity({ kind: "teacher", teacher });
		},
		[teachers],
	);

	const closeDrawer = useCallback(() => setDrawerEntity(null), []);

	return {
		groups,
		classrooms,
		teachersByGroup,
		teachersByClassroom,
		studentsByGroup,
		titularByGroup,
		isLoading: groupsQ.isLoading || teachersQ.isLoading || studentsQ.isLoading,
		isPending: assignTeacher.isPending || moveStudents.isPending || assignClassroom.isPending,
		selected,
		toggleSelect,
		clearSelection,
		bulkMove,
		handleDropTeacher,
		handleDropClassroom,
		handleDropStudent,
		drawerEntity,
		openStudentDrawer,
		openTeacherDrawer,
		closeDrawer,
	};
};
