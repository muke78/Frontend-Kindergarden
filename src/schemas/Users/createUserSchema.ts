import { z } from "zod";

export const createUserSchema = () => {
  const schema = z.object({
    nameUser: z.string().min(1, "El nombre es obligatorio"),
    email: z.string().email("Formato de correo inválido"),
    profilePicture: z.string().url("Debe ser una URL válida").optional(),
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    role: z.enum(["admin", "user"], {
      errorMap: () => ({ message: "Selecciona un rol válido" }),
    }),
    accountType: z.string().optional(),
  });

  return schema;
};
