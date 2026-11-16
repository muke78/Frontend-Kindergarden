import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { classroomsService } from "@/services/classrooms.service";
import type { CreateClassroomPayload, UpdateClassroomPayload } from "@/types/people.types";

type AxiosLikeError = { response?: { data?: { message?: string } } };

const msg = (e: unknown, fallback: string) =>
	(e as AxiosLikeError | undefined)?.response?.data?.message ?? fallback;

export const useClassroomMutations = () => {
	const qc = useQueryClient();
	const inv = () => qc.invalidateQueries({ queryKey: ["classrooms"] });

	const create = useMutation({
		mutationFn: (p: CreateClassroomPayload) => classroomsService.create(p),
		onSuccess: () => {
			toast.success("Aula creada");
			inv();
		},
		onError: (e) => toast.error(msg(e, "Error al crear aula")),
	});

	const update = useMutation({
		mutationFn: ({ id, payload }: { id: string; payload: UpdateClassroomPayload }) =>
			classroomsService.update(id, payload),
		onSuccess: () => {
			toast.success("Aula actualizada");
			inv();
		},
		onError: (e) => toast.error(msg(e, "Error al actualizar aula")),
	});

	const remove = useMutation({
		mutationFn: (id: string) => classroomsService.remove(id),
		onSuccess: () => {
			toast.success("Aula eliminada");
			inv();
		},
		onError: (e) => toast.error(msg(e, "Error al eliminar aula")),
	});

	return { create, update, remove };
};
