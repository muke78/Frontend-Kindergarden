import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { Classroom } from "@/types/people.types";

const schema = z.object({
	room_type_id: z.string().uuid("Selecciona un tipo de aula"),
	name: z.string().min(2, "Mínimo 2 caracteres").max(100, "Máximo 100 caracteres"),
	capacity: z.coerce.number().int().min(1).max(500).nullable().optional(),
});

export type ClassroomFormValues = z.infer<typeof schema>;

export const useClassroomForm = ({
	classroom,
	onSubmit,
}: {
	classroom?: Classroom;
	onSubmit: (v: ClassroomFormValues) => void;
}) => {
	const form = useForm<ClassroomFormValues>({
		resolver: zodResolver(schema),
		defaultValues: { room_type_id: "", name: "", capacity: null },
	});

	useEffect(() => {
		form.reset(
			classroom
				? {
						room_type_id: classroom.room_type_id,
						name: classroom.name,
						capacity: classroom.capacity,
					}
				: { room_type_id: "", name: "", capacity: null },
		);
	}, [classroom, form]);

	return { form, handleSubmit: form.handleSubmit(onSubmit) };
};
