import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Users } from "lucide-react";
import { Link } from "react-router-dom";
import type { CompanyMinimal } from "@/types/api/companies";
import { cn } from "@/lib/utils";

interface CompanyCardProps {
  company: CompanyMinimal;
  className?: string;
}

export default function CompanyCard({ company, className }: CompanyCardProps) {
  const initials = company.name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const hasRating = company.average_rating > 0;
  const hasReviews = company.reviewers_count > 0;

  return (
    <Link to={`/companies/${company.slug}`} className="block">
      <Card
        className={cn(
          "cursor-pointer border border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 transform-gpu hover:-translate-y-0.5 h-full",
          className
        )}
      >
        <CardContent className="p-6 h-full flex flex-col">
          <div className="flex flex-col items-center text-center flex-1">
            {/* Logo */}
            <Avatar className="h-16 w-16 ring-2 ring-primary/10 shadow-md mb-4">
              <AvatarImage
                src={company.logo_url || undefined}
                alt={`${company.name} logo`}
                className="object-cover"
              />
              <AvatarFallback className="bg-gradient-to-br from-primary/15 to-primary/25 text-primary font-bold text-lg shadow-inner">
                {initials}
              </AvatarFallback>
            </Avatar>

            {/* Name */}
            <h3 className="font-bold text-xl text-foreground leading-tight line-clamp-2 mb-2">
              {company.name}
            </h3>

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-3 min-h-[3.5rem]">
              {company.description || "No description available."}
            </p>

            {/* Domains */}
            <div className="flex flex-wrap justify-center gap-2 mt-auto">
              {company.domains.slice(0, 4).map((domain) => (
                <Badge
                  key={domain.id}
                  variant="secondary"
                  className="text-xs font-medium bg-primary/8 text-primary px-2 py-1"
                >
                  {domain.name}
                </Badge>
              ))}
              {company.domains.length > 4 && (
                <Badge
                  variant="outline"
                  className="text-xs font-medium px-2 py-1 border-primary/20"
                >
                  +{company.domains.length - 4}
                </Badge>
              )}
            </div>
          </div>

          {/* Stats Section */}
          <div className="flex items-center justify-between pt-4 mt-6 border-t border-border/30">
            <div className="flex items-center gap-2">
              <Star
                className={cn(
                  "h-4 w-4",
                  hasRating
                    ? "fill-yellow-400 text-yellow-400 drop-shadow-sm"
                    : "fill-muted text-muted"
                )}
              />
              <span
                className={cn(
                  "text-sm font-bold",
                  hasRating ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {hasRating ? company.average_rating.toFixed(1) : "No rating"}
              </span>
            </div>

            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span className="font-semibold">
                {hasReviews ? company.reviewers_count : 0}
              </span>
              <span className="text-xs">
                review{company.reviewers_count !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
