import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Calendar, UserRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { CompanyReview } from "@/types/api/reviews";

function getRatingClasses(rating: number): string {
  const normalized = rating / 5;

  const colorMap = [
    { max: 0.2, base: "red" },
    { max: 0.4, base: "orange" },
    { max: 0.6, base: "yellow" },
    { max: 0.8, base: "lime" },
    { max: 1, base: "green" },
  ];

  const color = colorMap.find(({ max }) => normalized <= max)?.base ?? "gray";

  // static class mapping so Tailwind can detect all classes at build time
  const classMap: Record<string, string> = {
    red: "dark:bg-red-100 dark:text-red-700 bg-red-50 text-red-600 border-red-300",
    orange: "dark:bg-orange-100 dark:text-orange-700 bg-orange-50 text-orange-600 border-orange-300",
    yellow: "dark:bg-yellow-100 dark:text-yellow-700 bg-yellow-50 text-yellow-600 border-yellow-300",
    lime: "dark:bg-lime-100 dark:text-lime-700 bg-lime-50 text-lime-600 border-lime-300",
    green: "dark:bg-green-100 dark:text-green-700 bg-green-50 text-green-600 border-green-300",
    gray: "dark:bg-gray-100 dark:text-gray-700 bg-gray-50 text-gray-600 border-gray-300",
  };

  return classMap[color] ?? classMap.gray;
}

type ReviewCardProps = {
  review: CompanyReview;
  className?: string;
};

const ratingFields = [
  { key: "onboarding", label: "Onboarding" },
  { key: "work_life_balance", label: "Work-life balance" },
  { key: "management", label: "Management" },
  { key: "career_growth", label: "Career growth" },
  { key: "promoting_process", label: "Promoting process" },
  { key: "day_to_day_atmosphere", label: "Day-to-day" },
  { key: "salary_satisfaction", label: "Salary satisfaction" },
  { key: "work_hours_flexibility", label: "Hours flexibility" },
  { key: "job_security", label: "Job security" },
  { key: "recognition", label: "Recognition" },
  { key: "team_collaboration", label: "Team collaboration" },
] as const;

export default function ReviewCard({ review, className }: ReviewCardProps) {
  const finalRating = parseFloat(review.final_calculated_rating);

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row flex-wrap items-center gap-3">
        {/* Reviewer Info */}
        <div className="flex items-center gap-3 flex-1">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-muted">
              <UserRound className="h-5 w-5 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>

          <div className="">
            <CardTitle className="text-base">
              {review.reviewer
                ? `${review.reviewer.first_name} ${review.reviewer.last_name}`
                : "Anonymous"}
            </CardTitle>

            {review.show_role && review?.work_experience?.job_role && (
              <div className="text-xs text-muted-foreground mt-0.5">
                {review.work_experience.job_role.job_title.name} •{" "}
                {review.work_experience.job_role.seniority_level}
              </div>
            )}

            {review.work_experience && review.show_working_period && (
              <div className="text-xs text-muted-foreground inline-flex items-center gap-1 mt-0.5">
                <Calendar className="h-3 w-3" />
                {review.work_experience.start_date} → {review.work_experience.end_date ?? "Ongoing"}
              </div>
            )}
          </div>
        </div>

        {/* Final Rating */}
        <div
          className={cn(
            "rounded-lg border px-4 py-2 text-center min-w-[80px]",
            getRatingClasses(finalRating)
          )}
        >
          <div className="text-xs font-semibold mb-0.5">Final Rating</div>
          <div className="text-2xl font-bold">{review.final_calculated_rating}</div>
          <div className="text-xs">out of 5</div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="details">
            <AccordionTrigger>Detailed Ratings & Review</AccordionTrigger>
            <AccordionContent className="space-y-4">
              {/* Ratings Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {ratingFields.map(({ key, label }) => {
                  const value = review[key as keyof CompanyReview] as number ;
                  return (
                    <div
                      key={key}
                      className="flex items-center justify-between gap-2 rounded-md border px-2 py-1.5"
                    >
                      <span className="text-xs text-muted-foreground">{label}</span>
                      <Badge
                        className={cn("text-xs border", getRatingClasses(value))}
                      >
                        {value ?? "-"}
                      </Badge>
                    </div>
                  );
                })}
              </div>

              {/* Review Text */}
              <div>
                <div className="text-xs font-semibold text-foreground/80 mb-2">Review</div>
                <div className="text-sm leading-relaxed rounded-2xl border bg-muted/50 px-3 py-2">
                  {review.review_text || (
                    <span className="text-muted-foreground italic">
                      No review text provided.
                    </span>
                  )}
                </div>
              </div>

              {/* Advice to Management */}
              <div>
                <div className="text-xs font-semibold text-foreground/80 mb-2">
                  Advice to management
                </div>
                <div className="text-sm leading-relaxed rounded-2xl border bg-muted/50 px-3 py-2">
                  {review.advice_to_management || (
                    <span className="text-muted-foreground italic">
                      No advice provided.
                    </span>
                  )}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
