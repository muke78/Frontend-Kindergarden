import { useRolesUiStore } from "@/features/roles/stores/rolesUi.store";
import { useRolesQuery } from "./useRolesQuery";

export const useRolesPage = () => {
	const openCreate = useRolesUiStore((s) => s.openCreate);
	const { data, isLoading } = useRolesQuery();
	return { rows: data?.rows ?? [], pagination: data?.pagination, isLoading, openCreate };
};
