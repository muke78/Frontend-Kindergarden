import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { usePdasUiStore } from "@/features/pdas/stores/pdasUi.store";
import {
	pdaCategoriesService,
	pdaEvaluationsService,
	pdaItemsService,
	type UpsertEvalPayload,
} from "@/services/pdas.service";

const inv = (qc: ReturnType<typeof useQueryClient>, keys: string[][]) => {
	for (const k of keys) qc.invalidateQueries({ queryKey: k });
};

export const usePdaCategoryMutations = () => {
	const qc = useQueryClient();
	const close = usePdasUiStore((s) => s.closeDialog);

	const create = useMutation({
		mutationFn: pdaCategoriesService.create,
		onSuccess: () => {
			toast.success("Categoría creada");
			close();
			inv(qc, [["pda-categories"]]);
		},
		onError: () => toast.error("Error al crear categoría"),
	});

	const update = useMutation({
		mutationFn: ({
			id,
			payload,
		}: {
			id: string;
			payload: Parameters<typeof pdaCategoriesService.update>[1];
		}) => pdaCategoriesService.update(id, payload),
		onSuccess: () => {
			toast.success("Categoría actualizada");
			close();
			inv(qc, [["pda-categories"]]);
		},
		onError: () => toast.error("Error al actualizar"),
	});

	const remove = useMutation({
		mutationFn: pdaCategoriesService.remove,
		onSuccess: () => {
			toast.success("Categoría eliminada");
			close();
			inv(qc, [["pda-categories"], ["pda-items"]]);
		},
		onError: () => toast.error("Error al eliminar"),
	});

	return { create, update, remove };
};

export const usePdaItemMutations = () => {
	const qc = useQueryClient();
	const close = usePdasUiStore((s) => s.closeDialog);

	const create = useMutation({
		mutationFn: pdaItemsService.create,
		onSuccess: () => {
			toast.success("PDA creado");
			close();
			inv(qc, [["pda-items"]]);
		},
		onError: () => toast.error("Error al crear PDA"),
	});

	const update = useMutation({
		mutationFn: ({
			id,
			payload,
		}: {
			id: string;
			payload: Parameters<typeof pdaItemsService.update>[1];
		}) => pdaItemsService.update(id, payload),
		onSuccess: () => {
			toast.success("PDA actualizado");
			close();
			inv(qc, [["pda-items"]]);
		},
		onError: () => toast.error("Error al actualizar"),
	});

	const remove = useMutation({
		mutationFn: pdaItemsService.remove,
		onSuccess: () => {
			toast.success("PDA eliminado");
			close();
			inv(qc, [["pda-items"]]);
		},
		onError: () => toast.error("Error al eliminar"),
	});

	return { create, update, remove };
};

export const usePdaEvalMutations = (studentId: string) => {
	const qc = useQueryClient();

	const upsert = useMutation({
		mutationFn: (payload: UpsertEvalPayload) => pdaEvaluationsService.upsert(payload),
		onSuccess: () => {
			toast.success("Evaluación guardada");
			inv(qc, [["pda-evaluations", studentId]]);
		},
		onError: () => toast.error("Error al guardar evaluación"),
	});

	const remove = useMutation({
		mutationFn: pdaEvaluationsService.remove,
		onSuccess: () => {
			toast.success("Evaluación eliminada");
			inv(qc, [["pda-evaluations", studentId]]);
		},
		onError: () => toast.error("Error al eliminar"),
	});

	return { upsert, remove };
};
