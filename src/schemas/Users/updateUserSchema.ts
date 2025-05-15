import { z } from "zod";

export const updateUserSchema = () => {
  const schema = z.object({
    nameUser: z.string().min(5, "El nombre debe ser mayor a 4 letras"),
    email: z.string().email("Formato de correo inválido"),
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres")
      .or(z.literal(""))
      .optional(),
    role: z.enum(["admin", "user"], {
      errorMap: () => ({ message: "Selecciona un rol válido" }),
    }),
    accountStatus: z.enum(["Activo", "Inactivo"], {
      errorMap: () => ({ message: "Selecciona un estado válido" }),
    }),
  });

  return schema;
};
