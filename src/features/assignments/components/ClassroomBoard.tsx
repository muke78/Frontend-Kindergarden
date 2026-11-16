import { DoorOpen, UserX } from "lucide-react";

import {
	UNASSIGNED,
	type useAssignmentsBoard,
} from "@/features/assignments/hooks/useAssignmentsBoard";

import { BoardColumn } from "./BoardColumn";
import { DraggableCard } from "./DraggableCard";

type Board = ReturnType<typeof useAssignmentsBoard>;

type Props = {
	board: Board;
};

export const ClassroomBoard = ({ board }: Props) => {
	const { classrooms, teachersByClassroom, handleDropClassroom, openTeacherDrawer } = board;
	const unassigned = teachersByClassroom.get(UNASSIGNED) ?? [];

	return (
		<div className="grid gap-3 grid-cols-[repeat(auto-fill,minmax(250px,1fr))]">
			<BoardColumn
				columnId={UNASSIGNED}
				accepts="teacher-room"
				onDropItem={handleDropClassroom}
				count={unassigned.length}
				header={
					<div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
						<UserX className="h-3.5 w-3.5" /> Sin aula
					</div>
				}
			>
				{unassigned.map((t) => (
					<DraggableCard key={t.id} itemId={t.id} type="teacher-room" onOpen={openTeacherDrawer}>
						<div className="min-w-0 flex-1">
							<p className="truncate font-medium">{t.full_name}</p>
							<p className="truncate text-xs text-muted-foreground">
								{t.grade_group_label ?? "Sin grupo"}
							</p>
						</div>
					</DraggableCard>
				))}
				{unassigned.length === 0 && (
					<p className="py-6 text-center text-xs text-muted-foreground">
						Arrastra aquí para quitar aula
					</p>
				)}
			</BoardColumn>

			{classrooms.map((c) => {
				const list = teachersByClassroom.get(c.id) ?? [];
				return (
					<BoardColumn
						key={c.id}
						columnId={c.id}
						accepts="teacher-room"
						onDropItem={handleDropClassroom}
						count={list.length}
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
						{list.map((t) => (
							<DraggableCard
								key={t.id}
								itemId={t.id}
								type="teacher-room"
								onOpen={openTeacherDrawer}
								className="border-primary/40 bg-primary/5"
							>
								<div className="min-w-0 flex-1">
									<p className="truncate font-medium">{t.full_name}</p>
									<p className="truncate text-xs text-muted-foreground">
										{t.grade_group_label ?? "Sin grupo"} · {t.work_shift_name}
									</p>
								</div>
							</DraggableCard>
						))}
						{list.length === 0 && (
							<p className="py-6 text-center text-xs text-muted-foreground">
								Suelta una maestra aquí
							</p>
						)}
					</BoardColumn>
				);
			})}
		</div>
	);
};
