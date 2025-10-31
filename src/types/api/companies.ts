import type { Operator } from "@/types/api/common.ts";

export type DomainMinimal = {
  id: number;
  name: string;
  slug: string;
  image_url: string | null;
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

export type TechnologyDetail = {
  id: number;
  name: string;
  category: TechnologyCategory;
  slug: string;
  logo_url: string | null;
};

export type BenefitMinimal  = {
  id: number;
  name: string;
  slug: string;
};

export type CountryMinimal  = {
  id: number;
  name: string;
  slug: string;
  image_url: string | null;
};

export type StateMinimal  = {
  id: number;
  name: string;
  slug: string;
  image_url: string | null;
  country: number;
};

export type CityMinimal  = {
  id: number;
  name: string;
  slug: string;
  image_url: string | null;
  state: number;
};

export type CompanyMinimal  = {
  id: number;
  slug: string;
  name: string;
  logo_url: string | null;
  domains: DomainMinimal[];
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
};


export type Benefit = BenefitMinimal;

export type Technology = TechnologyDetail;

export type Location = {
  id: number;
  google_maps_url: string | null;
  is_certain: boolean;
  city: {
    id: number;
    name: string;
    slug: string;
    image_url: string | null;
    state: {
      id: number;
      name: string;
      slug: string;
      image_url: string | null;
      country: {
        id: number;
        name: string;
        slug: string;
        image_url: string | null;
      };
    };
  };
  street: string | null;
  building: string | null;
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

export type CompanyDetail = {
  id: number;
  name: string;
  slug: string;
  logo_url: string | null;
  website_url: string | null;
  description: string;
  benefits: Benefit[];
  domains: DomainMinimal[];
  technologies: Technology[];
  mail_domains: MailDomain[];
  locations: Location[];
  social_links: SocialLink[];
  reviewers_count: number;
  average_rating: number;
};
