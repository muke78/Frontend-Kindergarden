import { useParentsUiStore } from "@/features/parents/stores/parentsUi.store";
import { useParentsQuery } from "./useParentsQuery";

export const useParentsPage = () => {
	const openCreate = useParentsUiStore((s) => s.openCreate);
	const { data, isLoading } = useParentsQuery();

	return {
		rows: data?.rows ?? [],
		pagination: data?.pagination,
		isLoading,
		openCreate,
	};
};
