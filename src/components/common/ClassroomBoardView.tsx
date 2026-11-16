import { draggable, dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { DoorOpen, GripVertical, PackageX } from "lucide-react";
import { memo, useEffect, useMemo, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const UNASSIGNED = "__unassigned__";

export type BoardItem = {
	id: string;
	title: string;
	subtitle?: string;
	badge?: string;
	classroom_id: string | null;
};

type Column = { id: string; name: string; capacity?: number | null };

const ItemCard = memo(({ item }: { item: BoardItem }) => {
	const ref = useRef<HTMLDivElement>(null);
	const [dragging, setDragging] = useState(false);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		return draggable({
			element: el,
			getInitialData: () => ({ type: "board-item", id: item.id }),
			onDragStart: () => setDragging(true),
			onDrop: () => setDragging(false),
		});
	}, [item.id]);

	return (
		<div
			ref={ref}
			className={cn(
				"group flex cursor-grab items-center gap-2 rounded-lg border bg-card px-2.5 py-2 text-sm shadow-sm transition-all",
				"hover:border-primary/50 hover:shadow-md active:cursor-grabbing",
				dragging && "rotate-1 opacity-40",
			)}
		>
			<GripVertical className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40 group-hover:text-muted-foreground" />
			<div className="min-w-0 flex-1">
				<p className="truncate font-medium">{item.title}</p>
				{item.subtitle && (
					<p className="truncate text-xs text-muted-foreground">{item.subtitle}</p>
				)}
			</div>
			{item.badge && (
				<Badge variant="secondary" className="shrink-0 text-[10px]">
					{item.badge}
				</Badge>
			)}
		</div>
	);
});
ItemCard.displayName = "ItemCard";

const Column = ({
	columnId,
	header,
	count,
	onDropItem,
	children,
}: {
	columnId: string;
	header: React.ReactNode;
	count: number;
	onDropItem: (itemId: string, columnId: string) => void;
	children: React.ReactNode;
}) => {
	const ref = useRef<HTMLDivElement>(null);
	const [isOver, setIsOver] = useState(false);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		return dropTargetForElements({
			element: el,
			canDrop: ({ source }) => source.data.type === "board-item",
			onDragEnter: () => setIsOver(true),
			onDragLeave: () => setIsOver(false),
			onDrop: ({ source }) => {
				setIsOver(false);
				const id = source.data.id;
				if (typeof id === "string") onDropItem(id, columnId);
			},
		});
	}, [columnId, onDropItem]);

	return (
		<div
			ref={ref}
			className={cn(
				"flex min-w-0 flex-col rounded-xl border bg-card/60 transition-all duration-150",
				isOver && "scale-[1.01] border-primary bg-primary/5 ring-2 ring-primary",
			)}
		>
			<div className="flex items-center justify-between gap-2 border-b px-3 py-2.5">
				<div className="min-w-0 flex-1">{header}</div>
				<span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs font-medium tabular-nums text-muted-foreground">
					{count}
				</span>
			</div>
			<div className="flex max-h-80 flex-1 flex-col gap-2 overflow-y-auto p-2 min-h-24">
				{children}
			</div>
		</div>
	);
};

type Props = {
	items: BoardItem[];
	classrooms: Column[];
	onMove: (itemId: string, classroomId: string | null) => void;
	emptyLabel?: string;
};

export const ClassroomBoardView = ({ items, classrooms, onMove, emptyLabel }: Props) => {
	const byRoom = useMemo(() => {
		const map = new Map<string, BoardItem[]>();
		for (const it of items) {
			const key = it.classroom_id ?? UNASSIGNED;
			map.set(key, [...(map.get(key) ?? []), it]);
		}
		return map;
	}, [items]);

	const handleDrop = (itemId: string, columnId: string) =>
		onMove(itemId, columnId === UNASSIGNED ? null : columnId);

	const unassigned = byRoom.get(UNASSIGNED) ?? [];

	return (
		<div className="grid gap-3 grid-cols-[repeat(auto-fill,minmax(240px,1fr))]">
			<Column
				columnId={UNASSIGNED}
				count={unassigned.length}
				onDropItem={handleDrop}
				header={
					<div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
						<PackageX className="h-3.5 w-3.5" /> Sin aula
					</div>
				}
			>
				{unassigned.map((it) => (
					<ItemCard key={it.id} item={it} />
				))}
				{unassigned.length === 0 && (
					<p className="py-6 text-center text-xs text-muted-foreground">
						{emptyLabel ?? "Arrastra aquí para quitar aula"}
					</p>
				)}
			</Column>

			{classrooms.map((c) => {
				const list = byRoom.get(c.id) ?? [];
				return (
					<Column
						key={c.id}
						columnId={c.id}
						count={list.length}
						onDropItem={handleDrop}
						header={
							<div className="min-w-0">
								<p className="flex items-center gap-1.5 truncate text-sm font-semibold">
									<DoorOpen className="h-3.5 w-3.5 shrink-0 text-primary" />
									{c.name}
								</p>
								{c.capacity != null && (
									<p className="text-xs text-muted-foreground">Capacidad {c.capacity}</p>
								)}
							</div>
						}
					>
						{list.map((it) => (
							<ItemCard key={it.id} item={it} />
						))}
						{list.length === 0 && (
							<p className="py-6 text-center text-xs text-muted-foreground">Suelta aquí</p>
						)}
					</Column>
				);
			})}
		</div>
	);
};
