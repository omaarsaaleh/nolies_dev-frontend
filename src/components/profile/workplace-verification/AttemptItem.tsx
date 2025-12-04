import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, ClipboardClock } from "lucide-react";
import type { WorkplaceVerificationAttempt } from "@/types/api/verifications";
import { CompanyAvatar } from "@/components/companies/CompanyAvatar";
import { formatLocalDateTime } from "@/utils/format";
import VerificationTypeBadge from "./VerificationTypeBadge";
import { cn } from "@/lib/utils";

type AttemptItemProps = {
  attempt: WorkplaceVerificationAttempt;
  onVerify: () => void;
  className?: string;
};

export function AttemptItem({ attempt, onVerify, className }: AttemptItemProps) {
  const { company, attempt: attemptData, type, created_at, is_verified } = attempt;
  const isLocked = attemptData.is_locked;

  return (
    <div className={cn("p-4 md:p-5 space-y-4", className)}>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <CompanyAvatar company={company} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium truncate">{company.name}</span>
              <VerificationTypeBadge type={type} />

            </div>
            <div className="text-muted-foreground text-sm mt-1 truncate">
              {attemptData.work_email}
            </div>
            <div className="text-muted-foreground text-xs mt-2 space-y-1">
              <div>Created {formatLocalDateTime(created_at)}</div>
              {attemptData.last_sent_at && (
                <div>Last email sent {formatLocalDateTime(attemptData.last_sent_at)}</div>
              )}
            </div>
            {isLocked && attemptData.lock_reason && (
              <div className="mt-2 flex items-center gap-2 text-xs text-destructive">
                <Lock className="h-4 w-4 shrink-0" />
                <span>{attemptData.lock_reason}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0  justify-end">
          <Badge
            variant={is_verified ? "secondary" : "outline"}
            className="flex items-center gap-1 text-xs uppercase shrink-0"
          >
          {
            isLocked? (
              <>
                <Lock className="h-3.5 w-3.5" /> 
                {"Locked"}
              </>

            ) : (
              <>
                <ClipboardClock className="h-3.5 w-3.5" />
                {"Pending"}
              </>
            )
          }
            
          </Badge>
          <Button onClick={onVerify} disabled={isLocked} size="sm">
            Verify
          </Button>
        </div>
      </div>
    </div>
  );
}