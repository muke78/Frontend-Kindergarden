import { useQuery } from "@tanstack/react-query";
import { useTeachersUiStore } from "@/features/teachers/stores/teachersUi.store";
import { useDebounce } from "@/hooks/useDebounce";
import { teachersService } from "@/services/teachers.service";

export const useTeachersQuery = () => {
	const filters = useTeachersUiStore((s) => s.filters);
	const debouncedSearch = useDebounce(filters.search);

	return useQuery({
		queryKey: ["teachers", { ...filters, search: debouncedSearch }],
		queryFn: () =>
			teachersService.list({
				page: filters.page,
				limit: filters.limit,
				search: debouncedSearch || undefined,
				status_id: filters.status_id,
				work_shift_id: filters.work_shift_id,
				sort: "paternal_surname",
				order: "asc",
			}),
		placeholderData: (prev) => prev,
	});
};
