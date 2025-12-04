import type { WorkplaceVerification } from "@/types/api/verifications";
import { CompanyAvatar } from "@/components/companies/CompanyAvatar";
import { formatLocalDateTime } from "@/utils/format";
import VerificationTypeBadge from "./VerificationTypeBadge";
import { cn } from "@/lib/utils";

type VerificationItemProps = {
  verification: WorkplaceVerification;
  className?: string;
};

export function VerificationItem({ verification, className }: VerificationItemProps) {
  const { company, type, verification: verificationData, created_at } = verification;
  
  return (
    <div className={cn("p-4", className)}>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <CompanyAvatar company={company} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium truncate">{company.name}</span>
              <VerificationTypeBadge type={type} />
            </div>
            <div className="text-muted-foreground text-sm mt-1 truncate">
              {verificationData?.work_email}
            </div>
          </div>
        </div>
        <div className="text-muted-foreground text-xs md:text-sm shrink-0">
          Created {formatLocalDateTime(created_at)}
        </div>
      </div>
    </div>
  );
}

