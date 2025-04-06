import * as z from "zod"

const emailSchema = z
  .string()
  .email({ message: "Invalid email format" })
  .transform((val) => val.toLowerCase().trim())

const passwordSchema = z
  .string()
  .min(6, { message: "Password must be at least 6 characters" })
  .max(100, { message: "Password cannot exceed 100 characters" })

export const registerFormSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export const loginFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})