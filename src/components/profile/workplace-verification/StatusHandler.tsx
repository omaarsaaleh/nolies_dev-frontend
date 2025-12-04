import { Loader2, AlertCircle } from "lucide-react";

type StatusHandlerProps = {
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  isEmpty: boolean;
  emptyMessage: string;
};

export function StatusHandler({ isLoading, isError, errorMessage, isEmpty, emptyMessage }: StatusHandlerProps) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground py-8 justify-center">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center gap-2 text-sm text-destructive py-8 justify-center">
        <AlertCircle className="h-4 w-4" />
        {errorMessage ?? "Something went wrong loading data."}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="text-sm text-muted-foreground py-8 text-center">
        {emptyMessage}
      </div>
    );
  }

  return null;
}

