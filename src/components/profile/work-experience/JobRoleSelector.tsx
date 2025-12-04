import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { authenticatedApi } from "@/api/base";
import { SearchComboBox } from "@/components/common/SearchComboBox";
import { CheckIcon } from "lucide-react";
import { commonQueryOptions } from "@/utils/query";
import type { JobRole } from "@/types/api/employees";
import { Input } from "@/components/ui/input";

type JobRoleSelectorProps = {
  value?: number;
  onChange?: (value: number) => void;
};

async function searchJobRoles(searchTerm: string): Promise<JobRole[]> {
  try {
    const response = await authenticatedApi.get("/job-roles/", {
      params: { search: searchTerm, page_size: 50 },
    });
    return response.data.results ?? [];
  } catch {
    // If endpoint doesn't exist, return empty array
    return [];
  }
}

export function JobRoleSelector({ value, onChange }: JobRoleSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const searchQuery = useQuery({
    ...commonQueryOptions,
    queryKey: ["job-roles-search", searchTerm],
    queryFn: () => searchJobRoles(searchTerm),
    enabled: searchTerm.length >= 2,
    select: (data) => data ?? [],
  });

  const selectedJobRole = searchQuery.data?.find((jr) => jr.id === value) ?? null;

  // If no API endpoint, fall back to number input
  if (searchQuery.isError || (searchTerm.length >= 2 && searchQuery.data?.length === 0 && !searchQuery.isFetching)) {
    return (
      <Input
        type="number"
        value={value ?? ""}
        onChange={(e) => onChange?.(Number(e.target.value))}
        placeholder="Enter job role ID"
      />
    );
  }

  return (
    <SearchComboBox<JobRole>
      value={selectedJobRole}
      onSelect={(jobRole) => {
        onChange?.(jobRole?.id ?? 0);
      }}
      results={searchQuery.data ?? []}
      isSearching={searchQuery.isFetching}
      onSearchTermChange={setSearchTerm}
      getItemValue={(jr) => jr.id.toString()}
      getItemLabel={(jr) => `${jr.job_title.name} - ${jr.seniority_level}`}
      renderItem={(jr, isSelected) => (
        <>
          <div className="flex flex-1 items-center gap-2 overflow-hidden">
            <span className="truncate font-medium">{jr.job_title.name}</span>
            <span className="text-sm text-muted-foreground shrink-0">
              {jr.seniority_level}
            </span>
          </div>
          {isSelected && <CheckIcon size={16} className="ml-auto" />}
        </>
      )}
      renderSelected={(jr) => (
        <span className="truncate">
          {jr.job_title.name} - {jr.seniority_level}
        </span>
      )}
      placeholder="Search for a job role..."
      searchPlaceholder="Search job roles..."
      emptyMessage="No job roles found."
      minSearchLength={2}
    />
  );
}
