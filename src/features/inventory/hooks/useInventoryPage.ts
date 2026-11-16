import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useInventoryUiStore } from "@/features/inventory/stores/inventoryUi.store";
import { useDebounce } from "@/hooks/useDebounce";
import { catalogsService } from "@/services/catalogs.service";
import { inventoryService } from "@/services/inventory.service";
import type { CreateInventoryItemPayload, UpdateInventoryItemPayload } from "@/types/asset.types";

type AxiosLikeError = { response?: { data?: { message?: string } } };
const msg = (e: unknown, fallback: string) =>
	(e as AxiosLikeError | undefined)?.response?.data?.message ?? fallback;

export const useInventoryPage = () => {
	const qc = useQueryClient();
	const filters = useInventoryUiStore((s) => s.filters);
	const debouncedSearch = useDebounce(filters.search);

	const listQ = useQuery({
		queryKey: ["inventory", { ...filters, search: debouncedSearch }],
		queryFn: () => inventoryService.list({ ...filters, search: debouncedSearch || undefined }),
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

	const inv = () => qc.invalidateQueries({ queryKey: ["inventory"] });

	const create = useMutation({
		mutationFn: (p: CreateInventoryItemPayload) => inventoryService.create(p),
		onSuccess: () => {
			toast.success("Artículo creado");
			inv();
		},
		onError: (e) => toast.error(msg(e, "Error al crear artículo")),
	});

	const update = useMutation({
		mutationFn: ({ id, payload }: { id: string; payload: UpdateInventoryItemPayload }) =>
			inventoryService.update(id, payload),
		onSuccess: () => {
			toast.success("Artículo actualizado");
			inv();
		},
		onError: (e) => toast.error(msg(e, "Error al actualizar artículo")),
	});

	const remove = useMutation({
		mutationFn: (id: string) => inventoryService.remove(id),
		onSuccess: () => {
			toast.success("Artículo eliminado");
			inv();
		},
		onError: (e) => toast.error(msg(e, "Error al eliminar artículo")),
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
