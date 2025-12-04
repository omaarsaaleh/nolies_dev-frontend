import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";
import { useMemo } from "react";
import { validateRolesNoOverlapAndPresent } from "@/components/profile/utils";
import { CompanySearchInput } from "@/components/companies/CompanySearchInput";
import { useQuery } from "@tanstack/react-query";
import { getWorkplaceVerifications } from "@/api/verifications";
import { searchCompanies } from "@/api/companies";
import { SearchComboBox } from "@/components/common/SearchComboBox";
import { CheckIcon } from "lucide-react";
import { commonQueryOptions } from "@/utils/query";
import type { WorkplaceVerification } from "@/types/api/verifications";
import { JobRoleSelector } from "./JobRoleSelector";

const roleSchema = z.object({
  id: z.number().optional(),
  job_role: z.number().min(1, "Job role is required"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().nullable().optional(),
  present: z.boolean().optional(),
});

const schema = z.object({
  company: z.string().min(1, "Company is required"),
  roles: z.array(roleSchema).min(1, "At least one role is required").max(5, "Maximum 5 roles allowed"),
  verification: z.number().optional().nullable(),
}).superRefine((values, ctx) => {
  const errors = validateRolesNoOverlapAndPresent(values.roles);
  for (const message of errors) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["roles"], message });
  }
});

export type WorkExperienceFormValues = z.infer<typeof schema>;

type WorkExperienceFormProps = {
  onSuccess?: () => void;
  defaultValues?: Partial<WorkExperienceFormValues>;
  onSubmit?: (values: WorkExperienceFormValues) => Promise<void> | void;
};

export default function WorkExperienceForm({ 
  onSuccess, 
  defaultValues, 
  onSubmit: onSubmitProp
}: WorkExperienceFormProps) {
  const form = useForm<WorkExperienceFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      company: defaultValues?.company ?? "",
      roles: defaultValues?.roles ?? [
        { job_role: 0 as number, start_date: "", end_date: null, present: true },
      ],
      verification: defaultValues?.verification ?? null,
      ...defaultValues,
    },
  });

  const selectedCompanySlug = form.watch("company");
  
  // Fetch company by slug if we have one (for editing or when selected)
  const { data: companyData } = useQuery({
    ...commonQueryOptions,
    queryKey: ["company-by-slug", selectedCompanySlug],
    queryFn: async () => {
      if (!selectedCompanySlug) return null;
      const response = await searchCompanies({ search: selectedCompanySlug, page: 1, page_size: 50 });
      return response.results.find((c) => c.slug === selectedCompanySlug) ?? null;
    },
    enabled: !!selectedCompanySlug,
  });

  const selectedCompany = companyData ?? null;

  // Fetch verifications for the selected company
  const { data: verificationsData } = useQuery({
    ...commonQueryOptions,
    queryKey: ["workplace-verifications", selectedCompanySlug],
    queryFn: async () => {
      if (!selectedCompanySlug) return { results: [] };
      const response = await getWorkplaceVerifications({ page: 1, page_size: 100 });
      // Filter by company slug
      return {
        results: response.results.filter((v) => v.company.slug === selectedCompanySlug),
      };
    },
    enabled: !!selectedCompanySlug,
  });

  const availableVerifications = useMemo(() => {
    return verificationsData?.results ?? [];
  }, [verificationsData?.results]);

  const { fields, append, remove } = useFieldArray({ 
    control: form.control, 
    name: "roles" 
  });

  const onSubmit = async (values: WorkExperienceFormValues) => {
    await onSubmitProp?.(values);
    onSuccess?.();
  };

  const verificationId = form.watch("verification");
  const selectedVerification = useMemo(() => {
    if (!verificationId) return null;
    return availableVerifications.find((v) => v.id === verificationId) ?? null;
  }, [verificationId, availableVerifications]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company</FormLabel>
              <FormControl>
                <CompanySearchInput
                  value={selectedCompany}
                  onSelect={(company) => {
                    field.onChange(company?.slug ?? "");
                    // Reset verification when company changes
                    form.setValue("verification", null);
                  }}
                  placeholder="Search for a company..."
                />
              </FormControl>
              <FormDescription>
                Select the company where you worked. You can have at most one work experience per company.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedCompanySlug && availableVerifications.length > 0 && (
          <FormField
            control={form.control}
            name="verification"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification (Optional)</FormLabel>
                <FormControl>
                  <SearchComboBox<WorkplaceVerification>
                    value={selectedVerification}
                    onSelect={(verification) => {
                      field.onChange(verification?.id ?? null);
                    }}
                    results={availableVerifications}
                    isSearching={false}
                    onSearchTermChange={() => {}}
                    getItemValue={(v) => v.id.toString()}
                    getItemLabel={(v) => {
                      if (v.type === "WORK_EMAIL") {
                        return `Work Email: ${(v.verification as { work_email: string }).work_email}`;
                      }
                      return `Verification #${v.id}`;
                    }}
                    renderItem={(v, isSelected) => (
                      <>
                        <div className="flex flex-1 items-center gap-2 overflow-hidden">
                          <span className="truncate">
                            {v.type === "WORK_EMAIL" 
                              ? `Work Email: ${(v.verification as { work_email: string }).work_email}`
                              : `Verification #${v.id}`}
                          </span>
                        </div>
                        {isSelected && <CheckIcon size={16} className="ml-auto" />}
                      </>
                    )}
                    placeholder="Select a verification (optional)..."
                    emptyMessage="No verifications available for this company."
                    disabled={!selectedCompanySlug}
                  />
                </FormControl>
                <FormDescription>
                  Select a workplace verification if you have one for this company.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <FormLabel>Roles ({fields.length}/5)</FormLabel>
            {fields.length < 5 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ 
                  job_role: 0 as number, 
                  start_date: "", 
                  end_date: null, 
                  present: false 
                })}
              >
                Add Role
              </Button>
            )}
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="rounded-lg border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Role {index + 1}</span>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                  >
                    Remove
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`roles.${index}.job_role` as const}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Role</FormLabel>
                      <FormControl>
                        <JobRoleSelector
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`roles.${index}.start_date` as const}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name={`roles.${index}.end_date` as const}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          disabled={form.watch(`roles.${index}.present`)} 
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value || null)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`roles.${index}.present` as const}
                  render={({ field }) => (
                    <FormItem className="flex flex-col justify-end">
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Checkbox 
                            checked={!!field.value} 
                            onCheckedChange={(v) => {
                              field.onChange(Boolean(v));
                              if (v) {
                                form.setValue(`roles.${index}.end_date`, null);
                              }
                            }} 
                          />
                        </FormControl>
                        <FormLabel className="!mt-0 cursor-pointer">
                          Currently working here
                        </FormLabel>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
