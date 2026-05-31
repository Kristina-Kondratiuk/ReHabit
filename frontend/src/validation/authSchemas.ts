import { z } from "zod";

const passwordValidation = z
  .string()
  .min(8, "Minimum 8 znaków")
  .max(72, "Maksymalnie 72 znaki")
  .regex(/[A-Z]/, "Hasło musi zawierać co najmniej 1 wielką literę")
  .regex(/[^A-Za-z0-9]/, "Hasło musi zawierać co najmniej 1 znak specjalny");

export const loginSchema = z.object({
  email: z.string().trim().min(1, "Wpisz e-mail").email("Nieprawidłowy format e-mail"),
  password: passwordValidation,
});

export const registerSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(2, "Minimum 2 znaki")
      .max(30, "Maksymalnie 30 znaków"),
    email: z.string().trim().min(1, "Wpisz e-mail").email("Nieprawidłowy format e-mail"),
    password: passwordValidation,
    confirmPassword: z.string().min(1, "Potwierdź hasło"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Hasła nie są takie same",
    path: ["confirmPassword"],
  });

export const getFirstValidationError = (error: z.ZodError) =>
  error.issues[0]?.message ?? "Błąd walidacji";
