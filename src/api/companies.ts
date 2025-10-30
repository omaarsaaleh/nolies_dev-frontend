import { authenticatedApi } from '@/api/base';
import type { PaginatedResponse } from '@/types/api/common';
import type { 
  TechnologyMinimal, 
  DomainMinimal, 
  BenefitMinimal, 
  CountryMinimal, 
  StateMinimal, 
  CityMinimal,
  CompanyMinimal,
  CompanySearchParams
} from '@/types/api/companies';


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
    
    const response = await authenticatedApi.get(`/companies/?${searchParams.toString()}`);
    
    return response.data;
}

export async function getTechnologies(): Promise<TechnologyMinimal[]> {
  const response = await authenticatedApi.get('/technologies/');
  return response.data;
}

export async function getDomains(): Promise<DomainMinimal[]> {
  const response = await authenticatedApi.get('/domains/');
  return response.data;
}

export async function getBenefits(): Promise<BenefitMinimal[]> {
  const response = await authenticatedApi.get('/benefits/');
  return response.data;
}

export async function getCountries(): Promise<CountryMinimal[]> {
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