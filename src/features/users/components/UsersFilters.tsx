import { useQuery } from "@tanstack/react-query";
import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useUsersUiStore } from "@/features/users/stores/usersUi.store";
import { catalogsService } from "@/services/catalogs.service";
import { rolesService } from "@/services/roles.service";

const ALL = "__all__";

export const UsersFilters = () => {
	const filters = useUsersUiStore((s) => s.filters);
	const setSearch = useUsersUiStore((s) => s.setSearch);
	const setRole = useUsersUiStore((s) => s.setRole);
	const setStatus = useUsersUiStore((s) => s.setStatus);
	const resetFilters = useUsersUiStore((s) => s.resetFilters);

	const roles = useQuery({
		queryKey: ["roles", "all"],
		queryFn: () => rolesService.list({ limit: 200 }),
	});
	const statuses = useQuery({
		queryKey: ["catalogs", "statuses"],
		queryFn: catalogsService.statuses,
	});

	const hasFilters = filters.search || filters.roleId || filters.statusId;

	return (
		<div className="flex flex-wrap items-center gap-2">
			<div className="relative w-full sm:w-72">
				<Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
				<Input
					placeholder="Buscar nombre o email…"
					value={filters.search}
					onChange={(e) => setSearch(e.target.value)}
					className="pl-8"
				/>
			</div>
			<Select
				value={filters.roleId ?? ALL}
				onValueChange={(v) => setRole(v === ALL ? undefined : v)}
			>
				<SelectTrigger className="w-44">
					<SelectValue placeholder="Rol" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value={ALL}>Todos los roles</SelectItem>
					{roles.data?.rows.map((r) => (
						<SelectItem key={r.id} value={r.id}>
							{r.name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<Select
				value={filters.statusId ?? ALL}
				onValueChange={(v) => setStatus(v === ALL ? undefined : v)}
			>
				<SelectTrigger className="w-44">
					<SelectValue placeholder="Estado" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value={ALL}>Todos los estados</SelectItem>
					{statuses.data?.map((s) => (
						<SelectItem key={s.id} value={s.id}>
							{s.name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			{hasFilters && (
				<Button variant="ghost" size="sm" onClick={resetFilters}>
					<X className="mr-1 h-3 w-3" /> Limpiar
				</Button>
			)}
		</div>
	);
};
