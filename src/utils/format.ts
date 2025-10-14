export function formatTime(seconds: number) {
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