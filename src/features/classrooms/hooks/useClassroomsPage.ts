import { useClassroomsUiStore } from "@/features/classrooms/stores/classroomsUi.store";
import { useClassroomsQuery } from "./useClassroomsQuery";

export const useClassroomsPage = () => {
	const openCreate = useClassroomsUiStore((s) => s.openCreate);
	const { data, isLoading } = useClassroomsQuery();

	return {
		rows: data?.rows ?? [],
		pagination: data?.pagination,
		isLoading,
		openCreate,
	};
};
