import { useQuery } from "@tanstack/react-query";
import { useStudentsUiStore } from "@/features/students/stores/studentsUi.store";
import { useDebounce } from "@/hooks/useDebounce";
import { studentsService } from "@/services/students.service";

export const useStudentsQuery = () => {
	const filters = useStudentsUiStore((s) => s.filters);
	const debouncedSearch = useDebounce(filters.search);

	return useQuery({
		queryKey: ["students", { ...filters, search: debouncedSearch }],
		queryFn: () =>
			studentsService.list({
				page: filters.page,
				limit: filters.limit,
				search: debouncedSearch || undefined,
				status_id: filters.status_id,
				grade_group_id: filters.grade_group_id,
				sort: "paternal_surname",
				order: "asc",
			}),
		placeholderData: (prev) => prev,
	});
};
