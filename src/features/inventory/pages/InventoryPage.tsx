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
import {
	InventoryDeleteDialog,
	InventoryFormDialog,
} from "@/features/inventory/components/InventoryDialogs";
import { useInventoryPage } from "@/features/inventory/hooks/useInventoryPage";
import { useInventoryUiStore } from "@/features/inventory/stores/inventoryUi.store";
import { usePermission } from "@/hooks/usePermission";
import { inventoryService } from "@/services/inventory.service";
import type { InventoryItem } from "@/types/asset.types";

const ALL = "__all__";

const RowActions = ({ item }: { item: InventoryItem }) => {
	const openEdit = useInventoryUiStore((s) => s.openEdit);
	const openDelete = useInventoryUiStore((s) => s.openDelete);
	const canUpdate = usePermission("inventory", "update");
	const canDelete = usePermission("inventory", "delete");
	if (!canUpdate && !canDelete) return null;
	return (
		<div className="flex gap-1">
			{canUpdate && (
				<Button size="icon" variant="ghost" onClick={() => openEdit(item)}>
					<Pencil className="h-4 w-4" />
				</Button>
			)}
			{canDelete && (
				<Button
					size="icon"
					variant="ghost"
					className="text-destructive hover:text-destructive"
					onClick={() => openDelete(item)}
				>
					<Trash2 className="h-4 w-4" />
				</Button>
			)}
		</div>
	);
};

const columns: ColumnDef<InventoryItem>[] = [
	{ accessorKey: "item_code", header: "Código" },
	{ accessorKey: "name", header: "Nombre" },
	{
		accessorKey: "quantity",
		header: "Cantidad",
		cell: ({ row }) => <span className="tabular-nums">{row.original.quantity}</span>,
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
	{ id: "actions", header: "", cell: ({ row }) => <RowActions item={row.original} /> },
];

const InventoryBoard = ({ page }: { page: ReturnType<typeof useInventoryPage> }) => {
	const boardQ = useQuery({
		queryKey: ["inventory", "board"],
		queryFn: () => inventoryService.list({ limit: 200 }),
	});

	const items: BoardItem[] = useMemo(
		() =>
			(boardQ.data?.rows ?? []).map((it) => ({
				id: it.id,
				title: it.name,
				subtitle: `${it.item_code} · ${it.quantity} u`,
				badge: it.condition_name,
				classroom_id: it.classroom_id,
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

export const InventoryPage = () => {
	const page = useInventoryPage();
	const search = useInventoryUiStore((s) => s.filters.search);
	const classroomId = useInventoryUiStore((s) => s.filters.classroom_id);
	const setSearch = useInventoryUiStore((s) => s.setSearch);
	const setClassroom = useInventoryUiStore((s) => s.setClassroom);
	const openCreate = useInventoryUiStore((s) => s.openCreate);

	return (
		<div className="space-y-6">
			<PageHeader
				title="Inventario"
				description="Artículos y material por aula"
				actions={
					<PermissionGate module="inventory" action="create">
						<Button onClick={openCreate}>
							<Plus className="mr-2 h-4 w-4" /> Nuevo artículo
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
							placeholder="Buscar por código o nombre..."
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
						Arrastra cada artículo a la tarjeta del aula donde está guardado. "Sin aula" agrupa lo
						que aún no tiene ubicación.
					</p>
					<InventoryBoard page={page} />
				</TabsContent>
			</Tabs>

			<InventoryFormDialog page={page} />
			<InventoryDeleteDialog page={page} />
		</div>
	);
};
