import { VERIFICATION_TYPES } from "@/constants/api/profile"
import { Badge } from "@/components/ui/badge"
import type { VerificationType } from "@/types/api/verifications"
import { cn } from "@/lib/utils"

export type VerificationTypeBadgeProps = {
  type: VerificationType, 
  className?: string
}

export default function VerificationTypeBadge({type, className} : VerificationTypeBadgeProps){
  return (
    <Badge variant="secondary" className={cn("uppercase text-[11px] tracking-wide shrink-0", className)}>
      {VERIFICATION_TYPES[type]?.label || "Unknown"}
    </Badge>
  )
}