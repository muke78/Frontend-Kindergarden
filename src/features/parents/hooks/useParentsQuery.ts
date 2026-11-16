import { useQuery } from "@tanstack/react-query";
import { useParentsUiStore } from "@/features/parents/stores/parentsUi.store";
import { useDebounce } from "@/hooks/useDebounce";
import { parentsService } from "@/services/parents.service";

export const useParentsQuery = () => {
	const filters = useParentsUiStore((s) => s.filters);
	const debouncedSearch = useDebounce(filters.search);

	return useQuery({
		queryKey: ["parents", { ...filters, search: debouncedSearch }],
		queryFn: () =>
			parentsService.list({
				page: filters.page,
				limit: filters.limit,
				search: debouncedSearch || undefined,
				status_id: filters.status_id,
				sort: "paternal_surname",
				order: "asc",
			}),
		placeholderData: (prev) => prev,
	});
};
