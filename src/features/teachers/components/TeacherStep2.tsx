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
import type { TeacherFormValues } from "@/features/teachers/hooks/useTeacherForm";

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
type GroupOpt = { id: string; label: string };

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
	form: UseFormReturn<TeacherFormValues>;
	catalogs: { levels: CatOpt[]; shifts: CatOpt[]; statuses: CatOpt[]; gradeGroups: GroupOpt[] };
};

export const TeacherStep2 = ({ form, catalogs }: Props) => {
	const {
		register,
		formState: { errors },
		watch,
		setValue,
	} = form;

	const sel = (f: "education_level_id" | "work_shift_id" | "status_id") => (v: string) =>
		setValue(f, v, { shouldValidate: true });

	return (
		<div className="space-y-4">
			<div className="grid grid-cols-3 gap-3">
				<Sel
					label="Nivel educativo"
					value={watch("education_level_id")}
					onChange={sel("education_level_id")}
					error={errors.education_level_id?.message}
					opts={catalogs.levels}
				/>
				<Sel
					label="Turno"
					value={watch("work_shift_id")}
					onChange={sel("work_shift_id")}
					error={errors.work_shift_id?.message}
					opts={catalogs.shifts}
				/>
				<Sel
					label="Estado"
					value={watch("status_id")}
					onChange={sel("status_id")}
					error={errors.status_id?.message}
					opts={catalogs.statuses}
				/>
			</div>
			<div className="grid grid-cols-2 gap-3">
				<Field label="Email" error={errors.email?.message}>
					<Input type="email" {...register("email")} />
				</Field>
				<Field label="Teléfono" error={errors.phone?.message}>
					<Input {...register("phone")} type="tel" inputMode="numeric" placeholder="10 dígitos" />
				</Field>
				<Field label="Escuela (optativo)" error={errors.school_name?.message}>
					<Input {...register("school_name")} />
				</Field>
				<Field label="CCT (optativo)" error={errors.cct?.message}>
					<Input {...register("cct")} />
				</Field>
				<Field label="Zona escolar (optativo)" error={errors.school_zone?.message}>
					<Input {...register("school_zone")} />
				</Field>
				<div className="space-y-1">
					<Label>Grupo asignado (optativo)</Label>
					<Select
						value={watch("grade_group_id") ?? ""}
						onValueChange={(v) =>
							setValue("grade_group_id", v === "__none__" ? "" : v, { shouldValidate: true })
						}
					>
						<SelectTrigger>
							<SelectValue placeholder="Sin grupo" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="__none__">Sin grupo</SelectItem>
							{catalogs.gradeGroups.map((g) => (
								<SelectItem key={g.id} value={g.id}>
									{g.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Err msg={errors.grade_group_id?.message} />
				</div>
			</div>
		</div>
	);
};
