import { useQuery } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Users } from "lucide-react";

import { FormWizard } from "@/components/common/FormWizard";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ParentFieldset } from "@/features/parents/components/ParentFieldset";
import { useParentMutations } from "@/features/parents/hooks/useParentMutations";
import { useParentsUiStore } from "@/features/parents/stores/parentsUi.store";
import { catalogsService } from "@/services/catalogs.service";
import type { ParentFormValues } from "@/features/parents/hooks/useParentForm";
import { curpField, dateField, emailField, personNameField, phoneField } from "@/lib/validations";
import { z } from "zod";

import { DEFAULT_RELATIONSHIP } from "@/features/parents/relationships";

import { Step2Children } from "./Step2Children";
import type { ChildEntry, ParentAddress } from "./types";

const STEPS = ["Tutores", "Hijos"];

const parentSchema = z.object({
	gender_id: z.string().uuid("Selecciona un género"),
	education_level_id: z.string().uuid("Selecciona nivel educativo"),
	status_id: z.string().uuid("Selecciona un estado"),
	first_name: personNameField,
	paternal_surname: personNameField,
	maternal_surname: personNameField.optional().or(z.literal("")).nullable(),
	date_of_birth: dateField,
	curp: curpField,
	email: emailField,
	phone: phoneField,
	occupation: z.string().max(120).optional().or(z.literal("")).nullable(),
	state: z.string().min(2).max(100),
	suburb: z.string().min(2).max(120),
	street: z.string().min(2).max(180),
	emergency_contact: z.string().min(2).max(120),
	emergency_phone: phoneField.optional().or(z.literal("")).nullable(),
});

const emptyParent: ParentFormValues = {
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
	occupation: "",
	state: "",
	suburb: "",
	street: "",
	emergency_contact: "",
	emergency_phone: "",
};

export const ParentWithChildrenDialog = () => {
	const dialog = useParentsUiStore((s) => s.dialog);
	const closeDialog = useParentsUiStore((s) => s.closeDialog);
	const { createWithChildren } = useParentMutations();

	const [step, setStep] = useState(0);
	const [parentCount, setParentCount] = useState<1 | 2>(1);
	const [children, setChildren] = useState<ChildEntry[]>([]);

	const open = dialog?.kind === "create";

	const genders = useQuery({ queryKey: ["catalogs", "genders"], queryFn: catalogsService.genders });
	const levels = useQuery({
		queryKey: ["catalogs", "education-levels"],
		queryFn: catalogsService.educationLevels,
	});
	const statuses = useQuery({
		queryKey: ["catalogs", "statuses"],
		queryFn: catalogsService.statuses,
	});

	const catalogs = {
		genders: genders.data ?? [],
		levels: levels.data ?? [],
		statuses: statuses.data ?? [],
	};

	const form1 = useForm<ParentFormValues>({
		resolver: zodResolver(parentSchema),
		defaultValues: emptyParent,
	});
	const form2 = useForm<ParentFormValues>({
		resolver: zodResolver(parentSchema),
		defaultValues: emptyParent,
	});

	const handleClose = () => {
		closeDialog();
		setStep(0);
		setParentCount(1);
		setChildren([]);
		form1.reset(emptyParent);
		form2.reset(emptyParent);
	};

	const handleNext = async () => {
		const [v1, v2] = await Promise.all([
			form1.trigger(),
			parentCount === 2 ? form2.trigger() : Promise.resolve(true),
		]);
		if (v1 && v2) setStep(1);
	};

	const handleSubmit = async () => {
		const [valid1, valid2] = await Promise.all([
			form1.trigger(),
			parentCount === 2 ? form2.trigger() : Promise.resolve(true),
		]);
		if (!valid1 || !valid2) {
			setStep(0);
			return;
		}

		const p1 = form1.getValues();
		const parents = [
			{
				...p1,
				maternal_surname: p1.maternal_surname || null,
				emergency_phone: p1.emergency_phone || null,
				occupation: p1.occupation || null,
			},
		];

		if (parentCount === 2) {
			const p2 = form2.getValues();
			parents.push({
				...p2,
				maternal_surname: p2.maternal_surname || null,
				emergency_phone: p2.emergency_phone || null,
				occupation: p2.occupation || null,
			});
		}

		const childPayload = children.map((c) => {
			const rels =
				parentCount === 2
					? [
							c.relationships[0] ?? DEFAULT_RELATIONSHIP,
							c.relationships[1] ?? DEFAULT_RELATIONSHIP,
						]
					: [c.relationships[0] ?? DEFAULT_RELATIONSHIP];

			if (c.mode === "link") {
				return {
					mode: "link" as const,
					student_id: c.student_id!,
					relationships: rels,
					is_primary: c.is_primary,
				};
			}
			return {
				mode: "create" as const,
				student: c.student!,
				relationships: rels,
				is_primary: c.is_primary,
			};
		});

		createWithChildren.mutate({ parents, children: childPayload }, { onSuccess: handleClose });
	};

	const addChild = useCallback((entry: ChildEntry) => setChildren((prev) => [...prev, entry]), []);
	const removeChild = useCallback(
		(key: string) => setChildren((prev) => prev.filter((c) => c._key !== key)),
		[],
	);
	const changeRelationship = useCallback((key: string, parentIdx: 0 | 1, value: string) => {
		setChildren((prev) =>
			prev.map((c) => {
				if (c._key !== key) return c;
				const rels = [...c.relationships];
				rels[parentIdx] = value;
				return { ...c, relationships: rels };
			}),
		);
	}, []);

	const p1Values = form1.watch();
	const parentAddress: ParentAddress = {
		state: p1Values.state,
		suburb: p1Values.suburb,
		street: p1Values.street,
		emergency_contact: p1Values.emergency_contact,
	};

	const copyAddressToParent2 = () => {
		form2.setValue("state", p1Values.state, { shouldValidate: false });
		form2.setValue("suburb", p1Values.suburb, { shouldValidate: false });
		form2.setValue("street", p1Values.street, { shouldValidate: false });
		form2.setValue("emergency_contact", p1Values.emergency_contact, { shouldValidate: false });
		form2.setValue("emergency_phone", p1Values.emergency_phone ?? "", { shouldValidate: false });
	};

	const step0Content = (
		<div className="space-y-4">
			{/* Toggle parent count */}
			<div className="flex items-center gap-3">
				<p className="text-sm text-muted-foreground">¿Cuántos tutores?</p>
				<div className="flex rounded-md border overflow-hidden">
					<button
						type="button"
						onClick={() => setParentCount(1)}
						className={`px-4 py-1.5 text-sm transition-colors ${parentCount === 1 ? "bg-primary text-primary-foreground" : "hover:bg-muted/50"}`}
					>
						1 tutor
					</button>
					<button
						type="button"
						onClick={() => setParentCount(2)}
						className={`px-4 py-1.5 text-sm border-l transition-colors ${parentCount === 2 ? "bg-primary text-primary-foreground" : "hover:bg-muted/50"}`}
					>
						2 tutores
					</button>
				</div>
			</div>

			{parentCount === 1 ? (
				<div className="max-h-[420px] overflow-y-auto pr-1">
					<ParentFieldset form={form1} catalogs={catalogs} autoFocus />
				</div>
			) : (
				<Tabs defaultValue="tutor1">
					<TabsList className="w-full">
						<TabsTrigger value="tutor1" className="flex-1">
							<Users className="h-3.5 w-3.5 mr-1.5" /> Tutor 1
						</TabsTrigger>
						<TabsTrigger value="tutor2" className="flex-1">
							<Users className="h-3.5 w-3.5 mr-1.5" /> Tutor 2
						</TabsTrigger>
					</TabsList>
					<TabsContent value="tutor1">
						<div className="max-h-[380px] overflow-y-auto pr-1 pt-3">
							<ParentFieldset form={form1} catalogs={catalogs} autoFocus />
						</div>
					</TabsContent>
					<TabsContent value="tutor2">
						<div className="max-h-[380px] overflow-y-auto pr-1 pt-3 space-y-3">
							<div className="flex justify-end">
								<Button
									type="button"
									variant="outline"
									size="sm"
									className="text-xs h-7"
									onClick={copyAddressToParent2}
								>
									Mismo domicilio del Tutor 1
								</Button>
							</div>
							<ParentFieldset form={form2} catalogs={catalogs} />
						</div>
					</TabsContent>
				</Tabs>
			)}
		</div>
	);

	const step1Content = (
		<div className="max-h-[480px] overflow-y-auto pr-1">
			<Step2Children
				entries={children}
				parentCount={parentCount}
				parentAddress={parentAddress}
				onAdd={addChild}
				onRemove={removeChild}
				onChangeRelationship={changeRelationship}
			/>
		</div>
	);

	return (
		<Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>Registrar tutores e hijos</DialogTitle>
				</DialogHeader>
				<form onSubmit={(e) => e.preventDefault()} noValidate>
					<FormWizard
						steps={STEPS}
						step={step}
						isPending={createWithChildren.isPending}
						onPrev={() => setStep(0)}
						onNext={handleNext}
						onSubmit={handleSubmit}
						onClose={handleClose}
					>
						{step === 0 ? step0Content : step1Content}
					</FormWizard>
				</form>
			</DialogContent>
		</Dialog>
	);
};
