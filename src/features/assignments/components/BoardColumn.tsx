import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { memo, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Props = {
	columnId: string;
	accepts: string;
	onDropItem: (itemId: string, columnId: string) => void;
	header: React.ReactNode;
	count: number;
	children: React.ReactNode;
};

export const BoardColumn = memo(
	({ columnId, accepts, onDropItem, header, count, children }: Props) => {
		const ref = useRef<HTMLDivElement>(null);
		const [isOver, setIsOver] = useState(false);

		useEffect(() => {
			const el = ref.current;
			if (!el) return;
			return dropTargetForElements({
				element: el,
				getData: () => ({ columnId }),
				canDrop: ({ source }) => source.data.type === accepts,
				onDragEnter: () => setIsOver(true),
				onDragLeave: () => setIsOver(false),
				onDrop: ({ source }) => {
					setIsOver(false);
					const itemId = source.data.id;
					if (typeof itemId === "string") onDropItem(itemId, columnId);
				},
			});
		}, [columnId, accepts, onDropItem]);

		return (
			<div
				ref={ref}
				className={cn(
					"flex min-w-0 flex-col rounded-xl border bg-card/60 transition-all duration-150",
					isOver && "ring-2 ring-primary border-primary bg-primary/5 scale-[1.01]",
				)}
			>
				<div className="flex items-center justify-between gap-2 border-b px-3 py-2.5">
					<div className="min-w-0 flex-1">{header}</div>
					<span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs font-medium tabular-nums text-muted-foreground">
						{count}
					</span>
				</div>
				<div className="flex flex-1 flex-col gap-2 overflow-y-auto p-2 min-h-[110px] max-h-80">
					{children}
				</div>
			</div>
		);
	},
);
BoardColumn.displayName = "BoardColumn";
