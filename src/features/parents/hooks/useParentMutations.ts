import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { parentsService } from "@/services/parents.service";
import type {
	CreateParentPayload,
	CreateParentWithChildrenPayload,
	UpdateParentPayload,
} from "@/types/people.types";

type AxiosLikeError = { response?: { data?: { message?: string } } };
const msg = (e: unknown, fallback: string) =>
	(e as AxiosLikeError | undefined)?.response?.data?.message ?? fallback;

export const useParentMutations = () => {
	const qc = useQueryClient();
	const inv = () => qc.invalidateQueries({ queryKey: ["parents"] });

	const create = useMutation({
		mutationFn: (p: CreateParentPayload) => parentsService.create(p),
		onSuccess: () => {
			toast.success("Tutor creado");
			inv();
		},
		onError: (e) => toast.error(msg(e, "Error al crear tutor")),
	});

	const update = useMutation({
		mutationFn: ({ id, payload }: { id: string; payload: UpdateParentPayload }) =>
			parentsService.update(id, payload),
		onSuccess: () => {
			toast.success("Tutor actualizado");
			inv();
		},
		onError: (e) => toast.error(msg(e, "Error al actualizar tutor")),
	});

	const remove = useMutation({
		mutationFn: (id: string) => parentsService.remove(id),
		onSuccess: () => {
			toast.success("Tutor eliminado");
			inv();
		},
		onError: (e) => toast.error(msg(e, "Error al eliminar tutor")),
	});

	const createWithChildren = useMutation({
		mutationFn: (p: CreateParentWithChildrenPayload) => parentsService.createWithChildren(p),
		onSuccess: () => {
			toast.success("Tutores e hijos registrados");
			inv();
			qc.invalidateQueries({ queryKey: ["students"] });
		},
		onError: (e) => toast.error(msg(e, "Error al registrar tutores e hijos")),
	});

	return { create, update, remove, createWithChildren };
};
