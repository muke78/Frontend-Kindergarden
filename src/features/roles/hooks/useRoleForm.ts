import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { Role } from "@/types/rbac.types";

const schema = z.object({
	code: z
		.string()
		.min(2)
		.max(50)
		.regex(/^[a-z_]+$/, "Solo minúsculas y guiones bajos"),
	name: z.string().min(2).max(80),
	description: z.string().max(255).optional(),
});

export type RoleFormValues = z.infer<typeof schema>;

const empty: RoleFormValues = { code: "", name: "", description: "" };

export const useRoleForm = ({
	role,
	onSubmit,
}: {
	role?: Role;
	onSubmit: (v: RoleFormValues) => void;
}) => {
	const form = useForm<RoleFormValues>({ resolver: zodResolver(schema), defaultValues: empty });

	useEffect(() => {
		form.reset(
			role ? { code: role.code, name: role.name, description: role.description ?? "" } : empty,
		);
	}, [role, form]);

	return { form, handleSubmit: form.handleSubmit(onSubmit) };
};
