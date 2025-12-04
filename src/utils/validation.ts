export const validateEmailDomain = (email: string, allowedDomains: string[]): boolean => {
  if (allowedDomains.length === 0) {
    return false;
  }

  const emailDomain = email.split("@")[1]?.toLowerCase();
  if (!emailDomain) {
    return false;
  }

  return allowedDomains.map((d) => d.toLowerCase()).includes(emailDomain);
};