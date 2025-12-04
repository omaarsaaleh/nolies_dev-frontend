import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Page from "@/components/pages/Page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getCompany, getCompanySalaries, getCompanyReviews } from "@/api/companies";
import type { Company } from "@/types/api/companies";
import type { CompanyReview } from "@/types/api/reviews";
import type { SalarySubmission } from "@/types/api/salaries";
import Pagination from "@/components/common/Pagination";
import { Star, Users, Globe, ExternalLink, MapPin } from "lucide-react";
import { FaXTwitter, FaThreads   } from "react-icons/fa6";
import { LuLinkedin, LuFacebook, LuInstagram  } from "react-icons/lu";
import ReviewCard from "@/components/companies/ReviewCard";

import { cn } from "@/lib/utils";
import type { PaginatedResponse } from "@/types/api/common";
import SalaryCard from "@/components/companies/SalaryCard";
import VerificationBadge from "@/components/common/VerificationBadge";


const PAGE_SIZE = 25 ;

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

  const { data: company, isLoading, isError } = useQuery<Company>({
    queryKey: ["company", slug],
    queryFn: () => getCompany(slug),
    enabled: Boolean(slug),
  });

  const {
    data: reviews,
    isLoading: isLoadingReviews,
  } = useQuery<PaginatedResponse<CompanyReview>>({
    queryKey: ["company-reviews", slug, reviewsPage],
    queryFn: () => getCompanyReviews({ slug, page: reviewsPage, pageSize: PAGE_SIZE }),
    enabled: Boolean(slug) && activeTab === "reviews",
  });

  const {
    data: salaries,
    isLoading: isLoadingSalaries,
  } = useQuery<PaginatedResponse<SalarySubmission>>({
    queryKey: ["company-salaries", slug, salariesPage],
    queryFn: () => getCompanySalaries({ slug, page: salariesPage, pageSize: PAGE_SIZE }),
    enabled: Boolean(slug) && activeTab === "salaries",
  });

  const reviewsTotalPages = Math.ceil((reviews?.count || 0) / PAGE_SIZE);
  const salariesTotalPages = Math.ceil((salaries?.count || 0) / PAGE_SIZE);

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
  
    // for now sort by name
    return Object.fromEntries(
      Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b))
    );
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
            
            {/* Tabs */}
            <div className="mb-4 mt-4 flex items-center justify-center">
                <Tabs value={activeTab} onValueChange={(v: string) => setActiveTab(v as TabKey)}>
                  <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                    <TabsTrigger value="salaries">Salaries</TabsTrigger>
                    <TabsTrigger value="locations">Locations</TabsTrigger>
                  </TabsList>
                </Tabs>
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
                      {Object.keys(technologiesByCategory).length > 0 && (
                        <div>
                          <CardHeading text="Technologies"/>
                          <div className="space-y-4">
                            {Object.entries(technologiesByCategory).map(([categoryName, technologies]) => (
                              <div key={categoryName} className="space-y-2">
                                <CardSubHeading text={categoryName}/>
                                <div className="flex flex-wrap gap-4">
                                  {technologies.map((tech) => (
                                    <div key={tech.id} className="flex flex-col items-center">
                                      <div className="p-2 rounded-full flex items-center justify-center w-12 h-12">
                                        <i className={`${tech.devicon_class_light} text-4xl block dark:hidden`}></i>
                                        <i className={`${tech.devicon_class_dark} text-4xl hidden dark:block`}></i>
                                      </div>
                                      <span className="text-xs font-medium text-center">{tech.name}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
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
                {!!reviews?.results?.length &&  
                  <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                    {reviews.results.map((r: CompanyReview) => 
                      <ReviewCard key={r.id} review={r}/>
                    )}
                  </div>
                }
                {!isLoadingReviews && (!reviews || reviews.results.length === 0) && (
                  <div className="text-center text-muted-foreground">No reviews yet.</div>
                )}
                {!!reviews && reviewsTotalPages > 1 && (
                  <Pagination
                    totalPages={reviewsTotalPages}
                    currentPage={reviewsPage}
                    setCurrentPage={setReviewsPage}
                  />
                )}
                </section>
              </TabsContent>

              <TabsContent value="salaries">
                <section className="space-y-4">
                  {isLoadingSalaries && (
                    <div className="text-center text-muted-foreground">Loading salaries…</div>
                  )}
                  {!!salaries?.results?.length && (
                      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                        { 
                          salaries.results.map((s: SalarySubmission) => (
                            <SalaryCard key={s.id} salarySubmission={s}/>
                          ))
                        }
                      </div>
                    )
                  }
                  {!isLoadingSalaries && (!salaries || salaries.results.length === 0) && (
                    <div className="text-center text-muted-foreground">No salaries submissions yet.</div>
                  )}
                  {!!salaries && salariesTotalPages > 1 && (
                    <Pagination
                      totalPages={salariesTotalPages}
                      currentPage={salariesPage}
                      setCurrentPage={setSalariesPage}
                    />
                  )}
                </section>
              </TabsContent>

              <TabsContent value="locations">
                {company.locations?.map((loc) => (
                <section className="grid gap-4 md:grid-cols-2">
                  <Card key={loc.id}>
                    <CardHeader>
                      <CardTitle className="text-base flex flex-col gap-2">
                        <div className="flex items-center justify-between gap-4">
                          <div className="inline-flex items-center gap-2 flex-wrap">
                            <MapPin className="h-4 w-4 text-primary flex-shrink-0" /> 
                            <Link 
                              to={`/locations/cities/${loc.city.slug}`}
                              className="hover:underline"
                            >
                              {loc.city.name}
                            </Link>
                            <span className="text-muted-foreground">-</span>
                            <Link 
                              to={`/locations/states/${loc.city.state.slug}`}
                              className="hover:underline"
                            >
                              {loc.city.state.name}
                            </Link>
                            <span className="text-muted-foreground">-</span>
                            <Link 
                              to={`/locations/countries/${loc.city.state.country.slug}`}
                              className="hover:underline"
                            >
                              {loc.city.state.country.name}
                            </Link>
                          </div>
                          <VerificationBadge isVerified={loc.is_verified}/>
                        </div>
                        {(loc.street || loc.building) && (
                          <div className="text-sm text-muted-foreground pl-6">
                            {loc.building || ""} - {loc.street || ""} 
                          </div>
                        )}
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
                      
                    </CardContent>
                  </Card>
                </section>
                ))}
                {(!company.locations || company.locations.length === 0) && (
                  <section>
                    <div className="text-center text-muted-foreground">No locations available.</div>
                  </section>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      
    </Page>
  );
}


