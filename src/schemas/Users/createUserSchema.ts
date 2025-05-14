import { z } from "zod";

export const createUserSchema = () => {
  const schema = z.object({
    nameUser: z.string().min(5, "El nombre debe ser mayor a 4 letras"),
    email: z.string().email("Formato de correo inválido"),
    // profilePicture: z.string().url("Debe ser una URL válida").optional(),
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    role: z.enum(["admin", "user"], {
      errorMap: () => ({ message: "Selecciona un rol válido" }),
    }),
    accountStatus: z.enum(["Activo", "Inactivo"], {
      errorMap: () => ({ message: "Selecciona un estado válido" }),
    }),
  });

  return schema;
};
