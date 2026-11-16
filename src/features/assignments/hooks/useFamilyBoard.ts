import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

import { type FamilyBoardRow, parentsService } from "@/services/parents.service";
import { studentParentsService } from "@/services/studentParents.service";
import { studentsService } from "@/services/students.service";

type AxiosLikeError = { response?: { data?: { message?: string } } };
const msg = (e: unknown, fallback: string) =>
	(e as AxiosLikeError | undefined)?.response?.data?.message ?? fallback;

export type FamilyChild = {
	relation_id: string;
	student_id: string;
	student_full_name: string;
	grade_group_label: string | null;
	teacher_full_name: string | null;
	relationship: string;
	is_primary: boolean;
};

export type FamilyParent = {
	parent_id: string;
	parent_full_name: string;
	parent_phone: string;
	occupation: string | null;
	children: FamilyChild[];
};

export type PendingLink = {
	studentId: string;
	studentName: string;
	parentId: string;
	parentName: string;
} | null;

export const useFamilyBoard = () => {
	const qc = useQueryClient();
	const [pendingLink, setPendingLink] = useState<PendingLink>(null);
	const [poolSearch, setPoolSearch] = useState("");
	const [parentSearch, setParentSearch] = useState("");
	const [onlyUnlinked, setOnlyUnlinked] = useState(false);

	const familyQ = useQuery({
		queryKey: ["parents", "family-board"],
		queryFn: parentsService.familyBoard,
	});
	const studentsQ = useQuery({
		queryKey: ["students", { limit: 200, board: true }],
		queryFn: () => studentsService.list({ limit: 200 }),
	});

	const invalidate = () => {
		qc.invalidateQueries({ queryKey: ["parents"] });
		qc.invalidateQueries({ queryKey: ["students"] });
	};

	const link = useMutation({
		mutationFn: ({
			studentId,
			parentId,
			relationship,
			isPrimary,
		}: {
			studentId: string;
			parentId: string;
			relationship: string;
			isPrimary: boolean;
		}) =>
			studentParentsService.assign(studentId, {
				parent_id: parentId,
				relationship,
				is_primary: isPrimary,
			}),
		onSuccess: () => {
			toast.success("Hijo vinculado al tutor");
			setPendingLink(null);
			invalidate();
		},
		onError: (e) => toast.error(msg(e, "Error al vincular")),
	});

	const unlink = useMutation({
		mutationFn: ({ studentId, relationId }: { studentId: string; relationId: string }) =>
			studentParentsService.remove(studentId, relationId),
		onSuccess: () => {
			toast.success("Vínculo eliminado");
			invalidate();
		},
		onError: (e) => toast.error(msg(e, "Error al desvincular")),
	});

	const parents = useMemo<FamilyParent[]>(() => {
		const map = new Map<string, FamilyParent>();
		for (const row of (familyQ.data ?? []) as FamilyBoardRow[]) {
			let p = map.get(row.parent_id);
			if (!p) {
				p = {
					parent_id: row.parent_id,
					parent_full_name: row.parent_full_name,
					parent_phone: row.parent_phone,
					occupation: row.occupation,
					children: [],
				};
				map.set(row.parent_id, p);
			}
			if (row.relation_id && row.student_id) {
				p.children.push({
					relation_id: row.relation_id,
					student_id: row.student_id,
					student_full_name: row.student_full_name ?? "",
					grade_group_label: row.grade_group_label,
					teacher_full_name: row.teacher_full_name,
					relationship: row.relationship ?? "Tutor legal",
					is_primary: Boolean(row.is_primary),
				});
			}
		}
		return [...map.values()];
	}, [familyQ.data]);

	const studentPool = useMemo(() => {
		const all = studentsQ.data?.rows ?? [];
		const q = poolSearch.trim().toLowerCase();
		return q ? all.filter((s) => s.full_name.toLowerCase().includes(q)) : all;
	}, [studentsQ.data, poolSearch]);

	const filteredParents = useMemo(() => {
		const q = parentSearch.trim().toLowerCase();
		return parents.filter((p) => {
			if (onlyUnlinked && p.children.length > 0) return false;
			if (!q) return true;
			return (
				p.parent_full_name.toLowerCase().includes(q) ||
				p.children.some((c) => c.student_full_name.toLowerCase().includes(q))
			);
		});
	}, [parents, parentSearch, onlyUnlinked]);

	const handleDropOnParent = useCallback(
		(studentId: string, parentId: string) => {
			const student = (studentsQ.data?.rows ?? []).find((s) => s.id === studentId);
			const parent = parents.find((p) => p.parent_id === parentId);
			if (!student || !parent) return;
			if (parent.children.some((c) => c.student_id === studentId)) {
				toast.info("Ese alumno ya está vinculado a este tutor");
				return;
			}
			setPendingLink({
				studentId,
				studentName: student.full_name,
				parentId,
				parentName: parent.parent_full_name,
			});
		},
		[studentsQ.data, parents],
	);

	const confirmLink = useCallback(
		(relationship: string, isPrimary: boolean) => {
			if (!pendingLink) return;
			link.mutate({
				studentId: pendingLink.studentId,
				parentId: pendingLink.parentId,
				relationship,
				isPrimary,
			});
		},
		[pendingLink, link],
	);

	return {
		parents: filteredParents,
		totalParents: parents.length,
		studentPool,
		poolSearch,
		setPoolSearch,
		parentSearch,
		setParentSearch,
		onlyUnlinked,
		setOnlyUnlinked,
		isLoading: familyQ.isLoading || studentsQ.isLoading,
		isPending: link.isPending || unlink.isPending,
		pendingLink,
		cancelLink: () => setPendingLink(null),
		confirmLink,
		handleDropOnParent,
		unlink: (studentId: string, relationId: string) => unlink.mutate({ studentId, relationId }),
	};
};
