import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Page from "@/components/Page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getCompany } from "@/api/companies";
import { getCompanyReviews } from "@/api/companyReviews";
import { getCompanySalaries } from "@/api/salaries";
import type { CompanyDetail } from "@/types/api/companies";
import type { CompanyReview } from "@/types/api/reviews";
import type { SalarySubmission } from "@/types/api/salaries";
import Pagination from "@/components/Pagination";
import { Star, Users, Globe, ExternalLink, MapPin, Calendar, UserRound, DollarSign, CheckCircle2 } from "lucide-react";
import { FaXTwitter, FaThreads   } from "react-icons/fa6";
import { LuLinkedin, LuFacebook, LuInstagram  } from "react-icons/lu";

import { cn } from "@/lib/utils";
import type { PaginatedResponse } from "@/types/api/common";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

function getRatingColor(rating: number): string {
  const normalized = rating / 5;
  if (normalized <= 0.2) return "text-red-600 bg-red-50 border-red-200";
  if (normalized <= 0.4) return "text-orange-600 bg-orange-50 border-orange-200";
  if (normalized <= 0.6) return "text-yellow-600 bg-yellow-50 border-yellow-200";
  if (normalized <= 0.8) return "text-lime-600 bg-lime-50 border-lime-200";
  return "text-green-600 bg-green-50 border-green-200";
}

function getRatingBadgeColor(rating: number): string {
  const normalized = rating / 5;
  if (normalized <= 0.2) return "bg-red-100 text-red-700 border-red-300";
  if (normalized <= 0.4) return "bg-orange-100 text-orange-700 border-orange-300";
  if (normalized <= 0.6) return "bg-yellow-100 text-yellow-700 border-yellow-300";
  if (normalized <= 0.8) return "bg-lime-100 text-lime-700 border-lime-300";
  return "bg-green-100 text-green-700 border-green-300";
}

function CardHeading({ text }: { text: string }){
  return (
    <div className="text-m font-semibold text-foreground mb-3">{text}</div>
  )
}
function CardSubHeading({ text }: { text: string }){
  return (
    <div className="text-sm font-semibold text-foreground/80">{text}</div>
  )
}

function getSocialIcon(platform: string) {
  const platformLower = platform.toLowerCase();
  switch (platformLower) {
    case "facebook":
      return LuFacebook;
    case "linkedin":
      return LuLinkedin;
    case "instagram":
      return LuInstagram;
    case "threads":
      return FaThreads;
    case "x":
      return FaXTwitter
    default:
      return Globe;
  }
}

type TabKey = "overview" | "reviews" | "salaries" | "locations";

export default function CompanyPage() {
  const { slug = "" } = useParams();
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [reviewsPage, setReviewsPage] = useState(1);
  const [salariesPage, setSalariesPage] = useState(1);

  const { data: company, isLoading, isError } = useQuery<CompanyDetail>({
    queryKey: ["company", slug],
    queryFn: () => getCompany(slug),
    enabled: Boolean(slug),
  });

  const {
    data: reviews,
    isLoading: isLoadingReviews,
  } = useQuery<PaginatedResponse<CompanyReview>>({
    queryKey: ["company-reviews", slug, reviewsPage],
    queryFn: () => getCompanyReviews({ slug, page: reviewsPage, pageSize: 25 }),
    enabled: Boolean(slug) && activeTab === "reviews",
  });

  const {
    data: salaries,
    isLoading: isLoadingSalaries,
  } = useQuery<PaginatedResponse<SalarySubmission>>({
    queryKey: ["company-salaries", slug, salariesPage],
    queryFn: () => getCompanySalaries({ slug, page: salariesPage, pageSize: 25 }),
    enabled: Boolean(slug) && activeTab === "salaries",
  });

  const initials = useMemo(() => {
    const name = company?.name || "";
    return name
      .split(" ")
      .map((w) => w.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [company?.name]);

  const technologiesByCategory = useMemo(() => {
    if (!company?.technologies || company.technologies.length === 0) return {};
    
    const grouped: Record<string, typeof company.technologies> = {};
    company.technologies.forEach((tech) => {
      const categoryName = tech.category?.name || "Others";
      if (!grouped[categoryName]) {
        grouped[categoryName] = [];
      }
      grouped[categoryName].push(tech);
    });
    
    return grouped;
  }, [company]);

  return (
    <Page>
        {isLoading && (
          <div className="text-center text-muted-foreground">Loading company…</div>
        )}
        {isError && (
          <div className="text-center text-red-600">Failed to load company.</div>
        )}
        {company && (
          <>
            <header className="flex flex-col items-center gap-4 text-center">
              <Avatar className="h-20 w-20 ring-2 ring-primary/10 shadow-md">
                <AvatarImage src={company.logo_url || undefined} alt={`${company.name} logo`} className="object-cover" />
                <AvatarFallback className="bg-gradient-to-br from-primary/15 to-primary/25 text-primary font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h1 className="text-3xl font-bold leading-tight">{company.name}</h1>
                <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
                  {company.website_url && (
                    <Button asChild size="sm" variant="outline" className="h-7 px-2">
                      <a href={company.website_url} target="_blank" rel="noreferrer">
                        <Globe className="h-3.5 w-3.5 mr-1" /> Website <ExternalLink className="h-3.5 w-3.5 ml-1" />
                      </a>
                    </Button>
                  )}
                  <span className="inline-flex items-center gap-1">
                    <Star className={cn("h-4 w-4", company.average_rating > 0 ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted")} />
                    <span className="font-semibold">{company.average_rating > 0 ? Number(company.average_rating).toFixed(2) : "No rating"}</span>
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span className="font-semibold">{company.reviewers_count}</span>
                    <span className="text-xs">reviews</span>
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {company.domains?.map((d) => (
                  <Badge key={d.id} variant="secondary" className="text-xs font-medium bg-primary/8 text-primary px-2 py-1">
                    {d.name}
                  </Badge>
                ))}
              </div>
            </header>

            <div className="sticky top-0 z-10 bg-background/80 supports-[backdrop-filter]:bg-background/60 backdrop-blur mt-4">
              <div className="flex items-center justify-center pb-4">
                <Tabs value={activeTab} onValueChange={(v: string) => setActiveTab(v as TabKey)}>
                  <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                    <TabsTrigger value="salaries">Salaries</TabsTrigger>
                    <TabsTrigger value="locations">Locations</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={(v: string) => setActiveTab(v as TabKey)}>
              <TabsContent value="overview">
                <section>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {company.description && (
                        <div>
                          <CardHeading text="Description" />
                          <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                            {company.description}
                          </p>
                        </div>
                      )}
                      <div>
                        <CardHeading text="Technologies"/>
                        {Object.keys(technologiesByCategory).length > 0 ? (
                          <div className="space-y-4">
                            {Object.entries(technologiesByCategory).map(([categoryName, technologies]) => (
                              <div key={categoryName} className="space-y-2">
                                <CardSubHeading text={categoryName}/>
                                <div className="flex flex-wrap gap-4">
                                  {technologies.map((tech) => (
                                    <div key={tech.id} className="flex flex-col items-center gap-2">
                                      <Avatar className="h-10 w-10">
                                        <AvatarImage src={tech.logo_url || undefined} alt={tech.name} />
                                        <AvatarFallback className="text-xs">{tech.name.charAt(0)}</AvatarFallback>
                                      </Avatar>
                                      <span className="text-xs font-medium text-center">{tech.name}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground italic">No technologies available.</div>
                        )}
                      </div>
                      <div>
                        <CardHeading text="Benefits"/>
                        {company.benefits && company.benefits.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {company.benefits.map((b) => (
                              <Badge key={b.id} variant="outline" className="px-2 py-1 text-xs">
                                {b.name}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground italic">No benefits available.</div>
                        )}
                      </div>
                      {company.social_links && company.social_links.length > 0 && (
                        <div>
                          <CardHeading text="Social Links"/>
                          <div className="flex flex-wrap gap-2">
                            {company.social_links.map((link) => {
                              const Icon = getSocialIcon(link.platform);
                              return (
                                <Button
                                  key={link.id}
                                  asChild
                                  variant="outline"
                                  size="sm"
                                  className="h-8 px-3"
                                >
                                  <a href={link.url} target="_blank" rel="noreferrer">
                                    <Icon className="h-3.5 w-3.5 mr-1.5" />
                                    <span className="capitalize">{link.platform}</span>
                                    <ExternalLink className="h-3 w-3 ml-1.5" />
                                  </a>
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </section>
              </TabsContent>

              <TabsContent value="reviews">
                <section className="space-y-4">
                {isLoadingReviews && (
                  <div className="text-center text-muted-foreground">Loading reviews…</div>
                )}
                {!!reviews?.results?.length && reviews.results.map((r: CompanyReview) => {
                  const finalRating = parseFloat(r.final_calculated_rating);
                  return (
                    <Card key={r.id}>
                      <CardHeader className="flex flex-row items-center gap-3">
                        <div className="flex items-center gap-3 flex-1">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-muted">
                              <UserRound className="h-5 w-5 text-muted-foreground" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <CardTitle className="text-base">
                              {r.show_employee_details && r.reviewer
                                ? `${r.reviewer.first_name} ${r.reviewer.last_name}`
                                : "Anonymous"}
                            </CardTitle>
                            {r.show_role && (
                              <div className="text-xs text-muted-foreground mt-0.5">
                                {r.work_experience.job_role.job_title.name} • {r.work_experience.job_role.seniority_level}
                              </div>
                            )}
                            {r.show_working_period && (
                              <div className="text-xs text-muted-foreground inline-flex items-center gap-1 mt-0.5">
                                <Calendar className="h-3 w-3" /> {r.work_experience.start_date} → {r.work_experience.end_date}
                              </div>
                            )}
                          </div>
                        </div>
                        {/* Final rating - prominent display */}
                        <div className={cn("rounded-lg border px-4 py-2 text-center min-w-[80px]", getRatingColor(finalRating))}>
                          <div className="text-xs font-semibold mb-0.5">Final Rating</div>
                          <div className="text-2xl font-bold">{r.final_calculated_rating}</div>
                          <div className="text-xs">out of 5</div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="details">
                            <AccordionTrigger>Detailed Ratings & Review</AccordionTrigger>
                            <AccordionContent className="space-y-4">
                              {/* Detailed ratings grid */}
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                <div className="flex items-center justify-between gap-2 rounded-md border px-2 py-1.5">
                                  <span className="text-xs text-muted-foreground">Onboarding</span>
                                  <Badge className={cn("text-xs border", getRatingBadgeColor(r.onboarding))}>
                                    {r.onboarding}
                                  </Badge>
                                </div>
                                <div className="flex items-center justify-between gap-2 rounded-md border px-2 py-1.5">
                                  <span className="text-xs text-muted-foreground">Work-life balance</span>
                                  <Badge className={cn("text-xs border", getRatingBadgeColor(r.work_life_balance))}>
                                    {r.work_life_balance}
                                  </Badge>
                                </div>
                                <div className="flex items-center justify-between gap-2 rounded-md border px-2 py-1.5">
                                  <span className="text-xs text-muted-foreground">Management</span>
                                  <Badge className={cn("text-xs border", getRatingBadgeColor(r.management))}>
                                    {r.management}
                                  </Badge>
                                </div>
                                <div className="flex items-center justify-between gap-2 rounded-md border px-2 py-1.5">
                                  <span className="text-xs text-muted-foreground">Career growth</span>
                                  <Badge className={cn("text-xs border", getRatingBadgeColor(r.career_growth))}>
                                    {r.career_growth}
                                  </Badge>
                                </div>
                                <div className="flex items-center justify-between gap-2 rounded-md border px-2 py-1.5">
                                  <span className="text-xs text-muted-foreground">Promoting process</span>
                                  <Badge className={cn("text-xs border", getRatingBadgeColor(r.promoting_process))}>
                                    {r.promoting_process}
                                  </Badge>
                                </div>
                                <div className="flex items-center justify-between gap-2 rounded-md border px-2 py-1.5">
                                  <span className="text-xs text-muted-foreground">Day-to-day</span>
                                  <Badge className={cn("text-xs border", getRatingBadgeColor(r.day_to_day_atmosphere))}>
                                    {r.day_to_day_atmosphere}
                                  </Badge>
                                </div>
                                <div className="flex items-center justify-between gap-2 rounded-md border px-2 py-1.5">
                                  <span className="text-xs text-muted-foreground">Salary satisfaction</span>
                                  <Badge className={cn("text-xs border", getRatingBadgeColor(r.salary_satisfaction))}>
                                    {r.salary_satisfaction}
                                  </Badge>
                                </div>
                                <div className="flex items-center justify-between gap-2 rounded-md border px-2 py-1.5">
                                  <span className="text-xs text-muted-foreground">Hours flexibility</span>
                                  <Badge className={cn("text-xs border", getRatingBadgeColor(r.work_hours_flexibility))}>
                                    {r.work_hours_flexibility}
                                  </Badge>
                                </div>
                                <div className="flex items-center justify-between gap-2 rounded-md border px-2 py-1.5">
                                  <span className="text-xs text-muted-foreground">Job security</span>
                                  <Badge className={cn("text-xs border", getRatingBadgeColor(r.job_security))}>
                                    {r.job_security}
                                  </Badge>
                                </div>
                                <div className="flex items-center justify-between gap-2 rounded-md border px-2 py-1.5">
                                  <span className="text-xs text-muted-foreground">Recognition</span>
                                  <Badge className={cn("text-xs border", getRatingBadgeColor(r.recognition))}>
                                    {r.recognition}
                                  </Badge>
                                </div>
                                <div className="flex items-center justify-between gap-2 rounded-md border px-2 py-1.5">
                                  <span className="text-xs text-muted-foreground">Team collaboration</span>
                                  <Badge className={cn("text-xs border", getRatingBadgeColor(r.team_collaboration))}>
                                    {r.team_collaboration}
                                  </Badge>
                                </div>
                              </div>

                              {/* Review text - always shown */}
                              <div>
                                <div className="text-xs font-semibold text-foreground/80 mb-2">Review</div>
                                <div className="text-sm leading-relaxed rounded-2xl border bg-muted/50 px-3 py-2">
                                  {r.review_text || (
                                    <span className="text-muted-foreground italic">No review text provided.</span>
                                  )}
                                </div>
                              </div>

                              {/* Advice to management - always shown */}
                              <div>
                                <div className="text-xs font-semibold text-foreground/80 mb-2">Advice to management</div>
                                <div className="text-sm leading-relaxed rounded-2xl border bg-muted/50 px-3 py-2">
                                  {r.advice_to_management || (
                                    <span className="text-muted-foreground italic">No advice provided.</span>
                                  )}
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </CardContent>
                    </Card>
                  );
                })}
                {!isLoadingReviews && (!reviews || reviews.results.length === 0) && (
                  <div className="text-center text-muted-foreground">No reviews yet.</div>
                )}
                {!!reviews && reviews.count > 10 && (
                  <Pagination
                    hasPrevious={Boolean(reviews.previous)}
                    hasNext={Boolean(reviews.next)}
                    onPrevious={() => setReviewsPage((p) => Math.max(1, p - 1))}
                    onNext={() => setReviewsPage((p) => p + 1)}
                  />
                )}
                </section>
              </TabsContent>

              <TabsContent value="salaries">
                <section className="space-y-4">
                {isLoadingSalaries && (
                  <div className="text-center text-muted-foreground">Loading salaries…</div>
                )}
                {!!salaries?.results?.length && salaries.results.map((s: SalarySubmission) => (
                  <Card key={s.id}>
                    <CardHeader className="flex flex-row items-center gap-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-muted">
                            <DollarSign className="h-5 w-5 text-muted-foreground" />
                          </AvatarFallback>
                        </Avatar>
                        <CardTitle className="text-base">
                          {s.work_experience.job_role.job_title.name} • {s.work_experience.job_role.seniority_level}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary" className="text-sm font-semibold px-2 py-1 inline-flex items-center gap-1">
                          <DollarSign className="h-4 w-4" /> {s.salary} {s.currency}
                        </Badge>
                        {s.work_experience.is_verified && (
                          <Badge variant="outline" className="inline-flex items-center gap-1 text-xs">
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-600" /> Verified experience
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground inline-flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" /> {s.work_experience.start_date} → {s.work_experience.end_date}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {!isLoadingSalaries && (!salaries || salaries.results.length === 0) && (
                  <div className="text-center text-muted-foreground">No salaries yet.</div>
                )}
                {!!salaries && salaries.count > 10 && (
                  <Pagination
                    hasPrevious={Boolean(salaries.previous)}
                    hasNext={Boolean(salaries.next)}
                    onPrevious={() => setSalariesPage((p) => Math.max(1, p - 1))}
                    onNext={() => setSalariesPage((p) => p + 1)}
                  />
                )}
                </section>
              </TabsContent>

              <TabsContent value="locations">
                <section className="grid gap-4 md:grid-cols-2">
                {company.locations?.map((loc) => (
                  <Card key={loc.id}>
                    <CardHeader>
                      <CardTitle className="text-base inline-flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" /> {loc.city.name}, {loc.city.state.name}, {loc.city.state.country.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {loc.google_maps_url && (
                        <div className="aspect-video w-full overflow-hidden rounded-md">
                          <iframe
                            src={loc.google_maps_url}
                            className="h-full w-full border-0"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            allowFullScreen
                          />
                        </div>
                      )}
                      {(loc.street || loc.building) && (
                        <div className="text-sm text-muted-foreground inline-flex items-center gap-2">
                          <span>{loc.street || ""} {loc.building || ""}</span>
                        </div>
                      )}
                      <div>
                        <Badge variant={loc.is_certain ? "secondary" : "outline"}>
                          {loc.is_certain ? "Verified" : "Unverified"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {(!company.locations || company.locations.length === 0) && (
                  <div className="text-center text-muted-foreground">No locations listed.</div>
                )}
                </section>
              </TabsContent>
            </Tabs>
          </>
        )}
      
    </Page>
  );
}


