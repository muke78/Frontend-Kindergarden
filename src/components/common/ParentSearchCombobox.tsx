import { Check, ChevronsUpDown, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type ParentRow = { id: string; full_name: string; phone?: string | null };

type Props = {
	parents: ParentRow[];
	value: string;
	onChange: (id: string) => void;
	disabled?: boolean;
};

export const ParentSearchCombobox = ({ parents, value, onChange, disabled }: Props) => {
	const [open, setOpen] = useState(false);
	const [search, setSearch] = useState("");

	const filtered = useMemo(() => {
		const q = search.trim().toLowerCase();
		return q
			? parents.filter(
					(p) => p.full_name.toLowerCase().includes(q) || (p.phone && p.phone.includes(q)),
				)
			: parents;
	}, [parents, search]);

	const selected = parents.find((p) => p.id === value);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					type="button"
					variant="outline"
					role="combobox"
					disabled={disabled}
					className={cn("w-full justify-between font-normal", !selected && "text-muted-foreground")}
				>
					<span className="truncate">{selected?.full_name ?? "Buscar padre/tutor..."}</span>
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[320px] p-0" align="start">
				<div className="flex items-center border-b px-3">
					<Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
					<Input
						className="h-9 border-0 shadow-none focus-visible:ring-0 px-0"
						placeholder="Nombre o teléfono..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>
				<div className="max-h-52 overflow-y-auto">
					{filtered.length === 0 ? (
						<div className="py-6 text-center text-sm text-muted-foreground">Sin resultados.</div>
					) : (
						<div className="p-1">
							{filtered.map((p) => (
								<button
									key={p.id}
									type="button"
									className={cn(
										"flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent cursor-pointer",
										p.id === value && "bg-accent/60",
									)}
									onClick={() => {
										onChange(p.id);
										setSearch("");
										setOpen(false);
									}}
								>
									<Check
										className={cn("h-4 w-4 shrink-0", p.id === value ? "opacity-100" : "opacity-0")}
									/>
									<div className="flex flex-col items-start">
										<span>{p.full_name}</span>
										{p.phone && <span className="text-xs text-muted-foreground">{p.phone}</span>}
									</div>
								</button>
							))}
						</div>
					)}
				</div>
			</PopoverContent>
		</Popover>
	);
};
