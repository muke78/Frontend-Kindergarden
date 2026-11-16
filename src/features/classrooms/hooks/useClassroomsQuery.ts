import { useQuery } from "@tanstack/react-query";
import { useClassroomsUiStore } from "@/features/classrooms/stores/classroomsUi.store";
import { useDebounce } from "@/hooks/useDebounce";
import { classroomsService } from "@/services/classrooms.service";

export const useClassroomsQuery = () => {
	const filters = useClassroomsUiStore((s) => s.filters);
	const debouncedSearch = useDebounce(filters.search);

	return useQuery({
		queryKey: ["classrooms", { ...filters, search: debouncedSearch }],
		queryFn: () =>
			classroomsService.list({
				page: filters.page,
				limit: filters.limit,
				search: debouncedSearch || undefined,
				sort: "name",
				order: "asc",
			}),
		placeholderData: (prev) => prev,
	});
};
