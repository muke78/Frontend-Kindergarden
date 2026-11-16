import { useQuery } from "@tanstack/react-query";
import { useGradeGroupsUiStore } from "@/features/grade-groups/stores/gradeGroupsUi.store";
import { useDebounce } from "@/hooks/useDebounce";
import { gradeGroupsService } from "@/services/gradeGroups.service";

export const useGradeGroupsQuery = () => {
	const filters = useGradeGroupsUiStore((s) => s.filters);
	const search = useDebounce(filters.search, 300);

	return useQuery({
		queryKey: ["grade-groups", { ...filters, search }],
		queryFn: () => gradeGroupsService.list({ page: filters.page, limit: filters.limit, search }),
	});
};
