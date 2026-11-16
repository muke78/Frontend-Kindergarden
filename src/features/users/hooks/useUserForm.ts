import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { User } from "@/types/user.types";

const passwordSchema = z
	.string()
	.min(12, "Mínimo 12 caracteres")
	.max(128)
	.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, "Requiere mayúscula, minúscula y número");

// Schema unificado: password opcional en runtime, validamos requerido en create al submit
export const userFormSchema = z.object({
	name: z.string().min(2).max(120),
	email: z.string().email().max(180),
	role_id: z.string().uuid(),
	status_id: z.string().uuid(),
	password: z.union([passwordSchema, z.literal("")]).optional(),
});

export type UserFormValues = z.infer<typeof userFormSchema>;

type Params = {
	user?: User;
	onSubmit: (values: UserFormValues) => void;
	open: boolean;
};

const emptyDefaults: UserFormValues = {
	name: "",
	email: "",
	role_id: "",
	status_id: "",
	password: "",
};

export const useUserForm = ({ user, onSubmit, open }: Params) => {
	const isEdit = Boolean(user);

	const form = useForm<UserFormValues>({
		resolver: zodResolver(userFormSchema),
		defaultValues: user
			? {
					name: user.name,
					email: user.email,
					role_id: user.role_id,
					status_id: user.status_id,
					password: "",
				}
			: emptyDefaults,
	});

	useEffect(() => {
		form.reset(
			user
				? {
						name: user.name,
						email: user.email,
						role_id: user.role_id,
						status_id: user.status_id,
						password: "",
					}
				: emptyDefaults,
		);
	}, [user, open, form]);

	const handleSubmit = form.handleSubmit((values) => {
		if (!isEdit && !values.password) {
			form.setError("password", { message: "Contraseña requerida" });
			return;
		}
		const cleaned = { ...values };
		if (isEdit && !cleaned.password) cleaned.password = undefined;
		onSubmit(cleaned);
	});

	return { form, handleSubmit, isEdit };
};
