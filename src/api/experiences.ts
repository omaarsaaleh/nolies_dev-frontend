import { authenticatedApi } from "@/api/base";
import type{
  WorkExperience
}
from "@/types/api/experiences";
import type { PaginatedResponse } from "@/types/api/common";

export type WorkExperienceCreateUpdateRequest = {
  company: string; // slug
  roles: {
    id?: number;
    job_role: number;
    start_date: string;
    end_date?: string | null
  }[];
  verification?: number | null;
};


export async function getWorkExperiences(params?: { page?: number; page_size?: number }) {
  const res = await authenticatedApi.get("/work-experiences/", { params });
  return res.data as PaginatedResponse<WorkExperience>; 
}

export async function createWorkExperience(payload: WorkExperienceCreateUpdateRequest) {
  await authenticatedApi.post("/work-experiences/", payload);
}

export async function updateWorkExperience(id: number, payload: WorkExperienceCreateUpdateRequest) {
  await authenticatedApi.put(`/work-experiences/${id}/`, payload);
}

export async function deleteWorkExperience(id: number) {
  await authenticatedApi.delete(`/work-experiences/${id}/`);
}

