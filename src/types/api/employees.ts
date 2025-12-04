export type JobTitle = {
  id: number;
  name: string;
  slug: string;
};

export type JobRole = {
  id: number;
  seniority_level: string;
  job_title: JobTitle;
};