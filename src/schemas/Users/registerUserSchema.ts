import { z } from "zod";

export const registerUserSchema = () => {
  const schema = z.object({
    nameUser: z.string().min(5, "El nombre debe ser mayor a 4 letras"),
    email: z.string().email("Formato de correo inválido"),
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
  });

  return schema;
};
