import { useState, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Page from "@/components/pages/Page";
import SearchBlock from "@/components/common/SearchBlock";
import CompanyCard from "@/components/companies/CompanyCard";
import MultiSelectFilter from "@/components/companies/MultiSelectFilter";
import LocationFilter from "@/components/companies/LocationFilter";
import { searchCompanies, getTechnologies, getDomains, getBenefits } from "@/api/companies";
import type { CompanySearchParams } from "@/types/api/companies";
import type { Operator } from "@/types/api/common";
import { normalize, commonQueryOptions } from "@/utils/query";

const PAGE_SIZE = 25 ;

export default function CompanySearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const initialSearch = searchParams.get("search") || "";
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [searchTerm, setSearchTerm] = useState(initialSearch);

  const [technologiesInput, setTechnologiesInput] = useState<number[]>(() =>
    searchParams.get("technologies")?.split(",").map(Number) || []
  );
  const [technologies, setTechnologies] = useState<number[]>(() =>
    searchParams.get("technologies")?.split(",").map(Number) || []
  );
  const [technologyOpInput, setTechnologyOpInput] = useState<Operator>(
    (searchParams.get("technology_op") as Operator) || "OR"
  );
  const [technologyOp, setTechnologyOp] = useState<Operator>(
    (searchParams.get("technology_op") as Operator) || "OR"
  );

  const [domainsInput, setDomainsInput] = useState<number[]>(() =>
    searchParams.get("domains")?.split(",").map(Number) || []
  );
  const [domains, setDomains] = useState<number[]>(() =>
    searchParams.get("domains")?.split(",").map(Number) || []
  );
  const [domainOpInput, setDomainOpInput] = useState<Operator>(
    (searchParams.get("domain_op") as Operator) || "OR"
  );
  const [domainOp, setDomainOp] = useState<Operator>(
    (searchParams.get("domain_op") as Operator) || "OR"
  );

  const [benefitsInput, setBenefitsInput] = useState<number[]>(() =>
    searchParams.get("benefits")?.split(",").map(Number) || []
  );
  const [benefits, setBenefits] = useState<number[]>(() =>
    searchParams.get("benefits")?.split(",").map(Number) || []
  );
  const [benefitOpInput, setBenefitOpInput] = useState<Operator>(
    (searchParams.get("benefit_op") as Operator) || "OR"
  );
  const [benefitOp, setBenefitOp] = useState<Operator>(
    (searchParams.get("benefit_op") as Operator) || "OR"
  );

  const [countryInput, setCountryInput] = useState<number | null>(() => {
    const value = searchParams.get("country");
    return value ? Number(value) : null;
  });
  const [country, setCountry] = useState<number | null>(() => {
    const value = searchParams.get("country");
    return value ? Number(value) : null;
  });
  const [stateInput, setStateInput] = useState<number | null>(() => {
    const value = searchParams.get("state");
    return value ? Number(value) : null;
  });
  const [state, setState] = useState<number | null>(() => {
    const value = searchParams.get("state");
    return value ? Number(value) : null;
  });
  const [cityInput, setCityInput] = useState<number | null>(() => {
    const value = searchParams.get("city");
    return value ? Number(value) : null;
  });
  const [city, setCity] = useState<number | null>(() => {
    const value = searchParams.get("city");
    return value ? Number(value) : null;
  });

  const [page, setPage] = useState(
    searchParams.get("page") ? Number(searchParams.get("page")) : 1
  );


  const { data: technologiesData = [] } = useQuery({
    ...commonQueryOptions,
    queryKey: ["technologies"],
    queryFn: getTechnologies,
  });

  const { data: domainsData = [] } = useQuery({
    ...commonQueryOptions,
    queryKey: ["domains"],
    queryFn: getDomains,
  });

  const { data: benefitsData = [] } = useQuery({
    ...commonQueryOptions,
    queryKey: ["benefits"],
    queryFn: getBenefits,
  });

  // Build search params
  const searchParamsObj: CompanySearchParams = useMemo(() => {
    const params: CompanySearchParams = {
      page,
    };

    if (searchTerm.trim()) {
      params.search = searchTerm.trim();
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
  }, [searchTerm, technologies, technologyOp, domains, domainOp, benefits, benefitOp, country, state, city, page]);

  
  const normalizedParams = useMemo(() => normalize(searchParamsObj), [searchParamsObj]) as CompanySearchParams;

  const { data: searchResults, isLoading, isError } = useQuery({
    ...commonQueryOptions, 
    queryKey: ["companies", JSON.stringify(normalizedParams)],
    queryFn: () => searchCompanies(normalizedParams ),
  });
  const totalPages = Math.ceil((searchResults?.count || 0) / PAGE_SIZE);

  const handleSearch = useCallback(() => {
    const normalizedSearch = searchInput.trim();

    setPage(1);
    setSearchTerm(normalizedSearch);

    setTechnologies([...technologiesInput]);
    setTechnologyOp(technologyOpInput);
    setDomains([...domainsInput]);
    setDomainOp(domainOpInput);
    setBenefits([...benefitsInput]);
    setBenefitOp(benefitOpInput);
    setCountry(countryInput);
    setState(stateInput);
    setCity(cityInput);

    const newSearchParams = new URLSearchParams();

    if (normalizedSearch) newSearchParams.set("search", normalizedSearch);
    if (technologiesInput.length > 0) {
      newSearchParams.set("technologies", technologiesInput.join(","));
      newSearchParams.set("technology_op", technologyOpInput);
    }
    if (domainsInput.length > 0) {
      newSearchParams.set("domains", domainsInput.join(","));
      newSearchParams.set("domain_op", domainOpInput);
    }
    if (benefitsInput.length > 0) {
      newSearchParams.set("benefits", benefitsInput.join(","));
      newSearchParams.set("benefit_op", benefitOpInput);
    }
    if (cityInput) {
      newSearchParams.set("city", cityInput.toString());
    } else if (stateInput) {
      newSearchParams.set("state", stateInput.toString());
    } else if (countryInput) {
      newSearchParams.set("country", countryInput.toString());
    }

    setSearchParams(newSearchParams, { replace: true });
  }, [
    searchInput,
    technologiesInput,
    technologyOpInput,
    domainsInput,
    domainOpInput,
    benefitsInput,
    benefitOpInput,
    countryInput,
    stateInput,
    cityInput,
    setSearchParams,
  ]);


  const handleClearAllFilters = () => {
    setSearchInput("");
    setTechnologiesInput([]);
    setTechnologyOpInput("OR");
    setDomainsInput([]);
    setDomainOpInput("OR");
    setBenefitsInput([]);
    setBenefitOpInput("OR");
    setCountryInput(null);
    setStateInput(null);
    setCityInput(null);
  };

  const hasActiveFilters = Boolean(
    technologies.length > 0 ||
      domains.length > 0 ||
      benefits.length > 0 ||
      country ||
      state ||
      city
  );

  // Prepare filters for SearchBlock
  const filters = useMemo(
    () => [
      <MultiSelectFilter
        key="technologies"
        label="Technologies"
        options={technologiesData}
        selectedIds={technologiesInput}
        operator={technologyOpInput}
        onSelectionChange={setTechnologiesInput}
        onOperatorChange={setTechnologyOpInput}
        placeholder="Select technologies..."
      />,
      <MultiSelectFilter
        key="domains"
        label="Domains"
        options={domainsData}
        selectedIds={domainsInput}
        operator={domainOpInput}
        onSelectionChange={setDomainsInput}
        onOperatorChange={setDomainOpInput}
        placeholder="Select domains..."
      />,
      <MultiSelectFilter
        key="benefits"
        label="Benefits"
        options={benefitsData}
        selectedIds={benefitsInput}
        operator={benefitOpInput}
        onSelectionChange={setBenefitsInput}
        onOperatorChange={setBenefitOpInput}
        placeholder="Select benefits..."
      />,
      <LocationFilter
        key="location"
        selectedCountry={countryInput}
        selectedState={stateInput}
        selectedCity={cityInput}
        onLocationChange={(c, s, newCity) => {
          setCountryInput(c);
          setStateInput(s);
          setCityInput(newCity);
        }}
      />,
    ],
    [
      technologiesData,
      technologiesInput,
      technologyOpInput,
      domainsData,
      domainsInput,
      domainOpInput,
      benefitsData,
      benefitsInput,
      benefitOpInput,
      countryInput,
      stateInput,
      cityInput,
    ]
  );

  // search results components
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
          searchTerm={searchInput}
          setSearchTerm={setSearchInput}
          showSearchButton
          onSearch={handleSearch}
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
          totalPages={totalPages}
          currentPage={page}
          setCurrentPage={setPage}
        />
      </div>
    </Page>
  );
}
