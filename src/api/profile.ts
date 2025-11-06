import { authenticatedApi } from "@/api/base";
import type {
  ChangePasswordRequest,
  WorkExperienceCreateRequest,
  WorkExperienceUpdateRequest,
  Paginated,
} from "@/types/api/profile";

// Password
export async function changePassword(payload: ChangePasswordRequest): Promise<void> {
  await authenticatedApi.post("/auth/passwords/change/", payload);
}

// Work Experiences
export async function getWorkExperiences(params?: { page?: number; page_size?: number }) {
  const res = await authenticatedApi.get("/work-experiences/", { params });
  return res.data as Paginated<any>;
}

export async function createWorkExperience(payload: WorkExperienceCreateRequest) {
  const res = await authenticatedApi.post("/work-experiences/", payload);
  return res.data as any;
}

export async function updateWorkExperience(id: number, payload: WorkExperienceUpdateRequest) {
  const res = await authenticatedApi.put(`/work-experiences/${id}/`, payload);
  return res.data as any;
}

export async function deleteWorkExperience(id: number) {
  await authenticatedApi.delete(`/work-experiences/${id}/`);
}

// Workplace Verifications (email)
export async function getWorkplaceVerifications(params?: { page?: number; page_size?: number }) {
  const res = await authenticatedApi.get("/workplace-verifications/", { params });
  return res.data as Paginated<any>;
}

export async function getVerificationAttempts(params?: { page?: number; page_size?: number }) {
  const res = await authenticatedApi.get("/workplace-verifications/attempts/", { params });
  return res.data as Paginated<any>;
}

export async function attemptWorkEmailVerification(payload: { work_email: string; company: string }) {
  const res = await authenticatedApi.post("/workplace-verifications/email/attempt/", payload);
  return res.data as any;
}

export async function verifyWorkEmail(payload: { work_email: string; otp: string }) {
  const res = await authenticatedApi.post("/workplace-verifications/email/verify/", payload);
  return res.data as any;
}


