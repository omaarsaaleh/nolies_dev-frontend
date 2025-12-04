import type { WorkExperienceSummary } from "@/types/api/experiences";
import type { CompanyMinimal } from "@/types/api/companies";
import type { Reviewer } from "@/types/api/user";


export type CompanyReview = {
  id: number;
  work_experience: WorkExperienceSummary ;
  company: CompanyMinimal | null;
  reviewer: Reviewer | null;
  is_current_user_submission?: boolean;
  show_employee_details: boolean;
  show_role: boolean;
  show_working_period: boolean;
  review_text: string;
  advice_to_management: string;
  onboarding: number;
  work_life_balance: number;
  management: number;
  career_growth: number;
  promoting_process: number;
  day_to_day_atmosphere: number;
  salary_satisfaction: number;
  work_hours_flexibility: number;
  job_security: number;
  recognition: number;
  team_collaboration: number;
  final_calculated_rating: string;
  created_at: string;
  updated_at: string;
};


