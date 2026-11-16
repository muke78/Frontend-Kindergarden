import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const ALL = "__all__";

type Option = { value: string; label: string };

type Props = {
	value?: string;
	onChange: (value?: string) => void;
	options: Option[];
	placeholder: string;
	className?: string;
};

/** Select de filtro con opción "Todos" que mapea a undefined. */
export const FilterSelect = ({ value, onChange, options, placeholder, className }: Props) => (
	<Select value={value ?? ALL} onValueChange={(v) => onChange(v === ALL ? undefined : v)}>
		<SelectTrigger className={className ?? "h-9 w-full sm:w-44"}>
			<SelectValue placeholder={placeholder} />
		</SelectTrigger>
		<SelectContent>
			<SelectItem value={ALL}>{placeholder}</SelectItem>
			{options.map((o) => (
				<SelectItem key={o.value} value={o.value}>
					{o.label}
				</SelectItem>
			))}
		</SelectContent>
	</Select>
);
