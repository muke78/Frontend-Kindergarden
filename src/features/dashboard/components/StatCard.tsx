import type { LucideIcon } from "lucide-react";
import { memo } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
	label: string;
	value: number | string;
	icon: LucideIcon;
	hint?: string;
	loading?: boolean;
};

export const StatCard = memo(({ label, value, icon: Icon, hint, loading }: Props) => (
	<Card className="overflow-hidden transition-colors hover:border-primary/40">
		<CardContent className="p-5">
			<div className="flex items-start justify-between gap-3">
				<div className="space-y-1.5 min-w-0">
					<p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
						{label}
					</p>
					{loading ? (
						<Skeleton className="h-8 w-16" />
					) : (
						<p className="text-3xl font-semibold tabular-nums leading-none">{value}</p>
					)}
					{hint && <p className="text-xs text-muted-foreground">{hint}</p>}
				</div>
				<div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
					<Icon className="h-5 w-5" />
				</div>
			</div>
		</CardContent>
	</Card>
));
StatCard.displayName = "StatCard";
