export type User = {
  first_name: string;
  last_name: string;
  email: string;
  is_verified: boolean;
  is_locked: boolean;
  lock_reason?: string;
};
