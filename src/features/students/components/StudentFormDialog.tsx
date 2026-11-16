import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { FormWizard } from "@/components/common/FormWizard";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { type StudentFormValues, useStudentForm } from "@/features/students/hooks/useStudentForm";
import { useStudentMutations } from "@/features/students/hooks/useStudentMutations";
import { useStudentsUiStore } from "@/features/students/stores/studentsUi.store";
import { catalogsService } from "@/services/catalogs.service";
import type { CreateStudentPayload } from "@/types/people.types";

import { StudentStep1 } from "./StudentStep1";
import { StudentStep2 } from "./StudentStep2";
import { StudentStep3 } from "./StudentStep3";
import { StudentStep4 } from "./StudentStep4";

const STEPS = ["Personal", "Académico", "Domicilio", "Emergencia"];
const STEP_FIELDS: Array<Array<keyof StudentFormValues>> = [
	["first_name", "paternal_surname", "maternal_surname", "gender_id", "date_of_birth", "curp"],
	["grade_group_id", "work_shift_id", "status_id", "enrollment_date"],
	["state", "suburb", "street"],
	["emergency_contact"],
];

export const StudentFormDialog = () => {
	const dialog = useStudentsUiStore((s) => s.dialog);
	const closeDialog = useStudentsUiStore((s) => s.closeDialog);
	const { create, update } = useStudentMutations();
	const [step, setStep] = useState(0);

	const open = dialog?.kind === "create" || dialog?.kind === "edit";
	const editing = dialog?.kind === "edit" ? dialog.student : undefined;
	const loading = create.isPending || update.isPending;

	const genders = useQuery({ queryKey: ["catalogs", "genders"], queryFn: catalogsService.genders });
	const gradeGroups = useQuery({
		queryKey: ["catalogs", "grade-groups"],
		queryFn: catalogsService.gradeGroups,
	});
	const shifts = useQuery({
		queryKey: ["catalogs", "work-shifts"],
		queryFn: catalogsService.workShifts,
	});
	const statuses = useQuery({
		queryKey: ["catalogs", "statuses"],
		queryFn: catalogsService.statuses,
	});

	const handleClose = () => {
		closeDialog();
		setStep(0);
	};

	const onSave = (values: CreateStudentPayload) => {
		if (editing) update.mutate({ id: editing.id, payload: values }, { onSuccess: handleClose });
		else create.mutate(values, { onSuccess: handleClose });
	};

	const { form, handleSubmit } = useStudentForm({ student: editing, onSubmit: onSave, open });

	const handleNext = async () => {
		const valid = await form.trigger(STEP_FIELDS[step] as Parameters<typeof form.trigger>[0]);
		if (valid) setStep((s) => s + 1);
	};

	const catalogs = {
		genders: genders.data ?? [],
		gradeGroups: gradeGroups.data ?? [],
		shifts: shifts.data ?? [],
		statuses: statuses.data ?? [],
	};

	const stepContent = [
		<StudentStep1 key="s1" form={form} catalogs={catalogs} />,
		<StudentStep2 key="s2" form={form} catalogs={catalogs} />,
		<StudentStep3 key="s3" form={form} />,
		<StudentStep4 key="s4" form={form} />,
	];

	return (
		<Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
			<DialogContent className="max-w-xl">
				<DialogHeader>
					<DialogTitle>{editing ? "Editar alumno" : "Nuevo alumno"}</DialogTitle>
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
