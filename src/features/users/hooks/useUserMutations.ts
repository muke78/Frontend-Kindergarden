import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useUsersUiStore } from "@/features/users/stores/usersUi.store";
import { usersService } from "@/services/users.service";
import type { CreateUserPayload, UpdateUserPayload } from "@/types/user.types";

type AxiosLikeError = { response?: { data?: { message?: string } } };

const extractMessage = (error: unknown, fallback: string) => {
	const message = (error as AxiosLikeError | undefined)?.response?.data?.message;
	return message ?? fallback;
};

const showError = (fallback: string) => (error: unknown) =>
	toast.error(extractMessage(error, fallback));

export const useUserMutations = () => {
	const queryClient = useQueryClient();
	const clearSelection = useUsersUiStore((s) => s.clearSelection);
	const invalidate = () => queryClient.invalidateQueries({ queryKey: ["users"] });

	const create = useMutation({
		mutationFn: (payload: CreateUserPayload) => usersService.create(payload),
		onSuccess: () => {
			toast.success("Usuario creado");
			invalidate();
		},
		onError: showError("Error al crear usuario"),
	});

	const update = useMutation({
		mutationFn: ({ id, payload }: { id: string; payload: UpdateUserPayload }) =>
			usersService.update(id, payload),
		onSuccess: () => {
			toast.success("Usuario actualizado");
			invalidate();
		},
		onError: showError("Error al actualizar usuario"),
	});

	const remove = useMutation({
		mutationFn: (id: string) => usersService.remove(id),
		onSuccess: () => {
			toast.success("Usuario eliminado");
			invalidate();
		},
		onError: showError("Error al eliminar usuario"),
	});

	const bulkRemove = useMutation({
		mutationFn: (ids: string[]) => usersService.bulkRemove(ids),
		onSuccess: () => {
			toast.success("Usuarios eliminados");
			clearSelection();
			invalidate();
		},
		onError: showError("Error al eliminar usuarios"),
	});

	return { create, update, remove, bulkRemove };
};
