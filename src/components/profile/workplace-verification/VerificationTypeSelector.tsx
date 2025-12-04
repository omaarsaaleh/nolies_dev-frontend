import { cn } from "@/lib/utils";
import { VERIFICATION_TYPES} from "@/constants/api/profile";
import { type VerificationTypeOption } from "@/types/api/verifications";


type VerificationTypeSelectorProps = {
  selectedType: VerificationTypeOption;
  onSelect: (type: VerificationTypeOption) => void;
  options?: VerificationTypeOption[];
};

export function VerificationTypeSelector({
  selectedType,
  onSelect,
  options = Object.values(VERIFICATION_TYPES),
}: VerificationTypeSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <>
        <button
          key={option.value}
          type="button"
          onClick={() => onSelect(option)}
          className={cn(
            "border rounded-lg px-3 py-2 text-left transition-colors w-full sm:w-auto",
            selectedType.value === option.value
              ? "border-primary bg-primary/5"
              : "border-border hover:border-foreground/40"
          )}
        >
          <div className="flex items-center gap-2">
            <option.icon/>
            <div className="flex flex-col">
              <span className="font-medium text-sm">{option.label}</span>
              <span className="text-muted-foreground text-xs">{option.description}</span>
            </div>
          </div>
        </button>
        </>
      ))}
    </div>
  );
}
