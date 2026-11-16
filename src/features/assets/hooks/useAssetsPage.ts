import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useAssetsUiStore } from "@/features/assets/stores/assetsUi.store";
import { useDebounce } from "@/hooks/useDebounce";
import { assetsService } from "@/services/assets.service";
import { catalogsService } from "@/services/catalogs.service";
import type { CreateAssetPayload, UpdateAssetPayload } from "@/types/asset.types";

type AxiosLikeError = { response?: { data?: { message?: string } } };
const msg = (e: unknown, fallback: string) =>
	(e as AxiosLikeError | undefined)?.response?.data?.message ?? fallback;

export const useAssetsPage = () => {
	const qc = useQueryClient();
	const filters = useAssetsUiStore((s) => s.filters);
	const debouncedSearch = useDebounce(filters.search);

	const listQ = useQuery({
		queryKey: ["assets", { ...filters, search: debouncedSearch }],
		queryFn: () => assetsService.list({ ...filters, search: debouncedSearch || undefined }),
		placeholderData: keepPreviousData,
	});

	const conditions = useQuery({
		queryKey: ["catalogs", "asset-conditions"],
		queryFn: catalogsService.assetConditions,
	});
	const statuses = useQuery({
		queryKey: ["catalogs", "asset-statuses"],
		queryFn: catalogsService.assetStatuses,
	});
	const classrooms = useQuery({
		queryKey: ["catalogs", "classrooms"],
		queryFn: catalogsService.classrooms,
	});

	const inv = () => qc.invalidateQueries({ queryKey: ["assets"] });

	const create = useMutation({
		mutationFn: (p: CreateAssetPayload) => assetsService.create(p),
		onSuccess: () => {
			toast.success("Activo creado");
			inv();
		},
		onError: (e) => toast.error(msg(e, "Error al crear activo")),
	});

	const update = useMutation({
		mutationFn: ({ id, payload }: { id: string; payload: UpdateAssetPayload }) =>
			assetsService.update(id, payload),
		onSuccess: () => {
			toast.success("Activo actualizado");
			inv();
		},
		onError: (e) => toast.error(msg(e, "Error al actualizar activo")),
	});

	const remove = useMutation({
		mutationFn: (id: string) => assetsService.remove(id),
		onSuccess: () => {
			toast.success("Activo eliminado");
			inv();
		},
		onError: (e) => toast.error(msg(e, "Error al eliminar activo")),
	});

	return {
		rows: listQ.data?.rows ?? [],
		pagination: listQ.data?.pagination,
		isLoading: listQ.isLoading,
		catalogs: {
			conditions: conditions.data ?? [],
			statuses: statuses.data ?? [],
			classrooms: classrooms.data ?? [],
		},
		create,
		update,
		remove,
	};
};
