import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

type Props = {
  start: string;
  end: string | null | undefined;
  present: boolean;
  onChange: (next: { start: string; end: string | null; present: boolean }) => void;
};

export default function DateRangeInput({ start, end, present, onChange }: Props) {
  return (
    <div className="grid grid-cols-3 gap-2 items-end">
      <Input type="date" value={start} onChange={(e) => onChange({ start: e.target.value, end: end ?? null, present })} />
      <Input type="date" disabled={present} value={end ?? ""} onChange={(e) => onChange({ start, end: e.target.value || null, present })} />
      <label className="flex items-center gap-2 text-sm">
        <Checkbox checked={present} onCheckedChange={(v) => onChange({ start, end: present ? null : end ?? null, present: Boolean(v) })} />
        Present
      </label>
    </div>
  );
}


