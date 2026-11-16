import { Outlet } from "react-router";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/layouts/AppSidebar";
import { AppTopbar } from "@/layouts/AppTopbar";
import { useUiStore } from "@/stores/ui.store";

export const AppLayout = () => {
	const sidebarOpen = useUiStore((s) => s.sidebarOpen);
	const setSidebarOpen = useUiStore((s) => s.setSidebarOpen);

	return (
		<SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
			<AppSidebar />
			<SidebarInset>
				<AppTopbar />
				<main className="flex-1">
					<div className="mx-auto max-w-7xl p-6">
						<Outlet />
					</div>
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
};
