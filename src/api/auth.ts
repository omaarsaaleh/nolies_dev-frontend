import { unauthenticatedApi } from './base';
import {
  type LoginFormData,
  type RegisterFormData
} from '@/types/api/auth.ts';

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