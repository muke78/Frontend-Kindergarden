import { useQuery } from "@tanstack/react-query";
import { Plus, Search, Trash2, UserCheck, UserPlus } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { DatePickerField } from "@/components/common/DatePickerField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { catalogsService } from "@/services/catalogs.service";
import { studentsService } from "@/services/students.service";
import { DEFAULT_RELATIONSHIP, RELATIONSHIP_OPTIONS } from "@/features/parents/relationships";
import { curpField, dateField, personNameField, phoneField } from "@/lib/validations";
import type { ChildEntry, ParentAddress } from "./types";

type CatOpt = { id: string; name: string };
type GroupOpt = { id: string; label: string };

const studentSchema = z.object({
	gender_id: z.string().uuid("Selecciona género"),
	grade_group_id: z.string().uuid("Selecciona grupo"),
	work_shift_id: z.string().uuid("Selecciona turno"),
	status_id: z.string().uuid("Selecciona estado"),
	first_name: personNameField,
	paternal_surname: personNameField,
	maternal_surname: personNameField.optional().or(z.literal("")).nullable(),
	date_of_birth: dateField,
	curp: curpField,
	enrollment_date: dateField,
	state: z.string().min(2).max(100, ""),
	suburb: z.string().min(2).max(120, ""),
	street: z.string().min(2).max(180, ""),
	emergency_contact: z.string().min(2).max(120, ""),
	emergency_phone: phoneField.optional().or(z.literal("")).nullable(),
});

type StudentFormValues = z.infer<typeof studentSchema>;

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

type Props = {
	entries: ChildEntry[];
	parentCount: 1 | 2;
	parentAddress: ParentAddress;
	onAdd: (entry: ChildEntry) => void;
	onRemove: (key: string) => void;
	onChangeRelationship: (key: string, parentIdx: 0 | 1, value: string) => void;
};

export const Step2Children = ({
	entries,
	parentCount,
	parentAddress,
	onAdd,
	onRemove,
	onChangeRelationship,
}: Props) => {
	const [showAdd, setShowAdd] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");

	const genders = useQuery({ queryKey: ["catalogs", "genders"], queryFn: catalogsService.genders });
	const groups = useQuery({
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

	const studentSearch = useQuery({
		queryKey: ["students", { search: searchTerm, limit: 20 }],
		queryFn: () => studentsService.list({ search: searchTerm, limit: 20 }),
		enabled: searchTerm.length >= 2,
		staleTime: 30_000,
	});

	const linked = new Set(entries.filter((c) => c.mode === "link").map((c) => c.student_id));

	const form = useForm<StudentFormValues>({
		resolver: zodResolver(studentSchema),
		defaultValues: {
			gender_id: "",
			grade_group_id: "",
			work_shift_id: "",
			status_id: "",
			first_name: "",
			paternal_surname: "",
			maternal_surname: "",
			date_of_birth: "",
			curp: "",
			enrollment_date: new Date().toISOString().split("T")[0],
			state: "",
			suburb: "",
			street: "",
			emergency_contact: "",
			emergency_phone: "",
		},
	});

	const {
		register,
		formState: { errors },
		watch,
		setValue,
		reset,
		handleSubmit,
	} = form;

	const sel = (f: "gender_id" | "grade_group_id" | "work_shift_id" | "status_id") => (v: string) =>
		setValue(f, v, { shouldValidate: true });

	const copyAddress = useCallback(() => {
		setValue("state", parentAddress.state, { shouldValidate: true });
		setValue("suburb", parentAddress.suburb, { shouldValidate: true });
		setValue("street", parentAddress.street, { shouldValidate: true });
		setValue("emergency_contact", parentAddress.emergency_contact, { shouldValidate: true });
	}, [parentAddress, setValue]);

	const handleLinkStudent = (student: { id: string; full_name: string }) => {
		if (linked.has(student.id)) return;
		onAdd({
			_key: student.id,
			mode: "link",
			student_id: student.id,
			student_display: student.full_name,
			relationships:
				parentCount === 2 ? [DEFAULT_RELATIONSHIP, DEFAULT_RELATIONSHIP] : [DEFAULT_RELATIONSHIP],
			is_primary: true,
		});
		setSearchTerm("");
	};

	const handleCreateStudent = handleSubmit((values) => {
		onAdd({
			_key: crypto.randomUUID(),
			mode: "create",
			student_display: `${values.first_name} ${values.paternal_surname}`,
			student: {
				...values,
				maternal_surname: values.maternal_surname || null,
				emergency_phone: values.emergency_phone || null,
			},
			relationships:
				parentCount === 2 ? [DEFAULT_RELATIONSHIP, DEFAULT_RELATIONSHIP] : [DEFAULT_RELATIONSHIP],
			is_primary: true,
		});
		reset();
		setShowAdd(false);
	});

	const cats = {
		genders: (genders.data ?? []) as CatOpt[],
		groups: (groups.data ?? []) as GroupOpt[],
		shifts: (shifts.data ?? []) as CatOpt[],
		statuses: (statuses.data ?? []) as CatOpt[],
	};

	return (
		<div className="space-y-4">
			{/* Children list */}
			{entries.length === 0 ? (
				<p className="text-sm text-muted-foreground text-center py-4">
					Sin hijos agregados aún. Vincula existentes o crea nuevos.
				</p>
			) : (
				<div className="space-y-2">
					{entries.map((child) => (
						<div key={child._key} className="flex items-start gap-3 rounded-lg border p-3 text-sm">
							<div className="flex-1 min-w-0">
								<div className="flex items-center gap-2">
									<Badge
										variant={child.mode === "link" ? "secondary" : "outline"}
										className="shrink-0"
									>
										{child.mode === "link" ? "Vinculado" : "Nuevo"}
									</Badge>
									<span className="font-medium truncate">{child.student_display}</span>
								</div>
								<div className="mt-2 flex flex-wrap gap-2">
									<div className="flex items-center gap-1.5">
										<span className="text-muted-foreground text-xs">Tutor 1:</span>
										<Select
											value={child.relationships[0]}
											onValueChange={(v) => onChangeRelationship(child._key, 0, v)}
										>
											<SelectTrigger className="h-7 text-xs w-32">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{RELATIONSHIP_OPTIONS.map((r) => (
													<SelectItem key={r.value} value={r.value} className="text-xs">
														{r.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
									{parentCount === 2 && (
										<div className="flex items-center gap-1.5">
											<span className="text-muted-foreground text-xs">Tutor 2:</span>
											<Select
												value={child.relationships[1] ?? DEFAULT_RELATIONSHIP}
												onValueChange={(v) => onChangeRelationship(child._key, 1, v)}
											>
												<SelectTrigger className="h-7 text-xs w-32">
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													{RELATIONSHIP_OPTIONS.map((r) => (
														<SelectItem key={r.value} value={r.value} className="text-xs">
															{r.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
									)}
								</div>
							</div>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								className="h-7 w-7 shrink-0 text-destructive hover:text-destructive"
								onClick={() => onRemove(child._key)}
							>
								<Trash2 className="h-4 w-4" />
							</Button>
						</div>
					))}
				</div>
			)}

			{/* Add child */}
			{!showAdd ? (
				<Button type="button" variant="outline" className="w-full" onClick={() => setShowAdd(true)}>
					<Plus className="h-4 w-4 mr-2" /> Agregar hijo
				</Button>
			) : (
				<div className="border rounded-lg p-4 space-y-3">
					<Tabs defaultValue="link">
						<TabsList className="w-full">
							<TabsTrigger value="link" className="flex-1 gap-1.5">
								<UserCheck className="h-3.5 w-3.5" /> Vincular existente
							</TabsTrigger>
							<TabsTrigger value="create" className="flex-1 gap-1.5">
								<UserPlus className="h-3.5 w-3.5" /> Crear nuevo
							</TabsTrigger>
						</TabsList>

						{/* Link existing */}
						<TabsContent value="link" className="space-y-3 pt-3">
							<div className="relative">
								<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
								<Input
									placeholder="Buscar alumno..."
									className="pl-8"
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									autoFocus
								/>
							</div>
							{searchTerm.length >= 2 && (
								<div className="border rounded-md divide-y max-h-48 overflow-y-auto">
									{studentSearch.isLoading && (
										<p className="text-xs text-center py-3 text-muted-foreground">Buscando...</p>
									)}
									{!studentSearch.isLoading && (studentSearch.data?.rows ?? []).length === 0 && (
										<p className="text-xs text-center py-3 text-muted-foreground">Sin resultados</p>
									)}
									{(studentSearch.data?.rows ?? []).map((s) => (
										<button
											key={s.id}
											type="button"
											disabled={linked.has(s.id)}
											onClick={() => handleLinkStudent(s)}
											className="w-full text-left px-3 py-2 text-sm hover:bg-muted/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
										>
											<span className="font-medium">{s.full_name}</span>
											<span className="text-muted-foreground ml-2 text-xs">
												{s.grade_group_label}
											</span>
										</button>
									))}
								</div>
							)}
							{searchTerm.length < 2 && (
								<p className="text-xs text-muted-foreground text-center">
									Escribe al menos 2 caracteres
								</p>
							)}
						</TabsContent>

						{/* Create new */}
						<TabsContent value="create" className="pt-3">
							<div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
								<div className="grid grid-cols-3 gap-3">
									<Field label="Nombre(s)" error={errors.first_name?.message}>
										<Input {...register("first_name")} />
									</Field>
									<Field label="Ap. paterno" error={errors.paternal_surname?.message}>
										<Input {...register("paternal_surname")} />
									</Field>
									<Field label="Ap. materno" error={errors.maternal_surname?.message}>
										<Input {...register("maternal_surname")} />
									</Field>
								</div>

								<div className="grid grid-cols-2 gap-3">
									<div className="space-y-1">
										<Label>Género</Label>
										<Select value={watch("gender_id")} onValueChange={sel("gender_id")}>
											<SelectTrigger>
												<SelectValue placeholder="Selecciona..." />
											</SelectTrigger>
											<SelectContent>
												{cats.genders.map((g) => (
													<SelectItem key={g.id} value={g.id}>
														{g.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<Err msg={errors.gender_id?.message} />
									</div>
									<Field label="Fecha de nacimiento" error={errors.date_of_birth?.message}>
										<DatePickerField
											value={watch("date_of_birth")}
											onChange={(v) => setValue("date_of_birth", v, { shouldValidate: true })}
											error={Boolean(errors.date_of_birth)}
										/>
									</Field>
								</div>

								<div className="grid grid-cols-2 gap-3">
									<Field label="CURP" error={errors.curp?.message}>
										<Input
											value={watch("curp")}
											onChange={(e) =>
												setValue("curp", e.target.value.toUpperCase(), { shouldValidate: true })
											}
											maxLength={18}
											placeholder="XXXX000000XXXXXXX0"
										/>
									</Field>
									<Field label="Fecha de inscripción" error={errors.enrollment_date?.message}>
										<DatePickerField
											value={watch("enrollment_date")}
											onChange={(v) => setValue("enrollment_date", v, { shouldValidate: true })}
											error={Boolean(errors.enrollment_date)}
										/>
									</Field>
								</div>

								<div className="grid grid-cols-3 gap-3">
									<div className="space-y-1">
										<Label>Grupo</Label>
										<Select value={watch("grade_group_id")} onValueChange={sel("grade_group_id")}>
											<SelectTrigger>
												<SelectValue placeholder="Selecciona..." />
											</SelectTrigger>
											<SelectContent>
												{cats.groups.map((g) => (
													<SelectItem key={g.id} value={g.id}>
														{g.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<Err msg={errors.grade_group_id?.message} />
									</div>
									<div className="space-y-1">
										<Label>Turno</Label>
										<Select value={watch("work_shift_id")} onValueChange={sel("work_shift_id")}>
											<SelectTrigger>
												<SelectValue placeholder="Selecciona..." />
											</SelectTrigger>
											<SelectContent>
												{cats.shifts.map((s) => (
													<SelectItem key={s.id} value={s.id}>
														{s.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<Err msg={errors.work_shift_id?.message} />
									</div>
									<div className="space-y-1">
										<Label>Estado</Label>
										<Select value={watch("status_id")} onValueChange={sel("status_id")}>
											<SelectTrigger>
												<SelectValue placeholder="Selecciona..." />
											</SelectTrigger>
											<SelectContent>
												{cats.statuses.map((s) => (
													<SelectItem key={s.id} value={s.id}>
														{s.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<Err msg={errors.status_id?.message} />
									</div>
								</div>

								<div className="flex items-center justify-between border-t pt-2">
									<p className="text-xs text-muted-foreground">Domicilio del alumno</p>
									{parentAddress.state && (
										<Button
											type="button"
											variant="ghost"
											size="sm"
											className="h-7 text-xs gap-1"
											onClick={copyAddress}
										>
											Mismo domicilio del Tutor 1
										</Button>
									)}
								</div>

								<div className="grid grid-cols-3 gap-3">
									<Field label="Estado/Entidad" error={errors.state?.message}>
										<Input {...register("state")} />
									</Field>
									<Field label="Colonia" error={errors.suburb?.message}>
										<Input {...register("suburb")} />
									</Field>
									<Field label="Calle y número" error={errors.street?.message}>
										<Input {...register("street")} />
									</Field>
								</div>

								<div className="grid grid-cols-2 gap-3">
									<Field label="Contacto emergencia" error={errors.emergency_contact?.message}>
										<Input {...register("emergency_contact")} />
									</Field>
									<Field label="Tel. emergencia" error={errors.emergency_phone?.message}>
										<Input
											{...register("emergency_phone")}
											type="tel"
											inputMode="numeric"
											placeholder="10 dígitos"
										/>
									</Field>
								</div>
							</div>

							<div className="flex justify-end gap-2 pt-3 border-t mt-3">
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => {
										reset();
										setShowAdd(false);
									}}
								>
									Cancelar
								</Button>
								<Button type="button" size="sm" onClick={handleCreateStudent}>
									<Plus className="h-3.5 w-3.5 mr-1" /> Agregar a la lista
								</Button>
							</div>
						</TabsContent>
					</Tabs>

					{/* Close add panel for link tab */}
					<div className="flex justify-end border-t pt-2">
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={() => {
								setSearchTerm("");
								setShowAdd(false);
							}}
						>
							Cerrar
						</Button>
					</div>
				</div>
			)}
		</div>
	);
};
