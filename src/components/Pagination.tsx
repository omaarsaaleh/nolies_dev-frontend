import { Button } from "@/components/ui/button";

type PaginationProps = {
  hasPrevious: boolean;
  hasNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
  className?: string;
};

export default function Pagination({ hasPrevious, hasNext, onPrevious, onNext, className }: PaginationProps) {
  return (
    <div className={`flex justify-center gap-2 ${className || ""}`}>
      <Button variant="secondary" disabled={!hasPrevious} onClick={onPrevious}>
        Previous
      </Button>
      <Button variant="secondary" disabled={!hasNext} onClick={onNext}>
        Next
      </Button>
    </div>
  );
}


