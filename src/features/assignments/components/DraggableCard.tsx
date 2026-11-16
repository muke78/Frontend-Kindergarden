import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { GripVertical } from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type Props = {
	itemId: string;
	type: string;
	className?: string;
	onOpen?: (itemId: string) => void;
	children: React.ReactNode;
};

export const DraggableCard = memo(({ itemId, type, className, onOpen, children }: Props) => {
	const ref = useRef<HTMLDivElement>(null);
	const [dragging, setDragging] = useState(false);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		return draggable({
			element: el,
			getInitialData: () => ({ type, id: itemId }),
			onDragStart: () => setDragging(true),
			onDrop: () => setDragging(false),
		});
	}, [itemId, type]);

	return (
		// biome-ignore lint/a11y/useSemanticElements: debe ser div (draggable + contiene checkbox interactivo)
		<div
			ref={ref}
			role="button"
			tabIndex={0}
			onClick={() => !dragging && onOpen?.(itemId)}
			onKeyDown={(e) => {
				if ((e.key === "Enter" || e.key === " ") && !dragging) {
					e.preventDefault();
					onOpen?.(itemId);
				}
			}}
			className={cn(
				"group flex cursor-grab items-center gap-2 rounded-lg border bg-card px-2.5 py-2 text-sm shadow-sm transition-all",
				"hover:border-primary/50 hover:shadow-md active:cursor-grabbing",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
				dragging && "opacity-40 rotate-1",
				className,
			)}
		>
			<GripVertical className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40 group-hover:text-muted-foreground" />
			{children}
		</div>
	);
});
DraggableCard.displayName = "DraggableCard";
