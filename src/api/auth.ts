import { unauthenticatedApi, authenticatedApi } from './base';
import {
  type LoginFormData,
  type RegisterFormData
} from '@/types/api/auth.ts';
import { type ResetPasswordFormData } from '@/types/api/auth';

type LoginResponse = {
  access: string;
};

export async function login(formData: LoginFormData): Promise<void> {
  const response = await unauthenticatedApi.post<LoginResponse>("/auth/tokens/", formData);
  const token = response.data.access;
  sessionStorage.setItem("access", token);
}

export async function register(formData: RegisterFormData): Promise<void> {
  const response =await unauthenticatedApi.post("/auth/register/", formData);
  const token = response.data.access;
  sessionStorage.setItem("access", token);
}

type VerifyAccountRequest = {
  otp: string;
}

export async function verifyAccount(otp: string): Promise<void> {
  const payload: VerifyAccountRequest = { otp };
  await authenticatedApi.post("/auth/verify-account/", payload);
}

export async function resendVerification(): Promise<void> {
  await authenticatedApi.post("/auth/resend-otp/");
}

export async function logout(): Promise<void> {
  await authenticatedApi.post("/auth/logout/");
  sessionStorage.removeItem("access");
}

export type ForgetPasswordRequest = {
  username_or_email: string;
};

export async function requestPasswordReset(payload: ForgetPasswordRequest): Promise<void> {
  await unauthenticatedApi.post("/auth/passwords/forget/", payload);
}

export async function resetPassword(payload: ResetPasswordFormData): Promise<void> {
  await unauthenticatedApi.post("/auth/passwords/reset/", payload);
}