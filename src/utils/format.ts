// time

export function formatPeriod(seconds: number) {
  if (seconds <= 0) 
    throw new Error("Time must be greater than one second");

  const units = [
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  const parts = [];

  for (const { label, seconds: unitSeconds } of units) {
    if (seconds >= unitSeconds) {
      const value = Math.floor(seconds / unitSeconds);
      seconds %= unitSeconds;
      parts.push(`${value} ${label}${value > 1 ? "s" : ""}`);
    }
  }

  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return parts.join(" and ");

  return `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`;
}

export function formatLocalDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatLocalDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// string

export function getInitials(
  source: string | string[],
  split?: string,
  takeLast?: boolean
): string {
  const parts: string[] = typeof source === 'string'
    ? source.split(split ?? ' ')
    : source;

  const filtered = parts.filter(p => p.trim() !== ''); 

  let selected: string[];

  if (takeLast && filtered.length > 1) 
    selected = [filtered[0], filtered[filtered.length - 1]];
  else 
    selected = filtered.slice(0, 2);

  return selected
    .map(part => part[0] ?? '')
    .join('')
    .toUpperCase();
}
