import { format, isValid, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type Props = {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	disabled?: boolean;
	error?: boolean;
};

export const DatePickerField = ({
	value,
	onChange,
	placeholder = "Selecciona fecha",
	disabled,
	error,
}: Props) => {
	const parsed = value ? parseISO(value) : undefined;
	const selected = parsed && isValid(parsed) ? parsed : undefined;

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					type="button"
					variant="outline"
					disabled={disabled}
					className={cn(
						"w-full justify-start text-left font-normal",
						!selected && "text-muted-foreground",
						error && "border-destructive",
					)}
				>
					<CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
					{selected ? format(selected, "d 'de' MMMM yyyy", { locale: es }) : placeholder}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align="start">
				<Calendar
					mode="single"
					selected={selected}
					onSelect={(date) => onChange(date ? format(date, "yyyy-MM-dd") : "")}
					locale={es}
					captionLayout="dropdown"
					startMonth={new Date(1950, 0)}
					endMonth={new Date(new Date().getFullYear() + 1, 11)}
					autoFocus
				/>
			</PopoverContent>
		</Popover>
	);
};
