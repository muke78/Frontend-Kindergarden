import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useAuth } from "@/hooks/useAuth";

export const loginSchema = z.object({
	email: z.string().email("Email inválido").max(180),
	password: z.string().min(1, "Contraseña requerida").max(128),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const useLoginForm = () => {
	const { login, isLoggingIn } = useAuth();

	const form = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: { email: "", password: "" },
	});

	const onSubmit = form.handleSubmit((values) => login(values));

	return { form, onSubmit, isLoggingIn };
};
