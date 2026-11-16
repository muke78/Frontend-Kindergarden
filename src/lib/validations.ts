import { z } from "zod";

// ---- shared field schemas (aligned with Joi backend) ----

export const uuidField = z.string().uuid("UUID inválido");

export const personNameField = z
	.string()
	.min(2, "Mínimo 2 caracteres")
	.max(100, "Máximo 100 caracteres")
	.regex(/^[\p{L}][\p{L}\s'.-]*$/u, "Solo letras, espacios, apóstrofes, puntos y guiones");

export const curpField = z
	.string()
	.transform((v) => v.toUpperCase())
	.pipe(
		z
			.string()
			.length(18, "CURP debe tener 18 caracteres")
			.regex(/^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/, "CURP con formato inválido"),
	);

export const phoneField = z
	.string()
	.min(10, "Mínimo 10 dígitos")
	.max(15, "Máximo 15 caracteres")
	.regex(/^[\d\s+\-()]{10,15}$/, "10-15 caracteres: dígitos, +, guiones o paréntesis");

export const emailField = z
	.string()
	.email("Email inválido")
	.max(180, "Máximo 180 caracteres")
	.toLowerCase();

export const dateField = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato YYYY-MM-DD requerido");

export const passwordField = z
	.string()
	.min(12, "Mínimo 12 caracteres")
	.max(128, "Máximo 128 caracteres")
	.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, "Debe contener mayúscula, minúscula y número");
