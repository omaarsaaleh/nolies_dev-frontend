
import { type CompanyMinimal } from "@/types/api/companies";
import React from 'react';

// work email
export interface WorkEmailVerificationData {
  work_email: string;
}
export interface WorkEmailAttemptData {
  work_email: string;
  is_locked: boolean;
  lock_reason: string | null;
  last_sent_at: string | null;
}

//  type registry
export const VERIFICATION_REGISTRY = {
  WORK_EMAIL: {
    verification: {} as WorkEmailVerificationData,
    attempt: {} as WorkEmailAttemptData,
  },
} as const;

// auto defined
export type VerificationType = keyof typeof VERIFICATION_REGISTRY;

export type VerificationDataMap = {
  [K in VerificationType]: (typeof VERIFICATION_REGISTRY)[K]["verification"];
};

export type AttemptDataMap = {
  [K in VerificationType]: (typeof VERIFICATION_REGISTRY)[K]["attempt"];
};

// options
export type VerificationTypeOption = {
  value: VerificationType;
  label: string;
  description: string;
  onAttemptCreateMessage: string
  icon:  React.ComponentType<React.SVGProps<SVGSVGElement>>;
};


// skeleton
export interface WorkplaceVerification<T extends VerificationType = VerificationType> {
  id: number;
  type: T;
  company: CompanyMinimal;
  created_at: string;
  verification: VerificationDataMap[T];
}
export interface WorkplaceVerificationAttempt<T extends VerificationType = VerificationType> {
  id: number;
  type: T;
  company: CompanyMinimal;
  is_verified: boolean;
  created_at: string;
  attempt: AttemptDataMap[T];
}
