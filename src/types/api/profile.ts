import { z } from "zod";

export const changePasswordSchema = z.object({
  old_password: z.string().min(1, "Required"),
  new_password: z.string().min(8, "Minimum 8 characters"),
  confirm_new_password: z.string().min(8, "Minimum 8 characters"),
}).refine((v) => v.new_password === v.confirm_new_password, {
  message: "Passwords do not match",
  path: ["confirm_new_password"],
});

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export type ChangePasswordRequest = {
  old_password: string;
  new_password: string;
  confirm_new_password: string;
};

export type RoleInput = {
  id?: number;
  job_role: number;
  start_date: string;
  end_date?: string | null;
};

export type WorkExperienceCreateRequest = {
  company: string; // slug
  roles: RoleInput[];
  verification?: number;
};

export type WorkExperienceUpdateRequest = WorkExperienceCreateRequest;

export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};


