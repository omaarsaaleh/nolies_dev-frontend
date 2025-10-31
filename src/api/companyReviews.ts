import { authenticatedApi } from '@/api/base';
import type { PaginatedResponse } from '@/types/api/common';
import type { CompanyReview } from '@/types/api/reviews';

export async function getCompanyReviews(params: { slug: string; page?: number; pageSize?: number; }): Promise<PaginatedResponse<CompanyReview>> {
  const search = new URLSearchParams();
  search.append('company', params.slug);
  if (params.page) search.append('page', String(params.page));
  if (params.pageSize) search.append('page_size', String(params.pageSize));

  const response = await authenticatedApi.get(`/company-reviews/?${search.toString()}`);
  return response.data;
}


