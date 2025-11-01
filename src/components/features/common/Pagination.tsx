import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
};

export default function Pagination({ totalPages, currentPage, setCurrentPage}: PaginationProps) {
  return (
    <>
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-1">
            {(() => {
              const items: (number | "ellipsis")[] = [];
              
              if (totalPages <= 5) {
                // show all
                for (let i = 1; i <= totalPages; i++) items.push(i);
              } 
              else {
                if (currentPage <= 2) {
                  items.push(1, 2);
                } 
                else if (currentPage >= totalPages - 3) {
                  const startPage = Math.max(1, totalPages - 3);
                  for (let i = startPage; i <= totalPages; i++) {
                    items.push(i);
                  }
                } 
                else {
                  items.push(currentPage);
                  if (currentPage < totalPages) {
                    items.push(currentPage + 1);
                  }
                }
                
                const pageSet = new Set(items.filter(item => typeof item === 'number') as number[]);
                const lastItemAdded = Math.max(...(items.filter(item => typeof item === 'number') as number[]));
                const lastTwoStart = totalPages - 1;
                
                if (lastItemAdded < lastTwoStart && currentPage < totalPages - 1) {
                  items.push("ellipsis");
                }
                
                if (currentPage < totalPages - 1) {
                  if (!pageSet.has(totalPages - 1)) {
                    items.push(totalPages - 1);
                  }
                  if (!pageSet.has(totalPages)) {
                    items.push(totalPages);
                  }
                }
              }

              return items.map((item, idx) => {
                if (item === "ellipsis") {
                  return (
                    <Button key={`ellipsis-${idx}`} variant="outline" size="sm" disabled className="w-8 h-8 p-0 cursor-default">
                      …
                    </Button>
                  );
                }

                const pageNum = item as number;
                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className="w-8 h-8 p-0"
                  >
                    {pageNum}
                  </Button>
                );
              });
            })()}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </>
  );
}