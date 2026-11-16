import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { rolesService } from "@/services/roles.service";

type Err = { response?: { data?: { message?: string } } };
const msg = (e: unknown, fb: string) => (e as Err | undefined)?.response?.data?.message ?? fb;

export const useRoleMutations = () => {
	const qc = useQueryClient();
	const inv = () => qc.invalidateQueries({ queryKey: ["roles"] });

	const create = useMutation({
		mutationFn: (p: { code: string; name: string; description?: string }) => rolesService.create(p),
		onSuccess: () => {
			toast.success("Rol creado");
			inv();
		},
		onError: (e) => toast.error(msg(e, "Error al crear rol")),
	});

	const update = useMutation({
		mutationFn: ({
			id,
			payload,
		}: {
			id: string;
			payload: { name?: string; description?: string };
		}) => rolesService.update(id, payload),
		onSuccess: () => {
			toast.success("Rol actualizado");
			inv();
		},
		onError: (e) => toast.error(msg(e, "Error al actualizar rol")),
	});

	const remove = useMutation({
		mutationFn: (id: string) => rolesService.remove(id),
		onSuccess: () => {
			toast.success("Rol eliminado");
			inv();
		},
		onError: (e) => toast.error(msg(e, "Error al eliminar rol")),
	});

	return { create, update, remove };
};
