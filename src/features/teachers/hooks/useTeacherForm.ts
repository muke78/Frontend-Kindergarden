import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { curpField, dateField, emailField, personNameField, phoneField } from "@/lib/validations";
import type { Teacher } from "@/types/people.types";

const schema = z.object({
	gender_id: z.string().uuid("Selecciona un género"),
	education_level_id: z.string().uuid("Selecciona nivel educativo"),
	work_shift_id: z.string().uuid("Selecciona un turno"),
	status_id: z.string().uuid("Selecciona un estado"),
	first_name: personNameField,
	paternal_surname: personNameField,
	maternal_surname: personNameField.optional().or(z.literal("")).nullable(),
	date_of_birth: dateField,
	curp: curpField,
	email: emailField,
	phone: phoneField,
	state: z.string().min(2).max(100),
	suburb: z.string().min(2).max(120),
	street: z.string().min(2).max(180),
	emergency_contact: z.string().min(2).max(120),
	emergency_phone: phoneField.optional().or(z.literal("")).nullable(),
	school_name: z.string().max(180).optional().nullable(),
	cct: z.string().max(45).optional().nullable(),
	school_zone: z.string().max(20).optional().nullable(),
	grade_group_id: z.string().uuid().optional().or(z.literal("")).nullable(),
	school_year: z
		.string()
		.regex(/^\d{4}-\d{4}$/)
		.optional()
		.or(z.literal(""))
		.nullable(),
});

export type TeacherFormValues = z.infer<typeof schema>;

const emptyDefaults: TeacherFormValues = {
	gender_id: "",
	education_level_id: "",
	work_shift_id: "",
	status_id: "",
	first_name: "",
	paternal_surname: "",
	maternal_surname: "",
	date_of_birth: "",
	curp: "",
	email: "",
	phone: "",
	state: "",
	suburb: "",
	street: "",
	emergency_contact: "",
	emergency_phone: "",
	school_name: "",
	cct: "",
	school_zone: "",
	grade_group_id: "",
	school_year: "",
};

export const useTeacherForm = ({
	teacher,
	onSubmit,
	open,
}: {
	teacher?: Teacher;
	onSubmit: (v: TeacherFormValues) => void;
	open: boolean;
}) => {
	const form = useForm<TeacherFormValues>({
		resolver: zodResolver(schema),
		defaultValues: emptyDefaults,
	});

	useEffect(() => {
		form.reset(
			teacher
				? {
						gender_id: teacher.gender_id,
						education_level_id: teacher.education_level_id,
						work_shift_id: teacher.work_shift_id,
						status_id: teacher.status_id,
						first_name: teacher.first_name,
						paternal_surname: teacher.paternal_surname,
						maternal_surname: teacher.maternal_surname ?? "",
						date_of_birth: teacher.date_of_birth.split("T")[0],
						curp: teacher.curp,
						email: teacher.email,
						phone: teacher.phone,
						state: teacher.state,
						suburb: teacher.suburb,
						street: teacher.street,
						emergency_contact: teacher.emergency_contact,
						emergency_phone: teacher.emergency_phone ?? "",
						school_name: teacher.school_name ?? "",
						cct: teacher.cct ?? "",
						school_zone: teacher.school_zone ?? "",
						grade_group_id: teacher.grade_group_id ?? "",
						school_year: teacher.school_year ?? "",
					}
				: emptyDefaults,
		);
	}, [teacher, open, form]);

	return { form, handleSubmit: form.handleSubmit(onSubmit), isEdit: Boolean(teacher) };
};
