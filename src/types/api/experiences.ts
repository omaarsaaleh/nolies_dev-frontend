import type { CompanyMinimal } from "@/types/api/companies";
import type { WorkplaceVerification } from "@/types/api/verifications";
import type { JobRole } from "@/types/api/employees";

export type WorkExperienceRole = {
  id: number;
  job_role: JobRole
  start_date: string;
  end_date: string | null;
};

export type WorkExperience = {
  id: number;
  company: CompanyMinimal;
  verification: WorkplaceVerification | null;
  roles: WorkExperienceRole[];
}

export type WorkExperienceSummary = {
  id: number;
  is_verified: boolean;
  job_role?: JobRole;
  start_date?: string;
  end_date?: string | null;
};