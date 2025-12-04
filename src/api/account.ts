import { z } from "zod";
import { passwordSchema } from "@/api/auth";
import { authenticatedApi } from './base';


// change password

export const changePasswordSchema = z
  .object({
    old_password: z.string().min(1, "Old password is required"),
    new_password: passwordSchema,
    confirm_new_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_new_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export async function changePassword(payload: ChangePasswordFormData): Promise<void> {
  await authenticatedApi.post("/auth/passwords/change/", payload);
}