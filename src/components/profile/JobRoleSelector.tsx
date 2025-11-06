import { Input } from "@/components/ui/input";

type Props = {
  value?: number | string;
  onChange?: (value: number) => void;
};

// Minimal numeric input for job_role id; can be replaced with proper selector
export default function JobRoleSelector({ value, onChange }: Props) {
  return (
    <Input type="number" value={value as any} onChange={(e) => onChange?.(Number(e.target.value))} />
  );
}


