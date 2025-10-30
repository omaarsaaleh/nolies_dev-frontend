import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Page from "@/components/Page";
import SearchBlock from "@/components/features/common/SearchBlock";
import CompanyCard from "@/components/features/companies/CompanyCard";
import MultiSelectFilter from "@/components/features/companies/MultiSelectFilter";
import LocationFilter from "@/components/features/companies/LocationFilter";
import { searchCompanies, getTechnologies, getDomains, getBenefits } from "@/api/companies";
import type { CompanySearchParams } from "@/types/api/companies";
import type { Operator } from "@/types/api/common";

export default function CompanySearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  const [technologies, setTechnologies] = useState<number[]>([]);
  const [technologyOp, setTechnologyOp] = useState<Operator>("OR");
  const [domains, setDomains] = useState<number[]>([]);
  const [domainOp, setDomainOp] = useState<Operator>("OR");
  const [benefits, setBenefits] = useState<number[]>([]);
  const [benefitOp, setBenefitOp] = useState<Operator>("OR");
  const [country, setCountry] = useState<number | null>(null);
  const [state, setState] = useState<number | null>(null);
  const [city, setCity] = useState<number | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: technologiesData = [] } = useQuery({
    queryKey: ["technologies"],
    queryFn: getTechnologies,
  });

  const { data: domainsData = [] } = useQuery({
    queryKey: ["domains"],
    queryFn: getDomains,
  });

  const { data: benefitsData = [] } = useQuery({
    queryKey: ["benefits"],
    queryFn: getBenefits,
  });

  // Build search params
  const searchParamsObj: CompanySearchParams = useMemo(() => {
    const params: CompanySearchParams = {
      page,
    };

    if (debouncedSearchTerm.trim()) {
      params.search = debouncedSearchTerm.trim();
    }

    if (technologies.length > 0) {
      params.technologies = technologies;
      params.technology_op = technologyOp;
    }

    if (domains.length > 0) {
      params.domains = domains;
      params.domain_op = domainOp;
    }

    if (benefits.length > 0) {
      params.benefits = benefits;
      params.benefit_op = benefitOp;
    }

    if (city) {
      params.city = city;
    } else if (state) {
      params.state = state;
    } else if (country) {
      params.country = country;
    }

    return params;
  }, [debouncedSearchTerm, technologies, technologyOp, domains, domainOp, benefits, benefitOp, country, state, city, page]);

  // Search companies
  function normalizeSearchParams(params: CompanySearchParams) {
    const normalized = { ...params };
  
    if (normalized.domains) normalized.domains = [...normalized.domains].sort();
    if (normalized.technologies) normalized.technologies = [...normalized.technologies].sort();
    if (normalized.benefits) normalized.benefits = [...normalized.benefits].sort();
  
    return normalized;
  }
  
  function stableStringify(obj: any) {
    return JSON.stringify(obj, Object.keys(obj).sort());
  }
  const normalizedParams = useMemo(() => normalizeSearchParams(searchParamsObj), [searchParamsObj]);

const { data: searchResults, isLoading, isError } = useQuery({
  queryKey: ["companies", "search", stableStringify(normalizedParams)],
  queryFn: () => searchCompanies(normalizedParams),
  staleTime: 5 * 60 * 1000, // optional caching policy
});

  // Update URL when search params change
  useEffect(() => {
    const newSearchParams = new URLSearchParams();
    
    if (debouncedSearchTerm) newSearchParams.set("search", debouncedSearchTerm);
    if (technologies.length > 0) {
      newSearchParams.set("technologies", technologies.join(","));
      newSearchParams.set("technology_op", technologyOp);
    }
    if (domains.length > 0) {
      newSearchParams.set("domains", domains.join(","));
      newSearchParams.set("domain_op", domainOp);
    }
    if (benefits.length > 0) {
      newSearchParams.set("benefits", benefits.join(","));
      newSearchParams.set("benefit_op", benefitOp);
    }
    if (city) {
      newSearchParams.set("city", city.toString());
    } else if (state) {
      newSearchParams.set("state", state.toString());
    } else if (country) {
      newSearchParams.set("country", country.toString());
    }
    if (page > 1) newSearchParams.set("page", page.toString());

    setSearchParams(newSearchParams, { replace: true });
  }, [debouncedSearchTerm, technologies, technologyOp, domains, domainOp, benefits, benefitOp, country, state, city, page, setSearchParams]);

  // Initialize filters from URL
  useEffect(() => {
    const urlSearch = searchParams.get("search");
    if (urlSearch !== null) setSearchTerm(urlSearch);

    const urlTechnologies = searchParams.get("technologies");
    if (urlTechnologies) {
      setTechnologies(urlTechnologies.split(",").map(Number));
    }

    const urlTechnologyOp = searchParams.get("technology_op") as Operator;
    if (urlTechnologyOp) setTechnologyOp(urlTechnologyOp);

    const urlDomains = searchParams.get("domains");
    if (urlDomains) {
      setDomains(urlDomains.split(",").map(Number));
    }

    const urlDomainOp = searchParams.get("domain_op") as Operator;
    if (urlDomainOp) setDomainOp(urlDomainOp);

    const urlBenefits = searchParams.get("benefits");
    if (urlBenefits) {
      setBenefits(urlBenefits.split(",").map(Number));
    }

    const urlBenefitOp = searchParams.get("benefit_op") as Operator;
    if (urlBenefitOp) setBenefitOp(urlBenefitOp);

    const urlCountry = searchParams.get("country");
    if (urlCountry) setCountry(Number(urlCountry));

    const urlState = searchParams.get("state");
    if (urlState) setState(Number(urlState));

    const urlCity = searchParams.get("city");
    if (urlCity) setCity(Number(urlCity));

    const urlPage = searchParams.get("page");
    if (urlPage) setPage(Number(urlPage));
  }, [searchParams]);

  const handleClearAllFilters = () => {
    setSearchTerm("");
    setTechnologies([]);
    setDomains([]);
    setBenefits([]);
    setCountry(null);
    setState(null);
    setCity(null);
    setPage(1);
  };

  const hasActiveFilters = Boolean(searchTerm || technologies.length > 0 || domains.length > 0 || benefits.length > 0 || country || state || city);

  // Prepare filters for SearchBlock
  const filters = useMemo(() => [
    <MultiSelectFilter
      key="technologies"
      label="Technologies"
      options={technologiesData}
      selectedIds={technologies}
      operator={technologyOp}
      onSelectionChange={setTechnologies}
      onOperatorChange={setTechnologyOp}
      placeholder="Select technologies..."
    />,
    <MultiSelectFilter
      key="domains"
      label="Domains"
      options={domainsData}
      selectedIds={domains}
      operator={domainOp}
      onSelectionChange={setDomains}
      onOperatorChange={setDomainOp}
      placeholder="Select domains..."
    />,
    <MultiSelectFilter
      key="benefits"
      label="Benefits"
      options={benefitsData}
      selectedIds={benefits}
      operator={benefitOp}
      onSelectionChange={setBenefits}
      onOperatorChange={setBenefitOp}
      placeholder="Select benefits..."
    />,
    <LocationFilter
      key="location"
      selectedCountry={country}
      selectedState={state}
      selectedCity={city}
      onLocationChange={(c, s, city) => {
        setCountry(c);
        setState(s);
        setCity(city);
      }}
    />
  ], [technologiesData, technologies, technologyOp, domainsData, domains, domainOp, benefitsData, benefits, benefitOp, country, state, city]);

  // Prepare search results for SearchBlock
  const searchResultsNodes = useMemo(() => {
    if (!searchResults?.results) return [];
    return searchResults.results.map((company) => (
      <CompanyCard key={company.id} company={company} />
    ));
  }, [searchResults?.results]);


  return (
    <Page>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Search Companies</h1>
          <p className="text-muted-foreground">
            Discover companies and their technologies, domains, and benefits
          </p>
        </div>

        {/* SearchBlock Component */}
        <SearchBlock
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          searchPlaceHolder="Search companies by name..."
          filters={filters}
          hasActiveFilters={hasActiveFilters}
          handleClearFilters={handleClearAllFilters}
          verboseName="company"
          verboseNamePlural="companies"
          searchResults={searchResultsNodes}
          isSearchResultsLoading={isLoading}
          isSearchResultsError={isError}
          searchResultsCount={searchResults?.count}
          pageSize={25}
          currentPage={page}
          setcurrentPage={setPage}
        />
      </div>
    </Page>
  );
}
