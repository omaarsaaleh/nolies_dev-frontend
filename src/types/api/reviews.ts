export type Reviewer = {
  id: number;
  first_name: string;
  last_name: string;
};

export type JobTitle = {
  id: number;
  name: string;
};

export type JobRole = {
  id: number;
  seniority_level: string;
  job_title: JobTitle;
};

export type WorkExperience = {
  id: number;
  is_verified: boolean;
  job_role: JobRole;
  start_date: string | null;
  end_date: string | null;
};

export type CompanyMinimalForReview = {
  id: number;
  name: string;
  slug: string;
};

export type CompanyReview = {
  id: number;
  work_experience: WorkExperience | null;
  company: CompanyMinimalForReview | null;
  reviewer: Reviewer | null;
  show_employee_details: boolean;
  show_role: boolean;
  show_working_period: boolean;
  review_text: string;
  advice_to_management: string;
  is_current_user_submission: boolean | undefined;
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


