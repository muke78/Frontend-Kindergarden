import type { UseFormReturn } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

export const StudentStep4 = ({ form }: { form: UseFormReturn<StudentFormValues> }) => {
	const {
		register,
		formState: { errors },
	} = form;

	return (
		<div className="space-y-4">
			<div className="grid grid-cols-2 gap-3">
				<Field label="Contacto de emergencia" error={errors.emergency_contact?.message}>
					<Input {...register("emergency_contact")} autoFocus />
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
			<div className="grid grid-cols-2 gap-3">
				<Field label="Alergias" error={errors.allergies?.message}>
					<Textarea
						{...register("allergies")}
						rows={3}
						placeholder="Describe alergias conocidas..."
					/>
				</Field>
				<Field label="Condiciones médicas" error={errors.medical_conditions?.message}>
					<Textarea
						{...register("medical_conditions")}
						rows={3}
						placeholder="Condiciones médicas relevantes..."
					/>
				</Field>
			</div>
		</div>
	);
};
