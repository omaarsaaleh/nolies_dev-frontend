import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Form, FormField, FormItem, FormLabel, FormControl, FormErrors, FormError, addErrors } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { CompanySearchInput } from "../../../companies/CompanySearchInput";
import { Badge } from "@/components/ui/badge";

import type { CompanyMinimal } from "@/types/api/companies";
import { 
  type CreateWorkEmailVerificationAttemptFormData,
  createWorkEmailVerificationAttemptSchema 
} from "@/api/verifications";
import { attemptWorkEmailVerification } from "@/api/verifications";
import { ValidationError, VerificationError } from "@/api/errors";
import { validateEmailDomain } from "@/utils/validation";
import { VERIFICATION_TYPES } from "@/constants/api/profile";
import { useState } from "react";

type WorkEmailVerificationFormProps = {
  onSuccess: () => void;
  onClose: () => void;
  selectedCompany: CompanyMinimal | null;
  setSelectedCompany: (company: CompanyMinimal | null) => void;
};

const type = VERIFICATION_TYPES["WORK_EMAIL"];

export function WorkEmailVerificationForm({
  onSuccess,
  onClose,
  selectedCompany,
  setSelectedCompany,
}: WorkEmailVerificationFormProps) {
  const [formError, setFormError] = useState<string>();

  const form = useForm<CreateWorkEmailVerificationAttemptFormData>({
    resolver: zodResolver(createWorkEmailVerificationAttemptSchema),
    defaultValues: {
      company: "",
      work_email: "",
    },
  });

  const handleCompanySelect = (company: CompanyMinimal | null) => {
    setSelectedCompany(company);
    form.setValue("company", company?.slug || "");
  };

  const createAttemptMutation = useMutation({
    mutationFn: attemptWorkEmailVerification,
    onSuccess: () => {
      toast.success(type.onAttemptCreateMessage);
      onSuccess();
      onClose();
      form.reset();
      setSelectedCompany(null);
    },
    onError: (error) => {
      if (error instanceof ValidationError) {
        addErrors(form, error.field_errors);
      } 
      else if (error instanceof VerificationError) {
        setFormError(error.message);
      }
    },
  });


  const onSubmit = async (values: CreateWorkEmailVerificationAttemptFormData) => {
    if (!selectedCompany) {
      toast.error("Please select a company");
      return;
    }

    const allowedDomains = selectedCompany.mail_domains.map(m => m.domain);
    if (!validateEmailDomain(values.work_email, allowedDomains)) {
      form.setError("work_email", {
        type: "validate",
        message: "Please use a valid work email from above",
      });
      return;
    }

    await createAttemptMutation.mutateAsync(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <FormLabel>Company</FormLabel>
          <CompanySearchInput
            value={selectedCompany}
            onSelect={handleCompanySelect}
            className={"h-11"}
            placeholder="Search for a company..."
          />
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <input type="hidden" {...field} />
                </FormControl>
                <FormErrors error={form.formState.errors.company}/>
              </FormItem>
            )}
          />
          <p className="text-xs text-muted-foreground">
            Select the company you want to verify your workplace with.
          </p>
        </div>

        {selectedCompany && (
          <>
            <div className="rounded-md border bg-muted/30 p-4 space-y-3">
                <div className="font-medium text-xs uppercase tracking-wide text-muted-foreground">Allowed email domains</div>
                {selectedCompany.mail_domains.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedCompany.mail_domains.map((domain) => (
                      <Badge key={domain.id} variant="outline" className="text-xs font-mono">
                        @{domain.domain}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    This company has no verified mail domains yet. Contact support to add domains.
                  </div>
                )}
            </div>
            {
              selectedCompany.mail_domains.length > 0 && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="work_email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Work Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="you@company.com"
                            {...field}
                            disabled={createAttemptMutation.isPending || !selectedCompany}
                          />
                        </FormControl>
                        <FormErrors error={form.formState.errors.work_email}/>
                      </FormItem>
                    )}
                  />
                </div>
              )
            }
            
          </>
        )}

        <FormError formError={formError} className="text-center" />

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={createAttemptMutation.isPending || !selectedCompany || selectedCompany?.mail_domains.length <= 0}
          >
            {createAttemptMutation.isPending ? "Pending..." : "Send OTP"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

