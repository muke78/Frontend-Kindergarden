import type { UseFormReturn } from "react-hook-form";

import { LocationPicker } from "@/components/common/LocationPicker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ParentFormValues } from "@/features/parents/hooks/useParentForm";

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
		{error && <p className="text-xs text-destructive mt-1">{error}</p>}
	</div>
);

export const ParentStep3 = ({ form }: { form: UseFormReturn<ParentFormValues> }) => {
	const {
		register,
		setValue,
		formState: { errors },
	} = form;

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<p className="text-sm text-muted-foreground">Dirección y contacto de emergencia</p>
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
					<Input {...register("state")} autoFocus />
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
				<Field label="Tel. emergencia" error={errors.emergency_phone?.message}>
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
