import { authenticatedApi } from '@/api/base';
import type { PaginatedResponse } from '@/types/api/common';
import type { 
  TechnologyMinimal, 
  Domain, 
  CompanyMinimal,
  CompanySearchParams,
  Company,
  Benefit, 
} from '@/types/api/companies';
import type{
  Country, 
  StateMinimal, 
  CityMinimal,
} from '@/types/api/common';
import type { CompanyReview } from '@/types/api/reviews';
import type { SalarySubmission } from '@/types/api/salaries';


export async function searchCompanies(params: CompanySearchParams): Promise<PaginatedResponse<CompanyMinimal>> {
    const searchParams = new URLSearchParams();
    
    if (params.search) {
        searchParams.append('search', params.search);
    }
    
    if (params.technologies && params.technologies.length > 0) {
        searchParams.append('technologies', params.technologies.join(','));
        if (params.technology_op) {
            searchParams.append('technology_op', params.technology_op);
        }
    }
    
    if (params.domains && params.domains.length > 0) {
        searchParams.append('domains', params.domains.join(','));
        if (params.domain_op) {
            searchParams.append('domain_op', params.domain_op);
        }
    }
    
    if (params.benefits && params.benefits.length > 0) {
        searchParams.append('benefits', params.benefits.join(','));
        if (params.benefit_op) {
            searchParams.append('benefit_op', params.benefit_op);
        }
    }
    
    if (params.city) {
        searchParams.append('city', params.city.toString());
    } 
    else if (params.state) {
        searchParams.append('state', params.state.toString());
    } else if (params.country) {
        searchParams.append('country', params.country.toString());
    }
    
    if (params.page) {
        searchParams.append('page', params.page.toString());
    }

    if (params.page_size) {
      searchParams.append('page_size', params.page_size.toString());
  }
    
    const response = await authenticatedApi.get(`/companies/?${searchParams.toString()}`);
    
    return response.data;
}

export async function getTechnologies(): Promise<TechnologyMinimal[]> {
  const response = await authenticatedApi.get('/technologies/');
  return response.data;
}

export async function getDomains(): Promise<Domain[]> {
  const response = await authenticatedApi.get('/domains/');
  return response.data;
}

export async function getBenefits(): Promise<Benefit[]> {
  const response = await authenticatedApi.get('/benefits/');
  return response.data;
}

export async function getCountries(): Promise<Country[]> {
  const response = await authenticatedApi.get('/countries/');
  return response.data;
}

export async function getStates(countryId: number): Promise<StateMinimal[]> {
  const response = await authenticatedApi.get(`/states/?country=${countryId}`);
  return response.data;
}

export async function getCities(stateId: number): Promise<CityMinimal[]> {
  const response = await authenticatedApi.get(`/cities/?state=${stateId}`);
  return response.data;
}

export async function getCompany(slug: string): Promise<Company> {
  const response = await authenticatedApi.get(`/companies/${slug}/`);
  return response.data;
}


export async function getCompanyReviews(params: { slug: string; page?: number; pageSize?: number; }): Promise<PaginatedResponse<CompanyReview>> {
  const search = new URLSearchParams();
  search.append('company', params.slug);
  if (params.page) search.append('page', String(params.page));
  if (params.pageSize) search.append('page_size', String(params.pageSize));

  const response = await authenticatedApi.get(`/company-reviews/?${search.toString()}`);
  return response.data;
}

export async function getCompanySalaries(params: { slug: string; page?: number; pageSize?: number; }): Promise<PaginatedResponse<SalarySubmission>> {
  const search = new URLSearchParams();
  search.append('company', params.slug);
  if (params.page) search.append('page', String(params.page));
  if (params.pageSize) search.append('page_size', String(params.pageSize));

  const response = await authenticatedApi.get(`/salary-submissions/?${search.toString()}`);
  return response.data;
}


