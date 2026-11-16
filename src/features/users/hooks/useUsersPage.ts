import { useUserMutations } from "@/features/users/hooks/useUserMutations";
import { useUsersQuery } from "@/features/users/hooks/useUsersQuery";
import { useUsersUiStore } from "@/features/users/stores/usersUi.store";

export const useUsersPage = () => {
	const usersQuery = useUsersQuery();
	const mutations = useUserMutations();
	const dialog = useUsersUiStore((s) => s.dialog);
	const closeDialog = useUsersUiStore((s) => s.closeDialog);
	const openCreate = useUsersUiStore((s) => s.openCreate);

	return {
		rows: usersQuery.data?.rows ?? [],
		pagination: usersQuery.data?.pagination,
		isLoading: usersQuery.isLoading,
		isFetching: usersQuery.isFetching,
		dialog,
		closeDialog,
		openCreate,
		mutations,
	};
};
