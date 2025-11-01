import { CheckCircle2, CircleX } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerificationBadgeProps {
  isVerified: boolean;
  className?: string;
}

export default function VerificationBadge({ isVerified, className }: VerificationBadgeProps) {
  return (
    <div className={cn("inline-flex items-center gap-1.5 flex-shrink-0 text-xs font-semibold", className)}>
      {isVerified ? (
        <>
          <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
          Verified
        </>
      ) : (
        <>
          <CircleX className="h-3.5 w-3.5 text-red-600" />
          Unverified
        </>
      )}
    </div>
  );
}