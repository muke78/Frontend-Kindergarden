import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { FormWizard } from "@/components/common/FormWizard";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { type ParentFormValues, useParentForm } from "@/features/parents/hooks/useParentForm";
import { useParentMutations } from "@/features/parents/hooks/useParentMutations";
import { useParentsUiStore } from "@/features/parents/stores/parentsUi.store";
import { catalogsService } from "@/services/catalogs.service";
import type { CreateParentPayload } from "@/types/people.types";

import { ParentStep1 } from "./ParentStep1";
import { ParentStep2 } from "./ParentStep2";
import { ParentStep3 } from "./ParentStep3";

const STEPS = ["Personal", "Contacto", "Domicilio"];
const STEP_FIELDS: Array<Array<keyof ParentFormValues>> = [
	["first_name", "paternal_surname", "maternal_surname", "gender_id", "date_of_birth", "curp"],
	["education_level_id", "status_id", "email", "phone"],
	["state", "suburb", "street", "emergency_contact"],
];

export const ParentFormDialog = () => {
	const dialog = useParentsUiStore((s) => s.dialog);
	const closeDialog = useParentsUiStore((s) => s.closeDialog);
	const { update } = useParentMutations();
	const [step, setStep] = useState(0);

	const open = dialog?.kind === "edit";
	const editing = dialog?.kind === "edit" ? dialog.parent : undefined;
	const loading = update.isPending;

	const genders = useQuery({ queryKey: ["catalogs", "genders"], queryFn: catalogsService.genders });
	const levels = useQuery({
		queryKey: ["catalogs", "education-levels"],
		queryFn: catalogsService.educationLevels,
	});
	const statuses = useQuery({
		queryKey: ["catalogs", "statuses"],
		queryFn: catalogsService.statuses,
	});

	const handleClose = () => {
		closeDialog();
		setStep(0);
	};

	const onSave = (values: CreateParentPayload) => {
		if (editing) update.mutate({ id: editing.id, payload: values }, { onSuccess: handleClose });
	};

	const { form, handleSubmit } = useParentForm({ parent: editing, onSubmit: onSave, open });

	const handleNext = async () => {
		const valid = await form.trigger(STEP_FIELDS[step] as Parameters<typeof form.trigger>[0]);
		if (valid) setStep((s) => s + 1);
	};

	const catalogs = {
		genders: genders.data ?? [],
		levels: levels.data ?? [],
		statuses: statuses.data ?? [],
	};

	const stepContent = [
		<ParentStep1 key="p1" form={form} catalogs={catalogs} />,
		<ParentStep2 key="p2" form={form} catalogs={catalogs} />,
		<ParentStep3 key="p3" form={form} />,
	];

	return (
		<Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
			<DialogContent className="max-w-xl">
				<DialogHeader>
					<DialogTitle>{editing ? "Editar tutor" : "Nuevo tutor"}</DialogTitle>
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
