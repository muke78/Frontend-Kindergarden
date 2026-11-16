import { useQuery } from "@tanstack/react-query";

import {
	pdaCategoriesService,
	pdaEvaluationsService,
	pdaItemsService,
} from "@/services/pdas.service";

export const usePdaCategories = (params?: { search?: string }) =>
	useQuery({
		queryKey: ["pda-categories", params],
		queryFn: () => pdaCategoriesService.list(params),
		staleTime: 5 * 60 * 1000,
	});

export const usePdaItems = (params?: {
	category_id?: string;
	grade_name?: string;
	is_active?: boolean;
}) =>
	useQuery({
		queryKey: ["pda-items", params],
		queryFn: () => pdaItemsService.list(params),
		staleTime: 5 * 60 * 1000,
	});

export const usePdaEvaluations = (params: {
	student_id: string;
	school_year?: string;
	period?: number;
}) =>
	useQuery({
		queryKey: ["pda-evaluations", params],
		queryFn: () => pdaEvaluationsService.list(params),
		enabled: !!params.student_id,
		staleTime: 0,
	});
