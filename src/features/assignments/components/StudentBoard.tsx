import { ArrowRight, GraduationCap, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { useAssignmentsBoard } from "@/features/assignments/hooks/useAssignmentsBoard";

import { BoardColumn } from "./BoardColumn";
import { DraggableCard } from "./DraggableCard";

type Board = ReturnType<typeof useAssignmentsBoard>;

type Props = {
	board: Board;
};

export const StudentBoard = ({ board }: Props) => {
	const {
		groups,
		studentsByGroup,
		titularByGroup,
		selected,
		toggleSelect,
		clearSelection,
		bulkMove,
		handleDropStudent,
		openStudentDrawer,
		isPending,
	} = board;
	const [targetGroup, setTargetGroup] = useState("");

	return (
		<div className="relative">
			<div className="grid gap-3 grid-cols-[repeat(auto-fill,minmax(250px,1fr))]">
				{groups.map((g) => {
					const list = studentsByGroup.get(g.id) ?? [];
					const titular = titularByGroup.get(g.id);
					return (
						<BoardColumn
							key={g.id}
							columnId={g.id}
							accepts="student"
							onDropItem={handleDropStudent}
							count={list.length}
							header={
								<div className="min-w-0">
									<p className="truncate text-sm font-semibold">{g.label}</p>
									{titular ? (
										<p className="flex items-center gap-1 truncate text-xs text-primary">
											<GraduationCap className="h-3 w-3 shrink-0" />
											{titular.full_name}
										</p>
									) : (
										<p className="text-xs text-muted-foreground">Sin maestra titular</p>
									)}
								</div>
							}
						>
							{list.map((s) => (
								<DraggableCard
									key={s.id}
									itemId={s.id}
									type="student"
									onOpen={openStudentDrawer}
									className={selected.has(s.id) ? "border-primary bg-primary/10" : undefined}
								>
									<Checkbox
										checked={selected.has(s.id)}
										onCheckedChange={() => toggleSelect(s.id)}
										onClick={(e) => e.stopPropagation()}
										className="shrink-0"
									/>
									<div className="min-w-0 flex-1">
										<p className="truncate font-medium">{s.full_name}</p>
										<p className="truncate text-xs text-muted-foreground">{s.curp}</p>
									</div>
								</DraggableCard>
							))}
							{list.length === 0 && (
								<p className="py-6 text-center text-xs text-muted-foreground">Suelta alumnos aquí</p>
							)}
						</BoardColumn>
					);
				})}
			</div>

			{/* Barra flotante de acciones masivas */}
			{selected.size > 0 && (
				<div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full border bg-card px-4 py-2.5 shadow-lg animate-in slide-in-from-bottom-4">
					<span className="text-sm font-medium tabular-nums">{selected.size} seleccionado(s)</span>
					<Select value={targetGroup} onValueChange={setTargetGroup}>
						<SelectTrigger className="h-8 w-40">
							<SelectValue placeholder="Mover a grupo..." />
						</SelectTrigger>
						<SelectContent>
							{groups.map((g) => (
								<SelectItem key={g.id} value={g.id}>
									{g.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Button
						size="sm"
						className="h-8 gap-1"
						disabled={!targetGroup || isPending}
						onClick={() => bulkMove(targetGroup)}
					>
						Mover <ArrowRight className="h-3.5 w-3.5" />
					</Button>
					<Button size="icon" variant="ghost" className="h-7 w-7" onClick={clearSelection}>
						<X className="h-4 w-4" />
					</Button>
				</div>
			)}
		</div>
	);
};
