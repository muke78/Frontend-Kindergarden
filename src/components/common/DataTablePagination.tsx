import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export type PaginationMeta = { page: number; limit: number; total: number; pages: number };

const PAGE_SIZES = [5, 10, 20, 50, 100];

type Props = {
	pagination: PaginationMeta;
	onPageChange: (page: number) => void;
	onLimitChange: (limit: number) => void;
};

export const DataTablePagination = ({ pagination, onPageChange, onLimitChange }: Props) => {
	const { page, limit, total, pages } = pagination;
	const from = total === 0 ? 0 : (page - 1) * limit + 1;
	const to = Math.min(page * limit, total);

	return (
		<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
			{/* Rango + total */}
			<p className="text-center text-xs text-muted-foreground sm:text-left">
				<span className="font-medium text-foreground tabular-nums">
					{from}–{to}
				</span>{" "}
				de <span className="font-medium text-foreground tabular-nums">{total}</span>
			</p>

			<div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
				{/* Tamaño de página */}
				<div className="flex items-center justify-center gap-2">
					<span className="text-xs text-muted-foreground">Por página</span>
					<Select value={String(limit)} onValueChange={(v) => onLimitChange(Number(v))}>
						<SelectTrigger className="h-8 w-[72px]">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{PAGE_SIZES.map((s) => (
								<SelectItem key={s} value={String(s)}>
									{s}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Navegación */}
				<div className="flex items-center justify-center gap-1">
					<Button
						variant="outline"
						size="icon"
						className="h-8 w-8"
						disabled={page <= 1}
						onClick={() => onPageChange(1)}
						aria-label="Primera página"
					>
						<ChevronsLeft className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						size="icon"
						className="h-8 w-8"
						disabled={page <= 1}
						onClick={() => onPageChange(page - 1)}
						aria-label="Página anterior"
					>
						<ChevronLeft className="h-4 w-4" />
					</Button>
					<span className="min-w-[5.5rem] text-center text-xs tabular-nums text-muted-foreground">
						Pág. {page} / {Math.max(1, pages)}
					</span>
					<Button
						variant="outline"
						size="icon"
						className="h-8 w-8"
						disabled={page >= pages}
						onClick={() => onPageChange(page + 1)}
						aria-label="Página siguiente"
					>
						<ChevronRight className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						size="icon"
						className="h-8 w-8"
						disabled={page >= pages}
						onClick={() => onPageChange(pages)}
						aria-label="Última página"
					>
						<ChevronsRight className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
};
