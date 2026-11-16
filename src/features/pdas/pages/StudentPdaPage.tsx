import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { usePdaEvalMutations } from "@/features/pdas/hooks/usePdasMutations";
import {
	usePdaCategories,
	usePdaEvaluations,
	usePdaItems,
} from "@/features/pdas/hooks/usePdasQueries";
import type { PdaEvaluation } from "@/services/pdas.service";
import { studentsService } from "@/services/students.service";
import { useAuthStore } from "@/stores/auth.store";

const LEVELS = [
	{ value: "logrado", label: "Logrado", color: "bg-green-500/20 text-green-700 border-green-300" },
	{
		value: "en_proceso",
		label: "En proceso",
		color: "bg-yellow-500/20 text-yellow-700 border-yellow-300",
	},
	{ value: "no_logrado", label: "No logrado", color: "bg-red-500/20 text-red-700 border-red-300" },
] as const;

const SCHOOL_YEAR = `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`;

const LevelBadge = ({ level }: { level: PdaEvaluation["level"] | undefined }) => {
	if (!level) return <span className="text-xs text-muted-foreground">—</span>;
	const l = LEVELS.find((x) => x.value === level);
	return <Badge className={`text-xs border ${l?.color}`}>{l?.label}</Badge>;
};

export const StudentPdaPage = () => {
	const { studentId } = useParams<{ studentId: string }>();
	const user = useAuthStore((s) => s.user);
	const [period, setPeriod] = useState<"1" | "2" | "3">("1");

	const { data: student } = useQuery({
		queryKey: ["student", studentId],
		queryFn: () => studentsService.get(studentId!),
		enabled: !!studentId,
	});

	// grade_group_label is "Primero A", "Segundo B", etc. — first word = grade name used in PDA items
	const gradeName = student?.grade_group_label?.split(/\s+/)[0];

	const { data: categories = [] } = usePdaCategories();
	const { data: allItems = [] } = usePdaItems({ grade_name: gradeName });
	const { data: evaluations = [] } = usePdaEvaluations({
		student_id: studentId!,
		school_year: SCHOOL_YEAR,
		period: Number(period),
	});

	const { upsert } = usePdaEvalMutations(studentId!);

	const evalMap = new Map(evaluations.map((e) => [e.pda_item_id, e]));

	const handleLevel = (itemId: string, level: PdaEvaluation["level"]) => {
		if (!student || !user) return;
		upsert.mutate({
			student_id: studentId!,
			pda_item_id: itemId,
			teacher_id: user.id,
			grade_group_id: student.grade_group_id ?? "",
			school_year: SCHOOL_YEAR,
			period: Number(period) as 1 | 2 | 3,
			level,
			evaluated_at: new Date().toISOString().split("T")[0],
		});
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-xl font-semibold">{student?.full_name ?? "Cargando..."}</h1>
					<p className="text-sm text-muted-foreground">Evaluación PDA · Ciclo {SCHOOL_YEAR}</p>
				</div>
				<div className="flex items-center gap-2">
					<span className="text-sm text-muted-foreground">Trimestre:</span>
					<Select value={period} onValueChange={(v) => setPeriod(v as "1" | "2" | "3")}>
						<SelectTrigger className="w-32">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="1">Primero</SelectItem>
							<SelectItem value="2">Segundo</SelectItem>
							<SelectItem value="3">Tercero</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			{categories.map((cat) => {
				const catItems = allItems.filter((i) => i.category_id === cat.id);
				if (catItems.length === 0) return null;
				return (
					<Card key={cat.id}>
						<CardHeader className="py-3 px-4">
							<div className="flex items-center gap-2">
								<div className="h-3 w-3 rounded-full" style={{ background: cat.color }} />
								<CardTitle className="text-sm">{cat.name}</CardTitle>
							</div>
						</CardHeader>
						<CardContent className="pb-3 px-4 space-y-2">
							{catItems.map((item) => {
								const ev = evalMap.get(item.id);
								return (
									<div
										key={item.id}
										className="flex items-center gap-3 rounded-md border px-3 py-2"
									>
										<p className="flex-1 text-sm">{item.description}</p>
										<div className="flex gap-1">
											{LEVELS.map((l) => (
												<Button
													key={l.value}
													size="sm"
													variant={ev?.level === l.value ? "default" : "outline"}
													className="h-7 text-xs"
													onClick={() => handleLevel(item.id, l.value)}
													disabled={upsert.isPending}
												>
													{l.label}
												</Button>
											))}
										</div>
										<LevelBadge level={ev?.level} />
									</div>
								);
							})}
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
};
