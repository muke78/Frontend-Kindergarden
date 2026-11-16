import { Monitor, Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type Theme, useThemeStore } from "@/stores/theme.store";

const OPTIONS: Array<{ value: Theme; label: string; icon: typeof Sun }> = [
	{ value: "light", label: "Claro", icon: Sun },
	{ value: "dark", label: "Oscuro", icon: Moon },
	{ value: "system", label: "Sistema", icon: Monitor },
];

export const ThemeToggle = () => {
	const theme = useThemeStore((s) => s.theme);
	const setTheme = useThemeStore((s) => s.setTheme);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon" aria-label="Cambiar tema">
					<Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
					<Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{OPTIONS.map((opt) => (
					<DropdownMenuItem
						key={opt.value}
						onClick={() => setTheme(opt.value)}
						className={theme === opt.value ? "bg-accent" : ""}
					>
						<opt.icon className="mr-2 h-4 w-4" />
						{opt.label}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
