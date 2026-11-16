import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { curpField, dateField, emailField, personNameField, phoneField } from "@/lib/validations";
import type { Parent } from "@/types/people.types";

const schema = z.object({
	gender_id: z.string().uuid("Selecciona un género"),
	education_level_id: z.string().uuid("Selecciona nivel educativo"),
	status_id: z.string().uuid("Selecciona estado"),
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
	occupation: z.string().max(120).optional().nullable(),
});

export type ParentFormValues = z.infer<typeof schema>;

const emptyDefaults: ParentFormValues = {
	gender_id: "",
	education_level_id: "",
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
	occupation: "",
};

export const useParentForm = ({
	parent,
	onSubmit,
	open,
}: {
	parent?: Parent;
	onSubmit: (v: ParentFormValues) => void;
	open: boolean;
}) => {
	const form = useForm<ParentFormValues>({
		resolver: zodResolver(schema),
		defaultValues: emptyDefaults,
	});

	useEffect(() => {
		form.reset(
			parent
				? {
						gender_id: parent.gender_id,
						education_level_id: parent.education_level_id,
						status_id: parent.status_id,
						first_name: parent.first_name,
						paternal_surname: parent.paternal_surname,
						maternal_surname: parent.maternal_surname ?? "",
						date_of_birth: parent.date_of_birth.split("T")[0],
						curp: parent.curp,
						email: parent.email,
						phone: parent.phone,
						state: parent.state,
						suburb: parent.suburb,
						street: parent.street,
						emergency_contact: parent.emergency_contact,
						emergency_phone: parent.emergency_phone ?? "",
						occupation: parent.occupation ?? "",
					}
				: emptyDefaults,
		);
	}, [parent, open, form]);

	return { form, handleSubmit: form.handleSubmit(onSubmit), isEdit: Boolean(parent) };
};
