import { NavLink } from "react-router";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

import { env } from "@/config/env";
import { usePermission } from "@/hooks/usePermission";
import { type NavRoute, navRoutes } from "@/routes/routes";

const NavItem = ({ route }: { route: NavRoute }) => {
	const canRead = usePermission(route.module ?? "", "read");
	if (route.module && !canRead) return null;
	return (
		<SidebarMenuItem>
			<SidebarMenuButton asChild tooltip={route.label}>
				<NavLink to={route.path} end={route.path === "/"}>
					<route.icon className="h-4 w-4 shrink-0" />
					<span>{route.label}</span>
				</NavLink>
			</SidebarMenuButton>
		</SidebarMenuItem>
	);
};

export const AppSidebar = () => (
	<Sidebar collapsible="icon">
		<SidebarHeader>
			<div className="flex items-center gap-2 px-2 py-1.5">
				<img src="/sunflower.svg" alt="Logo" className="h-8 w-8 shrink-0" />
				<div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
					<span className="text-sm font-semibold">{env.appName}</span>
				</div>
			</div>
		</SidebarHeader>

		<SidebarContent>
			<SidebarGroup>
				<SidebarGroupLabel>Navegación</SidebarGroupLabel>
				<SidebarGroupContent>
					<SidebarMenu>
						{navRoutes.map((r) => (
							<NavItem key={r.path} route={r} />
						))}
					</SidebarMenu>
				</SidebarGroupContent>
			</SidebarGroup>
		</SidebarContent>

		<SidebarFooter>
			<div className="px-2 text-[10px] text-muted-foreground group-data-[collapsible=icon]:hidden">
				© {new Date().getFullYear()} Kinder
			</div>
		</SidebarFooter>
	</Sidebar>
);
