import type { UseFormReturn } from "react-hook-form";

import { DatePickerField } from "@/components/common/DatePickerField";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { StudentFormValues } from "@/features/students/hooks/useStudentForm";

const Err = ({ msg }: { msg?: string }) =>
	msg ? <p className="text-xs text-destructive mt-1">{msg}</p> : null;

type CatOpt = { id: string; name?: string; label?: string };

const CatSelect = ({
	label,
	value,
	onValueChange,
	error,
	options,
}: {
	label: string;
	value: string;
	onValueChange: (v: string) => void;
	error?: string;
	options: CatOpt[];
}) => (
	<div className="space-y-1">
		<Label>{label}</Label>
		<Select value={value} onValueChange={onValueChange}>
			<SelectTrigger>
				<SelectValue placeholder="Selecciona..." />
			</SelectTrigger>
			<SelectContent>
				{options.map((o) => (
					<SelectItem key={o.id} value={o.id}>
						{o.label ?? o.name}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
		<Err msg={error} />
	</div>
);

type Props = {
	form: UseFormReturn<StudentFormValues>;
	catalogs: { gradeGroups: CatOpt[]; shifts: CatOpt[]; statuses: CatOpt[] };
};

export const StudentStep2 = ({ form, catalogs }: Props) => {
	const {
		formState: { errors },
		watch,
		setValue,
	} = form;

	const sel = (field: "grade_group_id" | "work_shift_id" | "status_id") => (v: string) =>
		setValue(field, v, { shouldValidate: true });

	return (
		<div className="space-y-4">
			<div className="grid grid-cols-2 gap-3">
				<CatSelect
					label="Grupo"
					value={watch("grade_group_id")}
					onValueChange={sel("grade_group_id")}
					error={errors.grade_group_id?.message}
					options={catalogs.gradeGroups}
				/>
				<CatSelect
					label="Turno"
					value={watch("work_shift_id")}
					onValueChange={sel("work_shift_id")}
					error={errors.work_shift_id?.message}
					options={catalogs.shifts}
				/>
				<CatSelect
					label="Estado"
					value={watch("status_id")}
					onValueChange={sel("status_id")}
					error={errors.status_id?.message}
					options={catalogs.statuses}
				/>
				<div className="space-y-1">
					<Label>Fecha de inscripción</Label>
					<DatePickerField
						value={watch("enrollment_date")}
						onChange={(v) => setValue("enrollment_date", v, { shouldValidate: true })}
						error={Boolean(errors.enrollment_date)}
					/>
					<Err msg={errors.enrollment_date?.message} />
				</div>
			</div>
		</div>
	);
};
