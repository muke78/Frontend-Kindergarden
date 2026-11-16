// Valores canónicos que acepta el backend (enum). label = texto mostrado.
export const RELATIONSHIP_OPTIONS = [
	{ value: "madre", label: "Madre" },
	{ value: "padre", label: "Padre" },
	{ value: "tutor", label: "Tutor" },
	{ value: "abuela", label: "Abuela" },
	{ value: "abuelo", label: "Abuelo" },
	{ value: "tia", label: "Tía" },
	{ value: "tio", label: "Tío" },
	{ value: "otro", label: "Otro" },
] as const;

export const DEFAULT_RELATIONSHIP = "tutor";

const LABELS = Object.fromEntries(RELATIONSHIP_OPTIONS.map((o) => [o.value, o.label]));

export const relationshipLabel = (value: string | null | undefined) =>
	value ? (LABELS[value] ?? value) : "—";
