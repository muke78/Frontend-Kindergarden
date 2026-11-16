import { useQuery } from "@tanstack/react-query";
import { useRolesUiStore } from "@/features/roles/stores/rolesUi.store";
import { useDebounce } from "@/hooks/useDebounce";
import { rolesService } from "@/services/roles.service";

export const useRolesQuery = () => {
	const filters = useRolesUiStore((s) => s.filters);
	const debouncedSearch = useDebounce(filters.search);

	return useQuery({
		queryKey: ["roles", { ...filters, search: debouncedSearch }],
		queryFn: () =>
			rolesService.list({
				page: filters.page,
				limit: filters.limit,
				search: debouncedSearch || undefined,
			}),
		placeholderData: (prev) => prev,
	});
};
