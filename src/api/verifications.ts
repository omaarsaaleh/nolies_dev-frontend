import { authenticatedApi } from "@/api/base";
import type {
  WorkplaceVerification,
  WorkplaceVerificationAttempt,
} from "@/types/api/verifications";
import type {
  PaginatedResponse
} from "@/types/api/common";
import {z} from 'zod';


export async function getWorkplaceVerifications(params?: { page?: number; page_size?: number }) {
  const res = await authenticatedApi.get("/workplace-verifications/", { params });
  return res.data as PaginatedResponse<WorkplaceVerification>;
}

export async function getVerificationAttempts(params?: { page?: number; page_size?: number }) {
  const res = await authenticatedApi.get("/workplace-verifications/attempts/", { params });
  return res.data as PaginatedResponse<WorkplaceVerificationAttempt>;
}

// email - create

export const createWorkEmailVerificationAttemptSchema = z.object({
  company: z.string().min(1),
  work_email: z.email("Enter a valid work email"),
});

export type CreateWorkEmailVerificationAttemptFormData = z.infer<typeof createWorkEmailVerificationAttemptSchema>;

export async function attemptWorkEmailVerification(payload: CreateWorkEmailVerificationAttemptFormData) {
  await authenticatedApi.post("/workplace-verifications/email/attempt/", payload);
}

// email - verify

export const verifyWorkEmailVerificationAttemptSchema = z.object({
  otp: z
    .string()
    .min(6, "Enter the verification code"),
  work_email: z.email("Enter valid work email")
});

export type VerifyWorkEmailVerificationAttemptFormData = z.infer<typeof verifyWorkEmailVerificationAttemptSchema>;

export async function verifyWorkEmail(payload: VerifyWorkEmailVerificationAttemptFormData) {
  await authenticatedApi.post("/workplace-verifications/email/verify/", payload);
}