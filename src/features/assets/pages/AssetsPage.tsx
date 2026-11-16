import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { LayoutGrid, Pencil, Plus, Table2, Trash2 } from "lucide-react";
import { useMemo } from "react";

import { ClassroomBoardView, type BoardItem } from "@/components/common/ClassroomBoardView";
import { DataTable } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import { PermissionGate } from "@/components/common/PermissionGate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AssetDeleteDialog, AssetFormDialog } from "@/features/assets/components/AssetDialogs";
import { useAssetsPage } from "@/features/assets/hooks/useAssetsPage";
import { useAssetsUiStore } from "@/features/assets/stores/assetsUi.store";
import { usePermission } from "@/hooks/usePermission";
import { assetsService } from "@/services/assets.service";
import type { Asset } from "@/types/asset.types";

const ALL = "__all__";

const RowActions = ({ asset }: { asset: Asset }) => {
	const openEdit = useAssetsUiStore((s) => s.openEdit);
	const openDelete = useAssetsUiStore((s) => s.openDelete);
	const canUpdate = usePermission("assets", "update");
	const canDelete = usePermission("assets", "delete");
	if (!canUpdate && !canDelete) return null;
	return (
		<div className="flex gap-1">
			{canUpdate && (
				<Button size="icon" variant="ghost" onClick={() => openEdit(asset)}>
					<Pencil className="h-4 w-4" />
				</Button>
			)}
			{canDelete && (
				<Button
					size="icon"
					variant="ghost"
					className="text-destructive hover:text-destructive"
					onClick={() => openDelete(asset)}
				>
					<Trash2 className="h-4 w-4" />
				</Button>
			)}
		</div>
	);
};

const columns: ColumnDef<Asset>[] = [
	{ accessorKey: "name", header: "Nombre" },
	{
		accessorKey: "serial_number",
		header: "No. serie",
		cell: ({ row }) => row.original.serial_number ?? "—",
	},
	{
		accessorKey: "classroom_name",
		header: "Aula",
		cell: ({ row }) => row.original.classroom_name ?? "—",
	},
	{ accessorKey: "condition_name", header: "Condición" },
	{
		accessorKey: "status_name",
		header: "Estado",
		cell: ({ row }) => (
			<Badge variant={row.original.status_code === "active" ? "default" : "secondary"}>
				{row.original.status_name}
			</Badge>
		),
	},
	{
		accessorKey: "cost",
		header: "Costo",
		cell: ({ row }) =>
			`$${Number(row.original.cost).toLocaleString("es-MX", { minimumFractionDigits: 2 })}`,
	},
	{ id: "actions", header: "", cell: ({ row }) => <RowActions asset={row.original} /> },
];

const AssetsBoard = ({ page }: { page: ReturnType<typeof useAssetsPage> }) => {
	const boardQ = useQuery({
		queryKey: ["assets", "board"],
		queryFn: () => assetsService.list({ limit: 200 }),
	});

	const items: BoardItem[] = useMemo(
		() =>
			(boardQ.data?.rows ?? []).map((a) => ({
				id: a.id,
				title: a.name,
				subtitle: `${a.condition_name} · $${Number(a.cost).toLocaleString("es-MX")}`,
				badge: a.status_name,
				classroom_id: a.classroom_id,
			})),
		[boardQ.data],
	);

	return (
		<ClassroomBoardView
			items={items}
			classrooms={page.catalogs.classrooms}
			onMove={(id, classroom_id) => page.update.mutate({ id, payload: { classroom_id } })}
		/>
	);
};

export const AssetsPage = () => {
	const page = useAssetsPage();
	const search = useAssetsUiStore((s) => s.filters.search);
	const classroomId = useAssetsUiStore((s) => s.filters.classroom_id);
	const setSearch = useAssetsUiStore((s) => s.setSearch);
	const setClassroom = useAssetsUiStore((s) => s.setClassroom);
	const openCreate = useAssetsUiStore((s) => s.openCreate);

	return (
		<div className="space-y-6">
			<PageHeader
				title="Activos"
				description="Activos fijos del plantel y su aula asignada"
				actions={
					<PermissionGate module="assets" action="create">
						<Button onClick={openCreate}>
							<Plus className="mr-2 h-4 w-4" /> Nuevo activo
						</Button>
					</PermissionGate>
				}
			/>

			<Tabs defaultValue="table">
				<TabsList>
					<TabsTrigger value="table" className="gap-1.5">
						<Table2 className="h-4 w-4" /> Tabla
					</TabsTrigger>
					<TabsTrigger value="board" className="gap-1.5">
						<LayoutGrid className="h-4 w-4" /> Tablero por aula
					</TabsTrigger>
				</TabsList>

				<TabsContent value="table" className="space-y-4 pt-4">
					<div className="flex flex-wrap gap-3">
						<Input
							placeholder="Buscar por nombre o serie..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="max-w-sm"
						/>
						<Select
							value={classroomId ?? ALL}
							onValueChange={(v) => setClassroom(v === ALL ? undefined : v)}
						>
							<SelectTrigger className="w-44">
								<SelectValue placeholder="Todas las aulas" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value={ALL}>Todas las aulas</SelectItem>
								{page.catalogs.classrooms.map((c) => (
									<SelectItem key={c.id} value={c.id}>
										{c.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<DataTable columns={columns} data={page.rows} isLoading={page.isLoading} />
				</TabsContent>

				<TabsContent value="board" className="pt-4">
					<p className="mb-3 text-sm text-muted-foreground">
						Arrastra cada activo a la tarjeta del aula donde se encuentra. "Sin aula" agrupa los que
						aún no tienen ubicación.
					</p>
					<AssetsBoard page={page} />
				</TabsContent>
			</Tabs>

			<AssetFormDialog page={page} />
			<AssetDeleteDialog page={page} />
		</div>
	);
};
