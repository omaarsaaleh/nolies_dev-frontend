import type { WorkplaceVerificationAttempt } from "@/types/api/verifications";
import { VerifyWorkEmailAttemptDialog } from "./work-email/VerifyWorkEmailAttemptDialog";

type VerifyAttemptDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  attempt: WorkplaceVerificationAttempt | null;
};

export function VerifyAttemptDialog({ open, onOpenChange, onSuccess, attempt, }: VerifyAttemptDialogProps) {
  if(!attempt)
      return null;
  if (attempt.type === "WORK_EMAIL") {
    return (
      <VerifyWorkEmailAttemptDialog open={open} onOpenChange={onOpenChange} onSuccess={onSuccess} attempt={attempt}/>
    );
  }
  return null;
}