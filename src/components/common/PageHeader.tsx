import type { ReactNode } from "react";

type Props = {
	title: string;
	description?: string;
	actions?: ReactNode;
};

export const PageHeader = ({ title, description, actions }: Props) => (
	<div className="flex items-start justify-between gap-4 pb-4 border-b">
		<div className="space-y-1">
			<h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
			{description && <p className="text-sm text-muted-foreground">{description}</p>}
		</div>
		{actions && <div className="flex items-center gap-2">{actions}</div>}
	</div>
);
