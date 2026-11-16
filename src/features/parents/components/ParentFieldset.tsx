import type { UseFormReturn } from "react-hook-form";

import { DatePickerField } from "@/components/common/DatePickerField";
import { LocationPicker } from "@/components/common/LocationPicker";
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

type CatOpt = { id: string; name: string };

type Props = {
	form: UseFormReturn<ParentFormValues>;
	catalogs: { genders: CatOpt[]; levels: CatOpt[]; statuses: CatOpt[] };
	autoFocus?: boolean;
};

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

const Sel = ({
	label,
	value,
	onChange,
	error,
	opts,
	placeholder = "Selecciona...",
}: {
	label: string;
	value: string;
	onChange: (v: string) => void;
	error?: string;
	opts: CatOpt[];
	placeholder?: string;
}) => (
	<div className="space-y-1">
		<Label>{label}</Label>
		<Select value={value} onValueChange={onChange}>
			<SelectTrigger>
				<SelectValue placeholder={placeholder} />
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

export const ParentFieldset = ({ form, catalogs, autoFocus }: Props) => {
	const {
		register,
		formState: { errors },
		watch,
		setValue,
	} = form;

	const sel = (f: "gender_id" | "education_level_id" | "status_id") => (v: string) =>
		setValue(f, v, { shouldValidate: true });

	return (
		<div className="space-y-3">
			<div className="grid grid-cols-3 gap-3">
				<Field label="Nombre(s)" error={errors.first_name?.message}>
					<Input {...register("first_name")} autoFocus={autoFocus} />
				</Field>
				<Field label="Apellido paterno" error={errors.paternal_surname?.message}>
					<Input {...register("paternal_surname")} />
				</Field>
				<Field label="Apellido materno" error={errors.maternal_surname?.message}>
					<Input {...register("maternal_surname")} />
				</Field>
			</div>

			<div className="grid grid-cols-3 gap-3">
				<Sel
					label="Género"
					value={watch("gender_id")}
					onChange={sel("gender_id")}
					error={errors.gender_id?.message}
					opts={catalogs.genders}
				/>
				<Field label="Fecha de nacimiento" error={errors.date_of_birth?.message}>
					<DatePickerField
						value={watch("date_of_birth")}
						onChange={(v) => setValue("date_of_birth", v, { shouldValidate: true })}
						error={Boolean(errors.date_of_birth)}
					/>
				</Field>
				<Field label="CURP" error={errors.curp?.message}>
					<Input
						value={watch("curp")}
						onChange={(e) =>
							setValue("curp", e.target.value.toUpperCase(), { shouldValidate: true })
						}
						maxLength={18}
						placeholder="XXXX000000XXXXXXX0"
					/>
				</Field>
			</div>

			<div className="grid grid-cols-3 gap-3">
				<Field label="Email" error={errors.email?.message}>
					<Input type="email" {...register("email")} />
				</Field>
				<Field label="Teléfono" error={errors.phone?.message}>
					<Input {...register("phone")} type="tel" inputMode="numeric" placeholder="10 dígitos" />
				</Field>
				<Field label="Ocupación (opt.)" error={errors.occupation?.message}>
					<Input {...register("occupation")} />
				</Field>
			</div>

			<div className="grid grid-cols-2 gap-3">
				<Sel
					label="Nivel educativo"
					value={watch("education_level_id")}
					onChange={sel("education_level_id")}
					error={errors.education_level_id?.message}
					opts={catalogs.levels}
				/>
				<Sel
					label="Estado"
					value={watch("status_id")}
					onChange={sel("status_id")}
					error={errors.status_id?.message}
					opts={catalogs.statuses}
				/>
			</div>

			<div className="flex items-center justify-between pt-1">
				<p className="text-xs text-muted-foreground">Domicilio</p>
				<LocationPicker
					onSelect={(addr) => {
						setValue("state", addr.state, { shouldValidate: true });
						setValue("suburb", addr.suburb, { shouldValidate: true });
						setValue("street", addr.street, { shouldValidate: true });
					}}
				/>
			</div>

			<div className="grid grid-cols-3 gap-3">
				<Field label="Estado/Entidad" error={errors.state?.message}>
					<Input {...register("state")} />
				</Field>
				<Field label="Colonia" error={errors.suburb?.message}>
					<Input {...register("suburb")} />
				</Field>
				<Field label="Calle y número" error={errors.street?.message}>
					<Input {...register("street")} />
				</Field>
			</div>

			<div className="grid grid-cols-2 gap-3">
				<Field label="Contacto de emergencia" error={errors.emergency_contact?.message}>
					<Input {...register("emergency_contact")} />
				</Field>
				<Field label="Tel. emergencia (opt.)" error={errors.emergency_phone?.message}>
					<Input
						{...register("emergency_phone")}
						type="tel"
						inputMode="numeric"
						placeholder="10 dígitos"
					/>
				</Field>
			</div>
		</div>
	);
};
