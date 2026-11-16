import type { UseFormReturn } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { ParentFormValues } from "@/features/parents/hooks/useParentForm";

const Err = ({ msg }: { msg?: string }) =>
	msg ? <p className="text-xs text-destructive mt-1">{msg}</p> : null;

const Field = ({
	label,
	error,
	children,
}: {
	label: string;
	error?: string;
	children: React.ReactNode;
}) => (
	<div className="space-y-1">
		<Label>{label}</Label>
		{children}
		<Err msg={error} />
	</div>
);

type CatOpt = { id: string; name: string };

const Sel = ({
	label,
	value,
	onChange,
	error,
	opts,
}: {
	label: string;
	value: string;
	onChange: (v: string) => void;
	error?: string;
	opts: CatOpt[];
}) => (
	<div className="space-y-1">
		<Label>{label}</Label>
		<Select value={value} onValueChange={onChange}>
			<SelectTrigger>
				<SelectValue placeholder="Selecciona..." />
			</SelectTrigger>
			<SelectContent>
				{opts.map((o) => (
					<SelectItem key={o.id} value={o.id}>
						{o.name}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
		<Err msg={error} />
	</div>
);

type Props = {
	form: UseFormReturn<ParentFormValues>;
	catalogs: { levels: CatOpt[]; statuses: CatOpt[] };
};

export const ParentStep2 = ({ form, catalogs }: Props) => {
	const {
		register,
		formState: { errors },
		watch,
		setValue,
	} = form;

	return (
		<div className="space-y-4">
			<div className="grid grid-cols-2 gap-3">
				<Sel
					label="Nivel educativo"
					value={watch("education_level_id")}
					onChange={(v) => setValue("education_level_id", v, { shouldValidate: true })}
					error={errors.education_level_id?.message}
					opts={catalogs.levels}
				/>
				<Sel
					label="Estado"
					value={watch("status_id")}
					onChange={(v) => setValue("status_id", v, { shouldValidate: true })}
					error={errors.status_id?.message}
					opts={catalogs.statuses}
				/>
				<Field label="Email" error={errors.email?.message}>
					<Input type="email" {...register("email")} />
				</Field>
				<Field label="Teléfono" error={errors.phone?.message}>
					<Input {...register("phone")} type="tel" inputMode="numeric" placeholder="10 dígitos" />
				</Field>
				<Field label="Ocupación (optativo)" error={errors.occupation?.message}>
					<Input {...register("occupation")} />
				</Field>
			</div>
		</div>
	);
};
