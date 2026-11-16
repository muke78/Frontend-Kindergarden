import type { UseFormReturn } from "react-hook-form";

import { DatePickerField } from "@/components/common/DatePickerField";
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

type Props = {
	form: UseFormReturn<ParentFormValues>;
	catalogs: { genders: { id: string; name: string }[] };
};

export const ParentStep1 = ({ form, catalogs }: Props) => {
	const {
		register,
		formState: { errors },
		watch,
		setValue,
	} = form;

	return (
		<div className="space-y-4">
			<div className="grid grid-cols-3 gap-3">
				<Field label="Nombre(s)" error={errors.first_name?.message}>
					<Input {...register("first_name")} autoFocus />
				</Field>
				<Field label="Apellido paterno" error={errors.paternal_surname?.message}>
					<Input {...register("paternal_surname")} />
				</Field>
				<Field label="Apellido materno" error={errors.maternal_surname?.message}>
					<Input {...register("maternal_surname")} />
				</Field>
			</div>
			<div className="grid grid-cols-3 gap-3">
				<div className="space-y-1">
					<Label>Género</Label>
					<Select
						value={watch("gender_id")}
						onValueChange={(v) => setValue("gender_id", v, { shouldValidate: true })}
					>
						<SelectTrigger>
							<SelectValue placeholder="Selecciona..." />
						</SelectTrigger>
						<SelectContent>
							{catalogs.genders.map((g) => (
								<SelectItem key={g.id} value={g.id}>
									{g.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Err msg={errors.gender_id?.message} />
				</div>
				<Field label="Fecha de nacimiento" error={errors.date_of_birth?.message}>
					<DatePickerField
						value={watch("date_of_birth")}
						onChange={(v) => setValue("date_of_birth", v, { shouldValidate: true })}
						error={Boolean(errors.date_of_birth)}
					/>
				</Field>
				<Field label="CURP" error={errors.curp?.message}>
					<Input
						{...register("curp")}
						onChange={(e) =>
							setValue("curp", e.target.value.toUpperCase(), { shouldValidate: true })
						}
						value={watch("curp")}
						maxLength={18}
						placeholder="XXXX000000XXXXXXX0"
					/>
				</Field>
			</div>
		</div>
	);
};
