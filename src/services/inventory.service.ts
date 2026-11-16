import { api, unwrap } from "@/lib/api";
import type { Paginated, PaginationQuery } from "@/types/api.types";
import type {
	CreateInventoryItemPayload,
	InventoryItem,
	UpdateInventoryItemPayload,
} from "@/types/asset.types";

export type ListInventoryQuery = PaginationQuery & {
	condition_id?: string;
	status_id?: string;
	classroom_id?: string;
};

export const inventoryService = {
	list: (params: ListInventoryQuery) =>
		api.get<{ data: Paginated<InventoryItem> }>("/inventory", { params }).then(unwrap),

	get: (id: string) => api.get<{ data: InventoryItem }>(`/inventory/${id}`).then(unwrap),

	create: (payload: CreateInventoryItemPayload) =>
		api.post<{ data: InventoryItem }>("/inventory", payload).then(unwrap),

	update: (id: string, payload: UpdateInventoryItemPayload) =>
		api.put<{ data: InventoryItem }>(`/inventory/${id}`, payload).then(unwrap),

	remove: (id: string) => api.delete(`/inventory/${id}`),
};
