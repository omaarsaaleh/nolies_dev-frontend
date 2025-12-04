import { useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/format";
import type {CompanyMinimal, Company} from '@/types/api/companies.ts'
import { cn } from "@/lib/utils";

type CompanyAvatarProps = {
  company: CompanyMinimal | Company;
  className?: string;
};

export function CompanyAvatar({ company, className }: CompanyAvatarProps) {
  const initials = useMemo(() => getInitials(company.name), [company.name]);

  return (
    <Avatar className={cn("h-16 w-16 ring-2 ring-primary/10 shadow-md", className)}>
      <AvatarImage
        src={company.logo_url || undefined}
        alt={`${company.name} logo`}
        className="object-cover"
      />
      <AvatarFallback className="bg-gradient-to-br from-primary/15 to-primary/25 text-primary font-bold text-lg shadow-inner">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}