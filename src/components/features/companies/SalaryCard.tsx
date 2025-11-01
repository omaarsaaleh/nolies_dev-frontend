import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Calendar, DollarSign } from "lucide-react";
import type { SalarySubmission } from "@/types/api/salaries";
import { cn } from "@/lib/utils";
import VerificationBadge from "../common/VerificationBadge";

type SalaryCardProps = {
  salarySubmission: SalarySubmission;
  className?: string;
};

export default function SalaryCard({ salarySubmission, className }: SalaryCardProps) {
  const { work_experience } = salarySubmission;
  const { job_role, is_verified, start_date, end_date } = work_experience || {};
  const { job_title, seniority_level } = job_role || {};
  
  return (
    <Card
      className={cn(
        "flex flex-col justify-between gap-3 rounded-lg border p-4 sm:p-6 transition-colors",
        "hover:border-primary/50 hover:shadow-sm",
        className
      )}
      role="region"
      aria-label={`Salary card for ${job_title?.name || "unknown role"}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <CardTitle className="flex flex-col flex-wrap gap-2 w-full">
          <div className="flex flex-wrap items-center justify-between ">
            <div>
              <span>{job_title?.name || "Unknown Role"}</span>
              {seniority_level && (
                <span>
                  {" • " + seniority_level}
                </span>
              )}
            </div>
            <VerificationBadge
              isVerified={!!is_verified}
              className=""
            />
          </div>

          <div className="text-xs text-muted-foreground flex items-center gap-1.5 whitespace-nowrap">
            <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>
              {start_date || "N/A"} → {end_date || "Ongoing"}
            </span>
          </div>
        </CardTitle>
      </div>

      {/* Content */}
      <CardContent className="flex items-center gap-4 self-center">
        <div className="rounded-full bg-muted p-3">
          <DollarSign
            className="h-5 w-5 text-muted-foreground"
            aria-hidden="true"
          />
        </div>

        <div>
          <p className="text-2xl font-semibold tracking-tight">
            {salarySubmission.salary.toLocaleString?.()}
            {" " + salarySubmission.currency || ""}
          </p>
          <p className="text-xs text-muted-foreground">Total compensation</p>
        </div>
      </CardContent>
    </Card>
  );
}
