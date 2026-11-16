import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
	steps: string[];
	step: number;
	isPending: boolean;
	onPrev: () => void;
	onNext: () => void;
	onSubmit: () => void;
	onClose: () => void;
	children: React.ReactNode;
};

export const FormWizard = ({
	steps,
	step,
	isPending,
	onPrev,
	onNext,
	onSubmit,
	onClose,
	children,
}: Props) => {
	const isLast = step === steps.length - 1;

	return (
		<div className="flex flex-col gap-6 pt-2">
			{/* Step indicators */}
			<div className="flex items-center">
				{steps.map((title, i) => (
					<div key={title} className={cn("flex items-center", i < steps.length - 1 && "flex-1")}>
						<div
							className={cn(
								"flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium border-2",
								i < step && "bg-primary border-primary text-primary-foreground",
								i === step && "border-primary text-primary",
								i > step && "border-muted-foreground/30 text-muted-foreground/50",
							)}
						>
							{i < step ? "✓" : i + 1}
						</div>
						<span
							className={cn(
								"ml-1.5 hidden text-xs sm:block",
								i === step ? "font-medium text-foreground" : "text-muted-foreground",
							)}
						>
							{title}
						</span>
						{i < steps.length - 1 && (
							<div className={cn("flex-1 h-px mx-3", i < step ? "bg-primary" : "bg-border")} />
						)}
					</div>
				))}
			</div>

			{/* Step content */}
			<div className="min-h-[220px]">{children}</div>

			{/* Navigation */}
			<div className="flex justify-between border-t pt-4">
				<Button
					type="button"
					variant="outline"
					onClick={step === 0 ? onClose : onPrev}
					disabled={isPending}
				>
					{step === 0 ? (
						"Cancelar"
					) : (
						<>
							<ChevronLeft className="h-4 w-4 mr-1" />
							Atrás
						</>
					)}
				</Button>

				{isLast ? (
					<Button type="button" onClick={onSubmit} disabled={isPending}>
						{isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						Guardar
					</Button>
				) : (
					<Button type="button" onClick={onNext}>
						Siguiente
						<ChevronRight className="h-4 w-4 ml-1" />
					</Button>
				)}
			</div>
		</div>
	);
};
