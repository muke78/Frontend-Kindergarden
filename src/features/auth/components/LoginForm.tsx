import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginForm } from "@/features/auth/hooks/useLoginForm";

export const LoginForm = () => {
	const { form, onSubmit, isLoggingIn } = useLoginForm();
	const { register, formState } = form;
	const { errors } = formState;
	const [showPassword, setShowPassword] = useState(false);

	return (
		<div className="rounded-2xl border-2 border-amber-200/70 dark:border-amber-700/40 bg-white/80 dark:bg-background/60 backdrop-blur-sm shadow-xl shadow-amber-100/50 dark:shadow-black/30 p-6 space-y-5">
			<form onSubmit={onSubmit} className="space-y-4" noValidate>
				<div className="space-y-1.5">
					<Label htmlFor="email" className="text-amber-900 dark:text-amber-300 font-medium">
						Email
					</Label>
					<Input
						id="email"
						type="email"
						autoComplete="email"
						autoFocus
						aria-invalid={Boolean(errors.email)}
						className="border-amber-200 dark:border-amber-700/50 focus-visible:ring-amber-400 dark:focus-visible:ring-amber-600 bg-amber-50/50 dark:bg-amber-950/20"
						{...register("email")}
					/>
					{errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
				</div>

				<div className="space-y-1.5">
					<Label htmlFor="password" className="text-amber-900 dark:text-amber-300 font-medium">
						Contraseña
					</Label>
					<div className="relative">
						<Input
							id="password"
							type={showPassword ? "text" : "password"}
							autoComplete="current-password"
							aria-invalid={Boolean(errors.password)}
							className="pr-10 border-amber-200 dark:border-amber-700/50 focus-visible:ring-amber-400 dark:focus-visible:ring-amber-600 bg-amber-50/50 dark:bg-amber-950/20"
							{...register("password")}
						/>
						<button
							type="button"
							onClick={() => setShowPassword((v) => !v)}
							className="absolute inset-y-0 right-0 flex items-center px-3 text-amber-600/70 hover:text-amber-700 dark:text-amber-400/70 dark:hover:text-amber-300"
							aria-label={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
						>
							{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
						</button>
					</div>
					{errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
				</div>

				<Button
					type="submit"
					className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-md shadow-amber-200 dark:shadow-amber-900/40 border-0 h-11"
					disabled={isLoggingIn}
				>
					{isLoggingIn && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
					Iniciar sesión
				</Button>
			</form>
		</div>
	);
};
