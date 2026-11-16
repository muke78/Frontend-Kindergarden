import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

type Props = {
	open: boolean;
	onOpenChange: (value: boolean) => void;
	title: string;
	description?: string;
	confirmLabel?: string;
	cancelLabel?: string;
	destructive?: boolean;
	loading?: boolean;
	onConfirm: () => void;
};

export const ConfirmDialog = ({
	open,
	onOpenChange,
	title,
	description,
	confirmLabel = "Confirmar",
	cancelLabel = "Cancelar",
	destructive = false,
	loading = false,
	onConfirm,
}: Props) => (
	<Dialog open={open} onOpenChange={onOpenChange}>
		<DialogContent>
			<DialogHeader>
				<DialogTitle>{title}</DialogTitle>
				{description && <DialogDescription>{description}</DialogDescription>}
			</DialogHeader>
			<DialogFooter>
				<Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
					{cancelLabel}
				</Button>
				<Button
					variant={destructive ? "destructive" : "default"}
					onClick={onConfirm}
					disabled={loading}
				>
					{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
					{confirmLabel}
				</Button>
			</DialogFooter>
		</DialogContent>
	</Dialog>
);
