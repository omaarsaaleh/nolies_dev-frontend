import { useState } from "react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VerificationTypeSelector } from "./VerificationTypeSelector";
import { VERIFICATION_TYPES } from "@/constants/api/profile";
import { type VerificationTypeOption } from "@/types/api/verifications";
import { WorkEmailVerificationForm } from "./work-email/WorkEmailVerificationForm";
import type { CompanyMinimal } from "@/types/api/companies";

type CreateVerificationAttemptDialogProps = {
  onClose: () => void;
  onSucess: () => void;
};

export function CreateVerificationAttemptDialog({
  onClose,
  onSucess,
}: CreateVerificationAttemptDialogProps) {
  const [selectedType, setSelectedType] = useState<VerificationTypeOption>(Object.values(VERIFICATION_TYPES)[0]);
  const [selectedCompany, setSelectedCompany] = useState<CompanyMinimal | null>(null);

  let FormComponent: React.ComponentType<{
    onSuccess: () => void;
    onClose: () => void;
    selectedCompany: CompanyMinimal | null;
    setSelectedCompany: (company: CompanyMinimal | null) => void;
  }>;

  if (selectedType.value === "WORK_EMAIL") {
    FormComponent = WorkEmailVerificationForm;
  } 
  else {
    throw new Error(`Unsupported verification type: ${selectedType.value}`);
  }

  return (
    <DialogContent className="sm:max-w-xl">
      <DialogHeader>
        <DialogTitle>Create verification</DialogTitle>
        <DialogDescription>
          Choose a verification type and the company.
        </DialogDescription>
      </DialogHeader>

      <VerificationTypeSelector selectedType={selectedType} onSelect={setSelectedType} />

      <FormComponent
        onSuccess={onSucess}
        onClose={onClose}
        selectedCompany={selectedCompany}
        setSelectedCompany={setSelectedCompany}
      />
    </DialogContent>
  );
}
