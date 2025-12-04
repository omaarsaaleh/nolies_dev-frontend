import type { WorkExperienceSummary } from "@/types/api/experiences";
import type { CompanyMinimal } from "@/types/api/companies";

export type SalarySubmission = {
  id: number;
  is_current_user_submission?: boolean;
  work_experience: WorkExperienceSummary;
  company: CompanyMinimal | null;
  salary: number;
  currency: string;
  created_at: string;
  updated_at: string;
};


