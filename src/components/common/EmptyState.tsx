import { Inbox } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
	title?: string;
	description?: string;
	icon?: ReactNode;
	action?: ReactNode;
};

export const EmptyState = ({
	title = "Sin resultados",
	description = "No hay datos para mostrar",
	icon,
	action,
}: Props) => (
	<div className="flex flex-col items-center justify-center text-center py-12 gap-3">
		<div className="text-muted-foreground">{icon ?? <Inbox className="h-10 w-10" />}</div>
		<div className="space-y-1">
			<p className="font-medium">{title}</p>
			<p className="text-sm text-muted-foreground">{description}</p>
		</div>
		{action}
	</div>
);
