import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { FormWizard } from "@/components/common/FormWizard";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { type TeacherFormValues, useTeacherForm } from "@/features/teachers/hooks/useTeacherForm";
import { useTeacherMutations } from "@/features/teachers/hooks/useTeacherMutations";
import { useTeachersUiStore } from "@/features/teachers/stores/teachersUi.store";
import { catalogsService } from "@/services/catalogs.service";
import type { CreateTeacherPayload } from "@/types/people.types";

import { TeacherStep1 } from "./TeacherStep1";
import { TeacherStep2 } from "./TeacherStep2";
import { TeacherStep3 } from "./TeacherStep3";

const STEPS = ["Personal", "Laboral", "Domicilio"];
const STEP_FIELDS: Array<Array<keyof TeacherFormValues>> = [
	["first_name", "paternal_surname", "maternal_surname", "gender_id", "date_of_birth", "curp"],
	["education_level_id", "work_shift_id", "status_id", "email", "phone"],
	["state", "suburb", "street", "emergency_contact"],
];

export const TeacherFormDialog = () => {
	const dialog = useTeachersUiStore((s) => s.dialog);
	const closeDialog = useTeachersUiStore((s) => s.closeDialog);
	const { create, update } = useTeacherMutations();
	const [step, setStep] = useState(0);

	const open = dialog?.kind === "create" || dialog?.kind === "edit";
	const editing = dialog?.kind === "edit" ? dialog.teacher : undefined;
	const loading = create.isPending || update.isPending;

	const genders = useQuery({ queryKey: ["catalogs", "genders"], queryFn: catalogsService.genders });
	const levels = useQuery({
		queryKey: ["catalogs", "education-levels"],
		queryFn: catalogsService.educationLevels,
	});
	const shifts = useQuery({
		queryKey: ["catalogs", "work-shifts"],
		queryFn: catalogsService.workShifts,
	});
	const statuses = useQuery({
		queryKey: ["catalogs", "statuses"],
		queryFn: catalogsService.statuses,
	});
	const gradeGroups = useQuery({
		queryKey: ["catalogs", "grade-groups"],
		queryFn: catalogsService.gradeGroups,
	});

	const handleClose = () => {
		closeDialog();
		setStep(0);
	};

	const onSave = (values: CreateTeacherPayload) => {
		if (editing) update.mutate({ id: editing.id, payload: values }, { onSuccess: handleClose });
		else create.mutate(values, { onSuccess: handleClose });
	};

	const { form, handleSubmit } = useTeacherForm({ teacher: editing, onSubmit: onSave, open });

	const handleNext = async () => {
		const valid = await form.trigger(STEP_FIELDS[step] as Parameters<typeof form.trigger>[0]);
		if (valid) setStep((s) => s + 1);
	};

	const catalogs = {
		genders: genders.data ?? [],
		levels: levels.data ?? [],
		shifts: shifts.data ?? [],
		statuses: statuses.data ?? [],
		gradeGroups: gradeGroups.data ?? [],
	};

	const stepContent = [
		<TeacherStep1 key="t1" form={form} catalogs={catalogs} />,
		<TeacherStep2 key="t2" form={form} catalogs={catalogs} />,
		<TeacherStep3 key="t3" form={form} />,
	];

	return (
		<Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
			<DialogContent className="max-w-xl">
				<DialogHeader>
					<DialogTitle>{editing ? "Editar maestro" : "Nuevo maestro"}</DialogTitle>
				</DialogHeader>
				<form onSubmit={(e) => e.preventDefault()} noValidate>
					<FormWizard
						steps={STEPS}
						step={step}
						isPending={loading}
						onPrev={() => setStep((s) => s - 1)}
						onNext={handleNext}
						onSubmit={handleSubmit}
						onClose={handleClose}
					>
						{stepContent[step]}
					</FormWizard>
				</form>
			</DialogContent>
		</Dialog>
	);
};
