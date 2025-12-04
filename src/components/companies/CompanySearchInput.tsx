import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchCompanies } from "@/api/companies";
import type { CompanyMinimal } from "@/types/api/companies";
import { CompanyAvatar } from "@/components/companies/CompanyAvatar";
import { SearchComboBox } from "@/components/common/SearchComboBox";
import { CheckIcon } from "lucide-react";
import { commonQueryOptions } from "@/utils/query";

type CompanySearchInputProps = {
  value: CompanyMinimal | null;
  onSelect: (company: CompanyMinimal | null) => void;
  placeholder?: string;
  className?: string;
  minSearchLength?: number;
};

export function CompanySearchInput({
  value,
  onSelect,
  placeholder = "Search for a company...",
  className,
  minSearchLength = 2,
}: CompanySearchInputProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const searchQuery = useQuery({
    ...commonQueryOptions,
    queryKey: ["company-search", searchTerm],
    queryFn: async () => {
      const response = await searchCompanies({ search: searchTerm, page: 1 });
      return response.results ?? [];
    },
    enabled: searchTerm.length >= minSearchLength,
    select: (data) => data ?? [],
  });

  return (
    <SearchComboBox
      value={value}
      onSelect={onSelect}
      results={searchQuery.data ?? []}
      isSearching={searchQuery.isFetching}
      onSearchTermChange={setSearchTerm}
      getItemValue={(company) => company.slug}
      getItemLabel={(company) => company.name}
      renderItem={(company, isSelected) => (
        <>
          <div className="flex flex-1 items-center gap-2.5 overflow-hidden">
            <CompanyAvatar company={company} className="h-12 w-12" />
            <span className="truncate font-medium">{company.name}</span>
          </div>
          {isSelected && (
            <>
              <span className="text-xs text-primary mr-2">Selected</span>
              <CheckIcon size={16} className="ml-auto" />
            </>
          )}
        </>
      )}
      renderSelected={(company) => (
        <>
          <CompanyAvatar company={company} className="h-8 w-8" />
          <span className="truncate">{company.name}</span>
        </>
      )}
      placeholder={placeholder}
      searchPlaceholder="Search companies..."
      emptyMessage="No companies found."
      className={className}
      minSearchLength={minSearchLength}
    />
  );
}

