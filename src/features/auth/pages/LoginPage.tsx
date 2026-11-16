import { ThemeToggle } from "@/components/common/ThemeToggle";
import { env } from "@/config/env";
import { LoginForm } from "@/features/auth/components/LoginForm";

const Star = ({ className }: { className: string }) => (
	<svg
		viewBox="0 0 24 24"
		fill="currentColor"
		className={className}
		role="img"
		aria-label="estrella"
	>
		<title>estrella</title>
		<path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
	</svg>
);

export const LoginPage = () => (
	<div className="min-h-screen grid lg:grid-cols-2">
		{/* Left panel — decorative */}
		<div className="relative hidden lg:flex flex-col overflow-hidden bg-gradient-to-br from-amber-400 via-yellow-300 to-green-300">
			<div
				className="absolute inset-0 opacity-10"
				style={{
					backgroundImage:
						"radial-gradient(circle at 25% 25%, white 2px, transparent 2px), radial-gradient(circle at 75% 75%, white 2px, transparent 2px)",
					backgroundSize: "40px 40px",
				}}
			/>
			<div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-yellow-200/40 blur-3xl" />
			<div className="absolute bottom-10 -right-20 h-80 w-80 rounded-full bg-green-300/40 blur-3xl" />

			<div className="relative flex flex-col h-full p-10 justify-between z-10">
				<div className="flex items-center gap-3">
					<img src="/sunflower.svg" alt="Logo" className="h-10 w-10 drop-shadow-sm" />
					<span className="text-xl font-bold text-amber-900">{env.appName}</span>
				</div>
				<div className="flex flex-col items-center gap-6">
					<img
						src="/sunflower.svg"
						alt="Kinder"
						className="h-40 w-40 drop-shadow-xl animate-[spin_20s_linear_infinite]"
					/>
					<div className="text-center space-y-2">
						<h2 className="text-3xl font-bold text-amber-900 leading-tight">
							Bienvenido al
							<br />
							sistema escolar
						</h2>
						<p className="text-amber-800/70 text-sm max-w-xs">
							Gestión de alumnos, maestros y más — todo en un solo lugar.
						</p>
					</div>
				</div>
				<blockquote className="space-y-1">
					<p className="text-sm text-amber-900/80 italic">
						"Administración escolar simple, segura y moderna."
					</p>
				</blockquote>
			</div>
		</div>

		{/* Right panel — colorful form */}
		<div className="relative flex flex-col overflow-hidden bg-gradient-to-br from-rose-50 via-amber-50 to-sky-50 dark:from-rose-950/40 dark:via-amber-950/30 dark:to-sky-950/40">
			{/* Floating decorations */}
			<Star className="absolute top-12 right-10 h-8 w-8 text-amber-300/60 dark:text-amber-500/30 rotate-12" />
			<Star className="absolute top-32 left-8 h-5 w-5 text-rose-300/60 dark:text-rose-500/30 -rotate-6" />
			<Star className="absolute bottom-20 right-16 h-6 w-6 text-sky-300/60 dark:text-sky-500/30 rotate-45" />
			<Star className="absolute bottom-36 left-12 h-4 w-4 text-green-300/70 dark:text-green-500/30" />
			<div className="absolute top-1/4 -right-8 h-40 w-40 rounded-full bg-amber-200/40 dark:bg-amber-700/20 blur-3xl" />
			<div className="absolute bottom-1/4 -left-8 h-40 w-40 rounded-full bg-rose-200/40 dark:bg-rose-700/20 blur-3xl" />

			{/* Header */}
			<div className="relative z-10 flex justify-between items-center p-4 sm:p-6">
				<div className="flex items-center gap-2 lg:hidden">
					<img src="/sunflower.svg" alt="Logo" className="h-7 w-7" />
					<span className="text-sm font-semibold">{env.appName}</span>
				</div>
				<div className="ml-auto">
					<ThemeToggle />
				</div>
			</div>

			{/* Form */}
			<div className="relative z-10 flex-1 grid place-items-center px-6 pb-10">
				<div className="w-full max-w-sm space-y-6">
					<div className="text-center space-y-2">
						<div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-200 dark:shadow-amber-900/40 mb-2">
							<img src="/sunflower.svg" alt="" className="h-8 w-8" />
						</div>
						<h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">
							Iniciar sesión
						</h1>
						<p className="text-sm text-muted-foreground">Accede a tu cuenta para continuar</p>
					</div>

					<LoginForm />
				</div>
			</div>
		</div>
	</div>
);
