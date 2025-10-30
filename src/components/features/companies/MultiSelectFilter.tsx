import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Operator } from "@/types/api/common";

interface Option {
  id: number;
  name: string;
}

interface MultiSelectFilterProps {
  label: string;
  options: Option[];
  selectedIds: number[];
  operator: Operator;
  onSelectionChange: (ids: number[]) => void;
  onOperatorChange: (operator: Operator) => void;
  placeholder?: string;
  className?: string;
}

export default function MultiSelectFilter({
  label,
  options,
  selectedIds,
  operator,
  onSelectionChange,
  onOperatorChange,
  placeholder = "Select options...",
  className,
}: MultiSelectFilterProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = options.filter(option =>
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOptions = options.filter(option => selectedIds.includes(option.id));

  const handleToggleOption = (optionId: number) => {
    if (selectedIds.includes(optionId)) {
      onSelectionChange(selectedIds.filter(id => id !== optionId));
    } else {
      onSelectionChange([...selectedIds, optionId]);
    }
  };

  const handleClearAll = () => {
    onSelectionChange([]);
  };

  const handleOperatorToggle = () => {
    onOperatorChange(operator === "AND" ? "OR" : "AND");
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        {selectedIds.length > 1 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleOperatorToggle}
            className="h-6 px-2 text-xs"
          >
            {operator}
          </Button>
        )}
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-auto min-h-[2.5rem] py-2"
          >
            <div className="flex-1 flex items-center gap-1 min-w-0">
              {selectedOptions.length > 0 ? (
                <div className="flex flex-wrap gap-1 max-w-[calc(100%-2rem)]">
                  {selectedOptions.slice(0, 1).map(option => (
                    <Badge key={option.id} variant="secondary" className="text-xs shrink-0">
                      {option.name}
                    </Badge>
                  ))}
                  {selectedOptions.length > 1 && (
                    <Badge variant="secondary" className="text-xs shrink-0">
                      +{selectedOptions.length - 1}
                    </Badge>
                  )}
                </div>
              ) : (
                <span className="text-muted-foreground truncate">{placeholder}</span>
              )}
            </div>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0">
          <div className="p-3 border-b">
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8"
            />
          </div>
          <div className="max-h-60 overflow-auto">
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-sm text-muted-foreground text-center">
                No options found
              </div>
            ) : (
              <div className="p-1">
                {filteredOptions.map((option) => (
                  <div
                    key={option.id}
                    className="flex items-center space-x-2 p-2 hover:bg-accent rounded-sm cursor-pointer"
                    onClick={() => handleToggleOption(option.id)}
                  >
                    <div className="flex h-4 w-4 items-center justify-center">
                      {selectedIds.includes(option.id) && (
                        <Check className="h-4 w-4" />
                      )}
                    </div>
                    <span className="text-sm">{option.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          {selectedIds.length > 0 && (
            <div className="p-3 border-t">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="w-full"
              >
                <X className="h-4 w-4 mr-2" />
                Clear all
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>

      {/* Selected tags */}
      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedOptions.map((option) => (
            <Badge
              key={option.id}
              variant="secondary"
              className="text-xs cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
              onClick={() => handleToggleOption(option.id)}
            >
              {option.name}
              <X className="h-3 w-3 ml-1" />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
