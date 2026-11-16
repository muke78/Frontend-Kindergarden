import { useQuery } from "@tanstack/react-query";
import { useUsersUiStore } from "@/features/users/stores/usersUi.store";
import { useDebounce } from "@/hooks/useDebounce";
import { type ListUsersQuery, usersService } from "@/services/users.service";

export const useUsersQuery = () => {
	const filters = useUsersUiStore((s) => s.filters);
	const debouncedSearch = useDebounce(filters.search);

	const query: ListUsersQuery = {
		page: filters.page,
		limit: filters.limit,
		search: debouncedSearch || undefined,
		role_id: filters.roleId,
		status_id: filters.statusId,
		sort: "created_at",
		order: "desc",
	};

	return useQuery({
		queryKey: ["users", query],
		queryFn: () => usersService.list(query),
		placeholderData: (prev) => prev,
	});
};
