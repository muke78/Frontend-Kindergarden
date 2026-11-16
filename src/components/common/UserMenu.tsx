import { LogOut, User as UserIcon } from "lucide-react";
import { useNavigate } from "react-router";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";

const initialsFrom = (name?: string) =>
	(name ?? "?")
		.split(" ")
		.slice(0, 2)
		.map((p) => p[0]?.toUpperCase() ?? "")
		.join("") || "U";

export const UserMenu = () => {
	const { user, logout, isLoggingOut } = useAuth();
	const navigate = useNavigate();
	if (!user) return null;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="gap-2 h-auto px-2 py-1">
					<Avatar className="h-7 w-7">
						<AvatarImage src={user.profile_picture ?? undefined} alt={user.name} />
						<AvatarFallback className="text-xs">{initialsFrom(user.name)}</AvatarFallback>
					</Avatar>
					<div className="hidden sm:flex flex-col items-start text-xs leading-tight">
						<span className="font-medium">{user.name}</span>
						<span className="text-muted-foreground">{user.role_code}</span>
					</div>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-56">
				<DropdownMenuLabel className="space-y-0.5">
					<div className="font-medium">{user.name}</div>
					<div className="text-xs text-muted-foreground truncate">{user.email}</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={() => navigate("/profile")}>
					<UserIcon className="mr-2 h-4 w-4" /> Mi perfil
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={() => logout()}
					disabled={isLoggingOut}
					className="text-destructive focus:text-destructive"
				>
					<LogOut className="mr-2 h-4 w-4" /> Cerrar sesión
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
