import { authenticatedApi } from '@/api/base';
import type { PaginatedResponse } from '@/types/api/common';
import type { SalarySubmission } from '@/types/api/salaries';

export async function getCompanySalaries(params: { slug: string; page?: number; pageSize?: number; }): Promise<PaginatedResponse<SalarySubmission>> {
  const search = new URLSearchParams();
  search.append('company', params.slug);
  if (params.page) search.append('page', String(params.page));
  if (params.pageSize) search.append('page_size', String(params.pageSize));

  const response = await authenticatedApi.get(`/salary-submissions/?${search.toString()}`);
  return response.data;
}


