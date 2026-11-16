import { UserX } from "lucide-react";

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

export const TeacherBoard = ({ board }: Props) => {
	const { groups, teachersByGroup, handleDropTeacher, openTeacherDrawer } = board;
	const unassigned = teachersByGroup.get(UNASSIGNED) ?? [];

	return (
		<div className="grid gap-3 grid-cols-[repeat(auto-fill,minmax(250px,1fr))]">
			<BoardColumn
				columnId={UNASSIGNED}
				accepts="teacher"
				onDropItem={handleDropTeacher}
				count={unassigned.length}
				header={
					<div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
						<UserX className="h-3.5 w-3.5" /> Sin grupo
					</div>
				}
			>
				{unassigned.map((t) => (
					<DraggableCard key={t.id} itemId={t.id} type="teacher" onOpen={openTeacherDrawer}>
						<div className="min-w-0 flex-1">
							<p className="truncate font-medium">{t.full_name}</p>
							<p className="truncate text-xs text-muted-foreground">{t.work_shift_name}</p>
						</div>
					</DraggableCard>
				))}
				{unassigned.length === 0 && (
					<p className="py-6 text-center text-xs text-muted-foreground">
						Arrastra aquí para quitar grupo
					</p>
				)}
			</BoardColumn>

			{groups.map((g) => {
				const list = teachersByGroup.get(g.id) ?? [];
				return (
					<BoardColumn
						key={g.id}
						columnId={g.id}
						accepts="teacher"
						onDropItem={handleDropTeacher}
						count={list.length}
						header={<p className="truncate text-sm font-semibold">{g.label}</p>}
					>
						{list.map((t) => (
							<DraggableCard
								key={t.id}
								itemId={t.id}
								type="teacher"
								onOpen={openTeacherDrawer}
								className="border-primary/40 bg-primary/5"
							>
								<div className="min-w-0 flex-1">
									<p className="truncate font-medium">{t.full_name}</p>
									<p className="truncate text-xs text-muted-foreground">
										{t.students_in_charge} alumno(s) · {t.school_year ?? "—"}
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
