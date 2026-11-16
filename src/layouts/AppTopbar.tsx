import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { UserMenu } from "@/components/common/UserMenu";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export const AppTopbar = () => (
	<header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
		<SidebarTrigger />
		<Separator orientation="vertical" className="h-5" />
		<Breadcrumbs />
		<div className="ml-auto flex items-center gap-1">
			<ThemeToggle />
			<UserMenu />
		</div>
	</header>
);
