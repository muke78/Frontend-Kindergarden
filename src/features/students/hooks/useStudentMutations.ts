import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { studentsService } from "@/services/students.service";
import type { CreateStudentPayload, UpdateStudentPayload } from "@/types/people.types";

type AxiosLikeError = { response?: { data?: { message?: string } } };
const msg = (e: unknown, fallback: string) =>
	(e as AxiosLikeError | undefined)?.response?.data?.message ?? fallback;

export const useStudentMutations = () => {
	const qc = useQueryClient();
	const inv = () => qc.invalidateQueries({ queryKey: ["students"] });

	const create = useMutation({
		mutationFn: (p: CreateStudentPayload) => studentsService.create(p),
		onSuccess: () => {
			toast.success("Alumno creado");
			inv();
		},
		onError: (e) => toast.error(msg(e, "Error al crear alumno")),
	});

	const update = useMutation({
		mutationFn: ({ id, payload }: { id: string; payload: UpdateStudentPayload }) =>
			studentsService.update(id, payload),
		onSuccess: () => {
			toast.success("Alumno actualizado");
			inv();
		},
		onError: (e) => toast.error(msg(e, "Error al actualizar alumno")),
	});

	const remove = useMutation({
		mutationFn: (id: string) => studentsService.remove(id),
		onSuccess: () => {
			toast.success("Alumno eliminado");
			inv();
		},
		onError: (e) => toast.error(msg(e, "Error al eliminar alumno")),
	});

	return { create, update, remove };
};
