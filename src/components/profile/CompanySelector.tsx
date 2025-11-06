import { Input } from "@/components/ui/input";

type Props = {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
};

// Minimal slug input placeholder; can be upgraded to async searchable
export default function CompanySelector({ value, onChange, placeholder }: Props) {
  return (
    <Input value={value} onChange={(e) => onChange?.(e.target.value)} placeholder={placeholder ?? "company-slug"} />
  );
}


