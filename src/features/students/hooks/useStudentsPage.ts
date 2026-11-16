import { useStudentsUiStore } from "@/features/students/stores/studentsUi.store";
import { useStudentsQuery } from "./useStudentsQuery";

export const useStudentsPage = () => {
	const openCreate = useStudentsUiStore((s) => s.openCreate);
	const { data, isLoading } = useStudentsQuery();

	return {
		rows: data?.rows ?? [],
		pagination: data?.pagination,
		isLoading,
		openCreate,
	};
};
