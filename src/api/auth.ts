import { unauthenticatedApi, authenticatedApi } from './base';
import { z } from "zod";

// password
export const passwordSchema = z
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
  });

export const passwordWithConfirmSchema = z
  .object({
    password: passwordSchema,
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });


// login
export const loginSchema = z.object({
  username_or_email: z.string().min(1, "Username or email is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

type LoginResponse = {
  access: string;
};

export async function login(formData: LoginFormData): Promise<void> {
  const response = await unauthenticatedApi.post<LoginResponse>("/auth/tokens/", formData);
  const token = response.data.access;
  sessionStorage.setItem("access", token);
}


// register
export const registerSchema = passwordWithConfirmSchema.safeExtend({
  first_name: z.string().min(2, "First name is too short"),
  last_name: z.string().min(2, "Last name is too short"),
  username: z
    .string()
    .min(2, "Username is too short")
    .regex(/^[\w.]+$/, "Username can only contain letters, numbers, underscores, and dots")
    .refine((value) => !value.startsWith(".") && !value.endsWith("."), {
      message: "Username cannot start or end with a period",
    }),
  email: z.email("Invalid email"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export async function register(formData: RegisterFormData): Promise<void> {
  const response =await unauthenticatedApi.post("/auth/register/", formData);
  const token = response.data.access;
  sessionStorage.setItem("access", token);
}


// forget password
export const forgetPasswordSchema = z.object({
  username_or_email: z.string().min(1, "Username or email is required"),
});

export type ForgetPasswordFormData = z.infer<typeof forgetPasswordSchema>;

export async function requestPasswordReset(payload: ForgetPasswordFormData): Promise<void> {
  await unauthenticatedApi.post("/auth/passwords/forget/", payload);
}


// reset password
export const resetPasswordSchema = passwordWithConfirmSchema.safeExtend({
  token: z.string().min(1, "Invalid or expired reset link"),
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export async function resetPassword(payload: ResetPasswordFormData): Promise<void> {
  await unauthenticatedApi.post("/auth/passwords/reset/", payload);
}

// verify account

type VerifyAccountRequest = {
  otp: string;
}

export async function verifyAccount(otp: string): Promise<void> {
  const payload: VerifyAccountRequest = { otp };
  await authenticatedApi.post("/auth/verify-account/", payload);
}

export async function resendVerification(): Promise<void> {
  await authenticatedApi.post("/auth/resend-otp/");
}


// logout

export async function logout(): Promise<void> {
  await authenticatedApi.post("/auth/logout/");
  sessionStorage.removeItem("access");
}