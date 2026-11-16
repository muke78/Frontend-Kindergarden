import type { UseFormReturn } from "react-hook-form";

import { LocationPicker } from "@/components/common/LocationPicker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { StudentFormValues } from "@/features/students/hooks/useStudentForm";

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

export const StudentStep3 = ({ form }: { form: UseFormReturn<StudentFormValues> }) => {
	const {
		register,
		setValue,
		formState: { errors },
	} = form;

	return (
		<div className="space-y-4">
			<p className="text-sm text-muted-foreground">Dirección del alumno</p>
			<LocationPicker
				onSelect={(addr) => {
					setValue("state", addr.state, { shouldValidate: true });
					setValue("suburb", addr.suburb, { shouldValidate: true });
					setValue("street", addr.street, { shouldValidate: true });
				}}
			/>
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
		</div>
	);
};
