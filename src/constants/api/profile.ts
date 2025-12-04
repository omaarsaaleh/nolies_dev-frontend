import {MINUTE} from '@/constants/time';
import type { VerificationTypeOption, VerificationType } from '@/types/api/verifications';
import { Mail } from 'lucide-react';

export const WORK_EMAIL_OTP_LENGTH = 6;
export const WORK_EMAIL_OTP_EXPIRATION = MINUTE * 15;
export const WORK_EMAIL_OTP_RESEND_COOLDOWN = MINUTE * 2

  
export const VERIFICATION_TYPES: Record<VerificationType, VerificationTypeOption> = {
  WORK_EMAIL: {
    value: "WORK_EMAIL",
    label: "Work Email",
    description: "Verify via company email.",
    onAttemptCreateMessage: "Verification email sent.",
    icon: Mail,
  },
};

