import { z } from "zod";

export const loginUserSchema = () => {
  const schema = z.object({
    email: z.string().email("Formato de correo invalido"),
    password: z
      .string()
      .min(6, "La contraseña que guardaste tiene 6 o mas caracteres"),
  });
  return schema;
};
