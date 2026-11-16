import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Mail, Shield, type User } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";

const schema = z.object({
	name: z.string().min(2, "Mínimo 2 caracteres").max(120, "Máximo 120 caracteres"),
});
type FormValues = z.infer<typeof schema>;

const InfoRow = ({
	icon: Icon,
	label,
	value,
}: {
	icon: typeof User;
	label: string;
	value: string;
}) => (
	<div className="flex items-center gap-3 py-2">
		<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
			<Icon className="h-4 w-4 text-muted-foreground" />
		</div>
		<div className="min-w-0">
			<p className="text-xs text-muted-foreground">{label}</p>
			<p className="truncate text-sm font-medium">{value}</p>
		</div>
	</div>
);

export const ProfilePage = () => {
	const user = useAuthStore((s) => s.user);
	const setUser = useAuthStore((s) => s.setUser);
	const qc = useQueryClient();

	const form = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: { name: user?.name ?? "" },
	});

	const update = useMutation({
		mutationFn: (name: string) => authService.updateMe(name),
		onSuccess: (data) => {
			setUser({ ...user!, name: data.name });
			qc.invalidateQueries({ queryKey: ["auth", "me"] });
			toast.success("Nombre actualizado");
			form.reset({ name: data.name });
		},
		onError: () => toast.error("Error al actualizar el perfil"),
	});

	if (!user) return null;

	return (
		<div className="mx-auto max-w-2xl space-y-6 p-6">
			<div>
				<h1 className="text-2xl font-bold tracking-tight">Mi perfil</h1>
				<p className="text-sm text-muted-foreground">Información de tu cuenta</p>
			</div>

			<Card>
				<CardHeader className="pb-3">
					<CardTitle className="text-base">Información de la cuenta</CardTitle>
					<CardDescription>Datos de acceso (solo lectura)</CardDescription>
				</CardHeader>
				<CardContent className="space-y-1">
					<InfoRow icon={Mail} label="Correo electrónico" value={user.email} />
					<Separator />
					<InfoRow icon={Shield} label="Rol" value={user.role_code} />
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="pb-3">
					<CardTitle className="text-base">Editar nombre</CardTitle>
					<CardDescription>Cambia cómo te ven los demás en el sistema</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={form.handleSubmit((v) => update.mutate(v.name))}
						className="space-y-4"
						noValidate
					>
						<div className="space-y-1">
							<Label htmlFor="name">Nombre completo</Label>
							<Input
								id="name"
								{...form.register("name")}
								placeholder="Tu nombre"
								className="max-w-sm"
							/>
							{form.formState.errors.name && (
								<p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
							)}
						</div>
						<Button type="submit" disabled={update.isPending || !form.formState.isDirty}>
							{update.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							Guardar cambios
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
};
