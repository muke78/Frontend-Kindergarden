import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
	page: number;
	pages: number;
	total: number;
	onPageChange: (page: number) => void;
};

export const Pagination = ({ page, pages, total, onPageChange }: Props) => (
	<div className="flex items-center justify-between text-sm text-muted-foreground pt-3">
		<span>
			Página {page} de {pages} · {total} registros
		</span>
		<div className="flex gap-2">
			<Button
				variant="outline"
				size="sm"
				onClick={() => onPageChange(page - 1)}
				disabled={page <= 1}
			>
				<ChevronLeft className="h-4 w-4" />
			</Button>
			<Button
				variant="outline"
				size="sm"
				onClick={() => onPageChange(page + 1)}
				disabled={page >= pages}
			>
				<ChevronRight className="h-4 w-4" />
			</Button>
		</div>
	</div>
);
