import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { curpField, dateField, personNameField, phoneField } from "@/lib/validations";
import type { Student } from "@/types/people.types";

const schema = z.object({
	gender_id: z.string().uuid("Selecciona un género"),
	grade_group_id: z.string().uuid("Selecciona grupo"),
	work_shift_id: z.string().uuid("Selecciona turno"),
	status_id: z.string().uuid("Selecciona estado"),
	first_name: personNameField,
	paternal_surname: personNameField,
	maternal_surname: personNameField.optional().or(z.literal("")).nullable(),
	date_of_birth: dateField,
	curp: curpField,
	state: z.string().min(2).max(100),
	suburb: z.string().min(2).max(120),
	street: z.string().min(2).max(180),
	emergency_contact: z.string().min(2).max(120),
	emergency_phone: phoneField.optional().or(z.literal("")).nullable(),
	enrollment_date: dateField,
	allergies: z.string().max(500).optional().nullable(),
	medical_conditions: z.string().max(500).optional().nullable(),
});

export type StudentFormValues = z.infer<typeof schema>;

const emptyDefaults: StudentFormValues = {
	gender_id: "",
	grade_group_id: "",
	work_shift_id: "",
	status_id: "",
	first_name: "",
	paternal_surname: "",
	maternal_surname: "",
	date_of_birth: "",
	curp: "",
	state: "",
	suburb: "",
	street: "",
	emergency_contact: "",
	emergency_phone: "",
	enrollment_date: new Date().toISOString().split("T")[0],
	allergies: "",
	medical_conditions: "",
};

export const useStudentForm = ({
	student,
	onSubmit,
	open,
}: {
	student?: Student;
	onSubmit: (v: StudentFormValues) => void;
	open: boolean;
}) => {
	const form = useForm<StudentFormValues>({
		resolver: zodResolver(schema),
		defaultValues: emptyDefaults,
	});

	useEffect(() => {
		form.reset(
			student
				? {
						gender_id: student.gender_id,
						grade_group_id: student.grade_group_id,
						work_shift_id: student.work_shift_id,
						status_id: student.status_id,
						first_name: student.first_name,
						paternal_surname: student.paternal_surname,
						maternal_surname: student.maternal_surname ?? "",
						date_of_birth: student.date_of_birth.split("T")[0],
						curp: student.curp,
						state: student.state,
						suburb: student.suburb,
						street: student.street,
						emergency_contact: student.emergency_contact,
						emergency_phone: student.emergency_phone ?? "",
						enrollment_date: student.enrollment_date.split("T")[0],
						allergies: student.allergies ?? "",
						medical_conditions: student.medical_conditions ?? "",
					}
				: emptyDefaults,
		);
	}, [student, open, form]);

	return { form, handleSubmit: form.handleSubmit(onSubmit), isEdit: Boolean(student) };
};
