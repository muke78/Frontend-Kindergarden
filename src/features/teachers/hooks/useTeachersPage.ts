import { useTeachersUiStore } from "@/features/teachers/stores/teachersUi.store";
import { useTeachersQuery } from "./useTeachersQuery";

export const useTeachersPage = () => {
	const openCreate = useTeachersUiStore((s) => s.openCreate);
	const { data, isLoading } = useTeachersQuery();

	return {
		rows: data?.rows ?? [],
		pagination: data?.pagination,
		isLoading,
		openCreate,
	};
};
