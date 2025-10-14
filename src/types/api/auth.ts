import { z } from "zod";

export const loginSchema = z.object({
  username_or_email: z.string().min(1, "Username or email is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  first_name: z.string().min(2, "First name is too short"),
  last_name: z.string().min(2, "Last name is too short"),
  username: z
    .string()
    .min(2, "Username is too short")
    .regex(/^[\w.]+$/, "Username can only contain letters, numbers, underscores, and dots")
    .refine((value) => !value.startsWith('.') && !value.endsWith('.'), {
      message: "Username cannot start or end with a period",
    }),
  email: z.string().email("Invalid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .refine((val) => /[a-z]/.test(val), {
      message: "Password must contain at least one lowercase letter",
    })
    .refine((val) => /[A-Z]/.test(val), {
      message: "Password must contain at least one uppercase letter",
    })
    .refine((val) => /[0-9]/.test(val), {
      message: "Password must contain at least one number",
    }),
  confirm_password: z.string(),
})
.refine((data) => data.password === data.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"],
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export const forgetPasswordSchema = z.object({
  username_or_email: z.string().min(1, "Username or email is required"),
});

export type ForgetPasswordFormData = z.infer<typeof forgetPasswordSchema>;

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Invalid or expired reset link"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .refine((val) => /[a-z]/.test(val), {
      message: "Password must contain at least one lowercase letter",
    })
    .refine((val) => /[A-Z]/.test(val), {
      message: "Password must contain at least one uppercase letter",
    })
    .refine((val) => /[0-9]/.test(val), {
      message: "Password must contain at least one number",
    }),
  confirm_password: z.string(),
}).
refine((data) => data.password === data.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"],
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;