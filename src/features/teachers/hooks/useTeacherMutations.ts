import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { teachersService } from "@/services/teachers.service";
import type { CreateTeacherPayload, UpdateTeacherPayload } from "@/types/people.types";

type AxiosLikeError = { response?: { data?: { message?: string } } };
const msg = (e: unknown, fallback: string) =>
	(e as AxiosLikeError | undefined)?.response?.data?.message ?? fallback;

export const useTeacherMutations = () => {
	const qc = useQueryClient();
	const inv = () => qc.invalidateQueries({ queryKey: ["teachers"] });

	const create = useMutation({
		mutationFn: (p: CreateTeacherPayload) => teachersService.create(p),
		onSuccess: () => {
			toast.success("Maestro creado");
			inv();
		},
		onError: (e) => toast.error(msg(e, "Error al crear maestro")),
	});

	const update = useMutation({
		mutationFn: ({ id, payload }: { id: string; payload: UpdateTeacherPayload }) =>
			teachersService.update(id, payload),
		onSuccess: () => {
			toast.success("Maestro actualizado");
			inv();
		},
		onError: (e) => toast.error(msg(e, "Error al actualizar maestro")),
	});

	const remove = useMutation({
		mutationFn: (id: string) => teachersService.remove(id),
		onSuccess: () => {
			toast.success("Maestro eliminado");
			inv();
		},
		onError: (e) => toast.error(msg(e, "Error al eliminar maestro")),
	});

	return { create, update, remove };
};
