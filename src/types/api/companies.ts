import type { Operator } from "@/types/api/common.ts";
import type { City } from "./common";

export type Domain = {
  id: number;
  name: string;
  slug: string;
  image_url: string | null;
};

export type Technology = {
  id: number;
  name: string;
  category: TechnologyCategory;
  slug: string;
  logo_url: string | null;
  description: string;
  documentation_url: string;
  devicon_class_light: string;
  devicon_class_dark: string;
};

export type TechnologyMinimal = {
  id: number;
  name: string;
  category: string;
  slug: string;
  logo_url: string | null;
};

export type TechnologyCategory = {
  id: number;
  name: string;
  slug: string;
};


export type Benefit = {
  id: number;
  name: string;
  slug: string;
};


export type CompanyMinimal  = {
  id: number;
  slug: string;
  name: string;
  logo_url: string | null;
  domains: Domain[];
  mail_domains: MailDomain[];
  description: string,
  reviewers_count: number;
  average_rating: number;
};

export type CompanySearchParams = {
  search?: string;
  technologies?: number[];
  technology_op?: Operator;
  domains?: number[];
  domain_op?: Operator;
  benefits?: number[];
  benefit_op?: Operator;
  country?: number;
  state?: number;
  city?: number;
  page?: number;
  page_size?: number;
};

export type MailDomain = {
  id: number;
  domain: string;
};

export type SocialLink = {
  id: number;
  platform: string;
  url: string;
};

export type Location = {
  id: number;
  google_maps_url: string ;
  is_verified: boolean;
  city: City;
  street: string ;
  building: string ;
};

export type Company = {
  id: number;
  name: string;
  slug: string;
  logo_url: string | null;
  website_url: string | null;
  description: string;
  benefits: Benefit[];
  domains: Domain[];
  technologies: Technology[];
  mail_domains: MailDomain[];
  locations: Location[];
  social_links: SocialLink[];
  reviewers_count: number;
  average_rating: number;
};