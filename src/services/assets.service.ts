import { api, unwrap } from "@/lib/api";
import type { Paginated, PaginationQuery } from "@/types/api.types";
import type { Asset, CreateAssetPayload, UpdateAssetPayload } from "@/types/asset.types";

export type ListAssetsQuery = PaginationQuery & {
	condition_id?: string;
	status_id?: string;
	classroom_id?: string;
};

export const assetsService = {
	list: (params: ListAssetsQuery) =>
		api.get<{ data: Paginated<Asset> }>("/assets", { params }).then(unwrap),

	get: (id: string) => api.get<{ data: Asset }>(`/assets/${id}`).then(unwrap),

	create: (payload: CreateAssetPayload) =>
		api.post<{ data: Asset }>("/assets", payload).then(unwrap),

	update: (id: string, payload: UpdateAssetPayload) =>
		api.put<{ data: Asset }>(`/assets/${id}`, payload).then(unwrap),

	remove: (id: string) => api.delete(`/assets/${id}`),
};
