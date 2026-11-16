import { memo, useMemo } from "react";
import { Cell, Pie, PieChart } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { useStudentsByGenderQuery } from "@/features/dashboard/hooks/useStudentsByGenderQuery";

const PALETTE = [
	"var(--chart-1)",
	"var(--chart-2)",
	"var(--chart-3)",
	"var(--chart-4)",
	"var(--chart-5)",
];

const slug = (s: string) =>
	s
		.toLowerCase()
		.normalize("NFD")
		.replace(/[̀-ͯ]/g, "")
		.replace(/[^a-z0-9]+/g, "_")
		.replace(/^_|_$/g, "");

export const StudentsByGenderChart = memo(() => {
	const { data, isLoading, isError } = useStudentsByGenderQuery();
	const rows = data ?? [];

	const { chartData, config } = useMemo(() => {
		const cfg: ChartConfig = { value: { label: "Alumnos" } };
		const rowsSlug = rows.map((row, i) => {
			const key = slug(row.name) || `g${i}`;
			cfg[key] = { label: row.name, color: PALETTE[i % PALETTE.length] };
			return { name: row.name, value: row.value, fill: `var(--color-${key})`, key };
		});
		return { chartData: rowsSlug, config: cfg };
	}, [rows]);

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-base">Alumnos por género</CardTitle>
			</CardHeader>
			<CardContent className="flex items-center justify-center">
				{isLoading ? (
					<Skeleton className="h-48 w-48 rounded-full" />
				) : isError ? (
					<p className="py-12 text-center text-sm text-destructive">Error al cargar datos</p>
				) : chartData.length === 0 ? (
					<p className="py-12 text-center text-sm text-muted-foreground">Sin alumnos registrados</p>
				) : (
					<ChartContainer config={config} className="mx-auto aspect-square h-[240px] w-full max-w-[300px]">
						<PieChart>
							<ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
							<Pie
								data={chartData}
								dataKey="value"
								nameKey="name"
								innerRadius={55}
								outerRadius={90}
								paddingAngle={2}
								strokeWidth={2}
							>
								{chartData.map((row) => (
									<Cell key={row.key} fill={row.fill} />
								))}
							</Pie>
							<ChartLegend content={<ChartLegendContent nameKey="name" />} />
						</PieChart>
					</ChartContainer>
				)}
			</CardContent>
		</Card>
	);
});
StudentsByGenderChart.displayName = "StudentsByGenderChart";
