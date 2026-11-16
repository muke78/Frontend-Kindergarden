import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	type OnChangeFn,
	type RowSelectionState,
	useReactTable,
} from "@tanstack/react-table";

import { EmptyState } from "@/components/common/EmptyState";
import {
	DataTablePagination,
	type PaginationMeta,
} from "@/components/common/DataTablePagination";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

type Props<TData> = {
	columns: ColumnDef<TData>[];
	data: TData[];
	isLoading?: boolean;
	emptyMessage?: string;
	enableRowSelection?: boolean;
	rowSelection?: RowSelectionState;
	onRowSelectionChange?: OnChangeFn<RowSelectionState>;
	getRowId?: (row: TData) => string;
	pagination?: PaginationMeta;
	onPageChange?: (page: number) => void;
	onLimitChange?: (limit: number) => void;
};

const selectionCol = <TData,>(): ColumnDef<TData> => ({
	id: "select",
	header: ({ table }) => (
		<Checkbox
			checked={
				table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")
			}
			onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
			aria-label="Seleccionar todo"
		/>
	),
	cell: ({ row }) => (
		<Checkbox
			checked={row.getIsSelected()}
			onCheckedChange={(v) => row.toggleSelected(!!v)}
			aria-label="Seleccionar fila"
		/>
	),
	size: 40,
});

export const DataTable = <TData,>({
	columns,
	data,
	isLoading,
	emptyMessage,
	enableRowSelection,
	rowSelection,
	onRowSelectionChange,
	getRowId,
	pagination,
	onPageChange,
	onLimitChange,
}: Props<TData>) => {
	const cols: ColumnDef<TData>[] = enableRowSelection
		? [selectionCol<TData>(), ...columns]
		: columns;

	const table = useReactTable({
		data,
		columns: cols,
		getCoreRowModel: getCoreRowModel(),
		enableRowSelection: Boolean(enableRowSelection),
		state: enableRowSelection ? { rowSelection: rowSelection ?? {} } : undefined,
		onRowSelectionChange: enableRowSelection ? onRowSelectionChange : undefined,
		getRowId,
	});

	if (isLoading && data.length === 0) {
		return (
			<div className="rounded-md border p-3 space-y-2">
				{Array.from({ length: 5 }, (_, i) => `skeleton-${i}`).map((key) => (
					<Skeleton key={key} className="h-10 w-full" />
				))}
			</div>
		);
	}

	if (!isLoading && data.length === 0) {
		return (
			<div className="space-y-3">
				<EmptyState description={emptyMessage} />
				{pagination && pagination.total > 0 && onPageChange && onLimitChange && (
					<DataTablePagination
						pagination={pagination}
						onPageChange={onPageChange}
						onLimitChange={onLimitChange}
					/>
				)}
			</div>
		);
	}

	return (
		<div className="space-y-3">
			<div className="rounded-md border overflow-x-auto">
				<Table>
				<TableHeader className="bg-muted/40">
					{table.getHeaderGroups().map((group) => (
						<TableRow key={group.id}>
							{group.headers.map((header) => (
								<TableHead key={header.id} style={{ width: header.column.columnDef.size }}>
									{header.isPlaceholder
										? null
										: flexRender(header.column.columnDef.header, header.getContext())}
								</TableHead>
							))}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{table.getRowModel().rows.map((row) => (
						<TableRow
							key={row.id}
							className="hover:bg-muted/30 transition-colors"
							data-state={row.getIsSelected() ? "selected" : undefined}
						>
							{row.getVisibleCells().map((cell) => (
								<TableCell key={cell.id}>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
				</Table>
			</div>
			{pagination && onPageChange && onLimitChange && (
				<DataTablePagination
					pagination={pagination}
					onPageChange={onPageChange}
					onLimitChange={onLimitChange}
				/>
			)}
		</div>
	);
};
