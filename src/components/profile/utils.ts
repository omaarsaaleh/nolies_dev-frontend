export type RoleInput = {
  id?: number;
  job_role: number;
  start_date: string;
  end_date?: string | null;
  present?: boolean;
};

export function validateRolesNoOverlapAndPresent(roles: RoleInput[]): string[] {
  const errors: string[] = [];
  if (!roles || roles.length === 0) return errors;

  const presentCount = roles.filter(r => r.present).length;
  if (presentCount > 1) errors.push("Only one role can be marked as present.");

  const parseDate = (s?: string | null) => (s ? new Date(s).getTime() : undefined);
  const latestStart = Math.max(...roles.map(r => parseDate(r.start_date) ?? 0));
  const presentRole = roles.find(r => r.present);
  if (presentRole && parseDate(presentRole.start_date) !== latestStart) {
    errors.push("Present role must have the latest start date.");
  }

  const intervals = roles.map(r => ({
    start: parseDate(r.start_date)!,
    end: r.present || r.end_date == null ? Number.POSITIVE_INFINITY : parseDate(r.end_date)!,
  }));
  for (let i = 0; i < intervals.length; i++) {
    for (let j = i + 1; j < intervals.length; j++) {
      const a = intervals[i];
      const b = intervals[j];
      const overlap = a.start <= b.end && b.start <= a.end;
      if (overlap) {
        errors.push("Roles date ranges must not overlap.");
        i = intervals.length;
        break;
      }
    }
  }

  return errors;
}


