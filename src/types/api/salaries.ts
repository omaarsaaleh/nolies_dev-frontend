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

export type CompanyMinimalForSalary = {
  id: number;
  name: string;
  slug: string;
};

export type SalarySubmission = {
  id: number;
  is_current_user_submission: boolean | undefined;
  work_experience: WorkExperience;
  company: CompanyMinimalForSalary | null;
  salary: number;
  currency: string;
  created_at: string;
  updated_at: string;
};


