import { memo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { useStudentsByGroupQuery } from "@/features/dashboard/hooks/useStudentsByGroupQuery";

const config = {
	total: { label: "Alumnos", color: "var(--chart-1)" },
} satisfies ChartConfig;

export const StudentsByGroupChart = memo(() => {
	const { data, isLoading } = useStudentsByGroupQuery();
	const rows = data ?? [];

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-base">Alumnos por grupo</CardTitle>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<Skeleton className="h-48 w-full" />
				) : rows.length === 0 ? (
					<p className="py-12 text-center text-sm text-muted-foreground">Sin datos</p>
				) : (
					<ChartContainer config={config} className="h-[220px] w-full">
						<BarChart data={rows} margin={{ top: 8, right: 8, left: -16, bottom: 4 }}>
							<CartesianGrid vertical={false} strokeDasharray="3 3" />
							<XAxis dataKey="grupo" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
							<YAxis
								allowDecimals={false}
								tickLine={false}
								axisLine={false}
								tick={{ fontSize: 11 }}
							/>
							<ChartTooltip content={<ChartTooltipContent />} cursor={false} />
							<Bar dataKey="total" fill="var(--color-total)" radius={[6, 6, 0, 0]} />
						</BarChart>
					</ChartContainer>
				)}
			</CardContent>
		</Card>
	);
});
StudentsByGroupChart.displayName = "StudentsByGroupChart";
