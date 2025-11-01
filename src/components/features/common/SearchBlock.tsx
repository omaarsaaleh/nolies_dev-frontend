import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, Filter, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ReactNode } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import Pagination from '@/components/features/common/Pagination';


interface SearchBlockProps {
  searchTerm?: string;
  setSearchTerm: (value: string) => void;
  searchPlaceHolder: string;

  filters?: ReactNode[];
  hasActiveFilters?: boolean;
  handleClearFilters?: () => void;

  verboseName: string;
  verboseNamePlural: string;

  searchResults?: ReactNode[]; 
  isSearchResultsLoading?: boolean;
  isSearchResultsError?: boolean;
  searchResultsCount?: number

  totalPages: number,
  currentPage: number,
  setCurrentPage: (value: number) => void 
} 

export default function SearchBlock({
  searchTerm,
  setSearchTerm,
  searchPlaceHolder = "Search ...",

  filters,
  hasActiveFilters,
  handleClearFilters,

  verboseName,
  verboseNamePlural,

  searchResults,
  isSearchResultsLoading,
  isSearchResultsError,
  searchResultsCount,

  totalPages,
  currentPage,
  setCurrentPage
}  : SearchBlockProps
){
  

  let searchResultsContent ;
  if(isSearchResultsLoading){
    searchResultsContent = (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 bg-muted rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                    <div className="h-3 bg-muted rounded w-1/3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    );
  }
  else if(isSearchResultsError){
    searchResultsContent = (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-destructive">Failed to load {verboseNamePlural}. Please try again.</p>
        </CardContent>
      </Card>
    );
  }
  else if(searchResults && searchResultsCount){
    searchResultsContent = (
      <>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {searchResultsCount} {searchResultsCount === 1 ? verboseName : verboseNamePlural} found
          </p>
        </div>
        <>
          {searchResults.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No {verboseNamePlural} found matching your criteria.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults}
            </div>
          )}

          {/* Pagination */}
          <Pagination totalPages={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage}/>
        </>
      </>
    )
  }


  return(
    <div className="p-6 space-y-6">
      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={searchPlaceHolder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Collapsible Filters */}
      {filters && filters.length > 0 && (
        <Accordion type="single" collapsible defaultValue="filters" className="w-full">
          <AccordionItem value="filters" className="border-none">
            <AccordionTrigger className="hover:no-underline py-2">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                {hasActiveFilters && (
                  <Badge variant="secondary" className="text-xs">
                    Active
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <div className="space-y-6">
                {/* Filters Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {filters}
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      onClick={handleClearFilters}
                      className="flex items-center gap-2"
                    >
                      <X className="h-4 w-4" />
                      Clear filters
                    </Button>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      {/* Results */}
      <div className="space-y-4">
        {searchResultsContent}
      </div>
  </div>
  )
}