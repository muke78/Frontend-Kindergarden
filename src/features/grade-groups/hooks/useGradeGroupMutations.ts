import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type {
	CreateGradeGroupPayload,
	UpdateGradeGroupPayload,
} from "@/services/gradeGroups.service";
import { gradeGroupsService } from "@/services/gradeGroups.service";

type AxiosLikeError = { response?: { data?: { message?: string } } };
const msg = (e: unknown, fallback: string) =>
	(e as AxiosLikeError | undefined)?.response?.data?.message ?? fallback;

export const useGradeGroupMutations = () => {
	const qc = useQueryClient();
	const inv = () => {
		qc.invalidateQueries({ queryKey: ["grade-groups"] });
		qc.invalidateQueries({ queryKey: ["catalogs", "grade-groups"] });
	};

	const create = useMutation({
		mutationFn: (p: CreateGradeGroupPayload) => gradeGroupsService.create(p),
		onSuccess: () => {
			toast.success("Grupo creado");
			inv();
		},
		onError: (e) => toast.error(msg(e, "Error al crear grupo")),
	});

	const update = useMutation({
		mutationFn: ({ id, payload }: { id: string; payload: UpdateGradeGroupPayload }) =>
			gradeGroupsService.update(id, payload),
		onSuccess: () => {
			toast.success("Grupo actualizado");
			inv();
		},
		onError: (e) => toast.error(msg(e, "Error al actualizar grupo")),
	});

	const remove = useMutation({
		mutationFn: (id: string) => gradeGroupsService.remove(id),
		onSuccess: () => {
			toast.success("Grupo eliminado");
			inv();
		},
		onError: (e) => toast.error(msg(e, "Error al eliminar grupo")),
	});

	return { create, update, remove };
};
